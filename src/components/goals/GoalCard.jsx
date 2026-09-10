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
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-5">
        {/* ================= HEADER ================= */}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="card-title text-base">{goal.title}</h2>

            {goal.description && (
              <p className="mt-1 text-sm text-base-content/60">
                {goal.description}
              </p>
            )}
          </div>

          <span className={`badge capitalize ${getStatusBadge()}`}>
            {goal.status}
          </span>
        </div>

        {/* ================= PROGRESS ================= */}

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="text-base-content/60">Progress</span>

            <span className="font-semibold">
              {currentProgress} / {target}
              {goal.unit ? ` ${goal.unit}` : ""}
            </span>
          </div>

          <progress
            className={`progress w-full ${
              percentage >= 100 ? "progress-success" : "progress-primary"
            }`}
            value={percentage}
            max="100"
          />

          <div className="mt-1 text-right text-xs text-base-content/50">
            {percentage}% complete
          </div>
        </div>

        {/* ================= DATES ================= */}

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-base-200 p-3">
          <div>
            <p className="text-xs text-base-content/50">Started</p>

            <p className="mt-1 text-sm font-medium">
              {formatDate(goal.startDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-base-content/50">Deadline</p>

            <p className="mt-1 text-sm font-medium">
              {formatDate(goal.deadLine)}
            </p>
          </div>
        </div>

        {/* ================= ATTACHED HABITS ================= */}

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-base-content/60">
                Attached Habits
              </span>

              <span className="ml-2 badge badge-sm">
                {attachedHabits.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowHabitSelector((prev) => !prev);
                setHabitError("");
              }}
              className="btn btn-xs btn-outline"
              disabled={habitLoading}
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
                    className="flex items-center justify-between rounded-lg border border-base-300 bg-base-200 px-3 py-2"
                  >
                    <span className="truncate text-sm font-medium">
                      {getHabitName(habit)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveHabit(habitId)}
                      disabled={habitLoading}
                      className="btn btn-xs btn-ghost text-error"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-2 text-xs text-base-content/50">
              No habits attached to this goal.
            </p>
          )}

          {/* Habit selector */}
          {showHabitSelector && (
            <div className="mt-3 rounded-lg border border-base-300 bg-base-200 p-3">
              {availableHabits.length > 0 ? (
                <>
                  <select
                    value={selectedHabitId}
                    onChange={(e) => setSelectedHabitId(e.target.value)}
                    className="select select-bordered select-sm w-full"
                  >
                    <option value="">Select a habit</option>

                    {availableHabits.map((habit) => (
                      <option key={habit._id} value={habit._id}>
                        {habit.habitName}
                      </option>
                    ))}
                  </select>

                  {habitError && (
                    <p className="mt-2 text-xs text-error">{habitError}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleAttachHabit}
                    disabled={!selectedHabitId || habitLoading}
                    className="btn btn-primary btn-sm mt-3"
                  >
                    {habitLoading ? "Attaching..." : "Attach Habit"}
                  </button>
                </>
              ) : (
                <p className="text-sm text-base-content/60">
                  All your habits are already attached to this goal.
                </p>
              )}
            </div>
          )}

          {habitError && !showHabitSelector && (
            <p className="mt-2 text-xs text-error">{habitError}</p>
          )}
        </div>

        {/* ================= ACTIONS ================= */}

        <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-base-200 pt-4">
          {onViewProgress && (
            <button
              type="button"
              onClick={() => onViewProgress(goal)}
              className="btn btn-sm btn-ghost"
            >
              Progress
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(goal)}
              className="btn btn-sm btn-ghost"
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(goal._id)}
              className="btn btn-sm btn-ghost text-error"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
