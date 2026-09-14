import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { attachHabitToGoal, detachHabitFromGoal } from "../../redux/goalSlice";

const GoalCard = ({ goal, onEdit, onDelete, onViewProgress }) => {
  const dispatch = useDispatch();

  const { habits } = useSelector((store) => store.habit);

  const [showHabitSelector, setShowHabitSelector] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState("");
  const [habitLoading, setHabitLoading] = useState(false);
  const [habitError, setHabitError] = useState("");

  const target = Number(goal.target) || 0;
  const currentProgress = Number(goal.currentProgress) || 0;

  const percentage =
    target > 0
      ? Math.min(100, Math.round((currentProgress / target) * 100))
      : 0;

  const attachedHabits = goal.habitIds || [];

  const attachedHabitIds = attachedHabits.map((habit) =>
    typeof habit === "string" ? habit : habit._id,
  );

  const availableHabits = habits.filter(
    (habit) => !attachedHabitIds.includes(habit._id),
  );

  const getStatusBadge = () => {
    switch (goal.status) {
      case "completed":
        return "badge-success";

      case "cancelled":
        return "badge-error";

      case "expired":
        return "badge-warning";

      default:
        return "badge-primary";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleAttachHabit = async () => {
    if (!selectedHabitId) {
      setHabitError("Please select a habit.");
      return;
    }

    setHabitError("");
    setHabitLoading(true);

    try {
      await dispatch(
        attachHabitToGoal({
          goalId: goal._id,
          habitId: selectedHabitId,
        }),
      ).unwrap();

      setSelectedHabitId("");
      setShowHabitSelector(false);
    } catch (err) {
      setHabitError(err?.message || "Failed to attach habit.");
    } finally {
      setHabitLoading(false);
    }
  };

  const handleRemoveHabit = async (habitId) => {
    const confirmed = window.confirm("Remove this habit from the goal?");

    if (!confirmed) return;

    setHabitError("");
    setHabitLoading(true);

    try {
      await dispatch(
        detachHabitFromGoal({
          goalId: goal._id,
          habitId,
        }),
      ).unwrap();
    } catch (err) {
      setHabitError(err?.message || "Failed to remove habit.");
    } finally {
      setHabitLoading(false);
    }
  };

  const getHabitName = (habit) => {
    if (typeof habit === "object") {
      return habit.habitName || "Unnamed habit";
    }

    const foundHabit = habits.find((item) => item._id === habit);

    return foundHabit?.habitName || "Unnamed habit";
  };

  return (
    <article className="group rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-5 sm:p-6">
        {/* ================= HEADER ================= */}

        <div className="flex items-start gap-4">
          {/* Goal icon */}
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg sm:flex">
            🎯
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-base-content">
                  {goal.title}
                </h2>

                {goal.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-base-content/60">
                    {goal.description}
                  </p>
                )}
              </div>

              <span className={`badge badge-sm capitalize ${getStatusBadge()}`}>
                {goal.status}
              </span>
            </div>
          </div>
        </div>

        {/* ================= PROGRESS ================= */}

        <div className="mt-6 rounded-xl bg-base-200 p-4">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-base-content/50">
                Progress
              </p>

              <p className="mt-1 text-sm font-semibold text-base-content">
                {currentProgress} / {target}
                {goal.unit ? ` ${goal.unit}` : ""}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`text-lg font-bold ${
                  percentage >= 100 ? "text-success" : "text-primary"
                }`}
              >
                {percentage}%
              </span>

              <p className="text-[11px] text-base-content/50">complete</p>
            </div>
          </div>

          <progress
            className={`progress w-full ${
              percentage >= 100 ? "progress-success" : "progress-primary"
            }`}
            value={percentage}
            max="100"
          />
        </div>

        {/* ================= DATES ================= */}

        <div className="mt-4 grid grid-cols-2 divide-x divide-base-300 rounded-xl border border-base-300 bg-base-100">
          <div className="p-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/45">
              Started
            </p>

            <p className="mt-1 text-sm font-medium text-base-content">
              {formatDate(goal.startDate)}
            </p>
          </div>

          <div className="p-3.5 pl-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/45">
              Deadline
            </p>

            <p className="mt-1 text-sm font-medium text-base-content">
              {formatDate(goal.deadLine)}
            </p>
          </div>
        </div>

        {/* ================= ATTACHED HABITS ================= */}

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm font-semibold text-base-content">
                  Habits
                </p>

                <p className="text-xs text-base-content/50">
                  Habits supporting this goal
                </p>
              </div>

              <span className="badge badge-sm bg-primary/10 text-primary border-0">
                {attachedHabits.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowHabitSelector((prev) => !prev);
                setHabitError("");
                setSelectedHabitId("");
              }}
              disabled={habitLoading}
              className="btn btn-xs btn-outline border-base-300 hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              {showHabitSelector ? "Cancel" : "+ Add Habit"}
            </button>
          </div>

          {/* Attached habit list */}

          {attachedHabits.length > 0 ? (
            <div className="mt-3 space-y-2">
              {attachedHabits.map((habit) => {
                const habitId = typeof habit === "string" ? habit : habit._id;

                return (
                  <div
                    key={habitId}
                    className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-200 px-3.5 py-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-sm">
                      ✓
                    </div>

                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-base-content">
                      {getHabitName(habit)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveHabit(habitId)}
                      disabled={habitLoading}
                      className="btn btn-xs btn-ghost text-error hover:bg-error/10"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-base-300 px-4 py-5 text-center">
              <div className="text-2xl">🌱</div>

              <p className="mt-2 text-sm font-medium text-base-content">
                No habits attached
              </p>

              <p className="mt-1 text-xs text-base-content/50">
                Add habits that help you reach this goal.
              </p>
            </div>
          )}

          {/* ================= HABIT SELECTOR ================= */}

          {showHabitSelector && (
            <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="mb-3">
                <p className="text-sm font-semibold text-base-content">
                  Add a supporting habit
                </p>

                <p className="mt-0.5 text-xs text-base-content/60">
                  Choose one of your existing habits.
                </p>
              </div>

              {availableHabits.length > 0 ? (
                <>
                  <select
                    value={selectedHabitId}
                    onChange={(e) => {
                      setSelectedHabitId(e.target.value);

                      if (habitError) {
                        setHabitError("");
                      }
                    }}
                    className="select select-bordered select-sm w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none"
                  >
                    <option value="">Select a habit</option>

                    {availableHabits.map((habit) => (
                      <option key={habit._id} value={habit._id}>
                        {habit.habitName}
                      </option>
                    ))}
                  </select>

                  {habitError && (
                    <div className="mt-2 rounded-lg border border-error/20 bg-error/10 px-3 py-2 text-xs font-medium text-error">
                      {habitError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAttachHabit}
                    disabled={!selectedHabitId || habitLoading}
                    className="btn btn-primary btn-sm mt-3"
                  >
                    {habitLoading ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />
                        Attaching...
                      </>
                    ) : (
                      "Attach Habit"
                    )}
                  </button>
                </>
              ) : (
                <div className="rounded-lg bg-base-100 px-3 py-3">
                  <p className="text-sm text-base-content/60">
                    All your habits are already attached to this goal.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error after selector closes */}

          {habitError && !showHabitSelector && (
            <div className="mt-3 rounded-lg border border-error/20 bg-error/10 px-3 py-2 text-xs font-medium text-error">
              {habitError}
            </div>
          )}
        </div>

        {/* ================= ACTIONS ================= */}

        {(onViewProgress || onEdit || onDelete) && (
          <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-base-300 pt-4">
            {onViewProgress && (
              <button
                type="button"
                onClick={() => onViewProgress(goal)}
                className="btn btn-sm btn-ghost text-base-content/70 hover:bg-base-200 hover:text-base-content"
              >
                View Progress
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(goal)}
                className="btn btn-sm btn-ghost text-base-content/70 hover:bg-base-200 hover:text-base-content"
              >
                Edit
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(goal._id)}
                className="btn btn-sm btn-ghost text-error hover:bg-error/10"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default GoalCard;
