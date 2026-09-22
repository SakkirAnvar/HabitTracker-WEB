import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  attachHabitToGoal,
  detachHabitFromGoal,
} from "../../redux/goalSlice";

const GoalCard = ({
  goal,
  onEdit,
  onDelete,
  onViewProgress,
  onHabitRemoved,
}) => {
  const dispatch = useDispatch();

  const { habits } = useSelector((store) => store.habit);

  const [showHabitSelector, setShowHabitSelector] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState("");
  const [habitLoading, setHabitLoading] = useState(false);
  const [habitError, setHabitError] = useState("");

  // =========================
  // PROGRESS
  // =========================

  const target = Number(goal.target) || 0;
  const currentProgress = Number(goal.currentProgress) || 0;

  const percentage =
    goal.progressPercentage != null
      ? Math.min(
          100,
          Math.max(0, Number(goal.progressPercentage) || 0),
        )
      : target > 0
        ? Math.min(
            100,
            Math.round((currentProgress / target) * 100),
          )
        : 0;

  // =========================
  // HABITS
  // =========================

  const attachedHabits = goal.habitIds || [];

  const attachedHabitIds = attachedHabits.map((habit) =>
    typeof habit === "string" ? habit : habit._id,
  );

  const availableHabits = habits.filter(
    (habit) => !attachedHabitIds.includes(habit._id),
  );

  // =========================
  // STATUS
  // =========================

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          className: "bg-success/10 text-success",
        };

      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-error/10 text-error",
        };

      case "expired":
        return {
          label: "Expired",
          className: "bg-warning/10 text-warning",
        };

      default:
        return {
          label: "Active",
          className: "bg-primary text-primary-content",
        };
    }
  };

  const statusConfig = getStatusConfig(goal.status);

  // =========================
  // DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysLeft = () => {
    if (!goal.deadLine) return null;

    const today = new Date();
    const deadline = new Date(goal.deadLine);

    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const difference = deadline.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24),
    );
  };

  const daysLeft = getDaysLeft();

  // =========================
  // HABIT NAME
  // =========================

  const getHabitName = (habit) => {
    if (typeof habit === "object") {
      return habit.habitName || "Unnamed habit";
    }

    const foundHabit = habits.find(
      (item) => item._id === habit,
    );

    return foundHabit?.habitName || "Unnamed habit";
  };

  // =========================
  // ATTACH HABIT
  // =========================

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

      onHabitRemoved?.(
        "success",
        "Habit added to goal successfully.",
      );
    } catch (err) {
      setHabitError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to attach habit.",
      );
    } finally {
      setHabitLoading(false);
    }
  };

  // =========================
  // REMOVE HABIT
  // =========================

  const handleRemoveHabit = async (habitId) => {
    setHabitError("");
    setHabitLoading(true);

    try {
      await dispatch(
        detachHabitFromGoal({
          goalId: goal._id,
          habitId,
        }),
      ).unwrap();

      onHabitRemoved?.(
        "success",
        "Habit removed from goal successfully.",
      );
    } catch (err) {
      onHabitRemoved?.(
        "error",
        typeof err === "string"
          ? err
          : err?.message || "Failed to remove habit from goal.",
      );
    } finally {
      setHabitLoading(false);
    }
  };

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      {/* ================= HEADER ================= */}

      <div className="flex items-start gap-4">
        {/* Icon */}

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
          🎯
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            {/* Title */}

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-base-content">
                {goal.title}
              </h2>

              {goal.description && (
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-base-content/55">
                  {goal.description}
                </p>
              )}
            </div>

            {/* Status + Menu */}

            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusConfig.className}`}
              >
                {statusConfig.label}
              </span>

              {(onViewProgress || onEdit || onDelete) && (
                <div className="dropdown dropdown-end">
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label="Goal options"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xl leading-none text-base-content/40 transition hover:bg-base-200 hover:text-base-content"
                  >
                    ⋮
                  </button>

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu z-50 mt-1 w-40 rounded-xl border border-base-300 bg-base-100 p-1.5 shadow-lg"
                  >
                    {onViewProgress && (
                      <li>
                        <button
                          type="button"
                          onClick={() => onViewProgress(goal)}
                          className="flex items-center gap-2"
                        >
                          <EyeIcon />
                          View Progress
                        </button>
                      </li>
                    )}

                    {onEdit && (
                      <li>
                        <button
                          type="button"
                          onClick={() => onEdit(goal)}
                          className="flex items-center gap-2"
                        >
                          <EditIcon />
                          Edit
                        </button>
                      </li>
                    )}

                    {onDelete && (
                      <li>
                        <button
                          type="button"
                          onClick={() => onDelete(goal)}
                          className="flex items-center gap-2 text-error hover:bg-error/10"
                        >
                          <DeleteIcon />
                          Delete
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= PROGRESS ================= */}

      <div className="mt-6">
        <div className="mb-2 flex items-end justify-between gap-3">
          <p className="text-2xl font-bold text-base-content">
            {percentage}%
          </p>

          <p className="text-xs font-medium text-base-content/45">
            {currentProgress} / {target}
            {goal.unit ? ` ${goal.unit}` : ""}
          </p>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-base-300">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage >= 100
                ? "bg-success"
                : "bg-primary"
            }`}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      {/* ================= META ================= */}

      <div className="mt-5 grid grid-cols-3 divide-x divide-base-300 border-y border-base-300 py-4">
        {/* Started */}

        <div className="pr-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
            Started
          </p>

          <p className="mt-1 text-xs font-semibold text-base-content sm:text-sm">
            {formatDate(goal.startDate)}
          </p>
        </div>

        {/* Deadline */}

        <div className="px-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
            Deadline
          </p>

          <p className="mt-1 text-xs font-semibold text-base-content sm:text-sm">
            {formatDate(goal.deadLine)}
          </p>
        </div>

        {/* Time left */}

        <div className="pl-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
            Time left
          </p>

          <p
            className={`mt-1 text-xs font-semibold sm:text-sm ${
              daysLeft !== null && daysLeft < 0
                ? "text-error"
                : daysLeft !== null && daysLeft <= 7
                  ? "text-warning"
                  : "text-base-content"
            }`}
          >
            {daysLeft === null
              ? "-"
              : daysLeft < 0
                ? "Overdue"
                : daysLeft === 0
                  ? "Today"
                  : `${daysLeft} days`}
          </p>
        </div>
      </div>

      {/* ================= HABITS ================= */}

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm font-semibold text-base-content">
                Habits
              </p>

              <p className="text-xs text-base-content/45">
                Supporting this goal
              </p>
            </div>

            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
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
            className="rounded-full border border-base-300 px-3 py-1.5 text-xs font-semibold text-base-content/70 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            {showHabitSelector ? "Cancel" : "+ Add Habit"}
          </button>
        </div>

        {/* ================= ATTACHED HABITS ================= */}

        {attachedHabits.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {attachedHabits.map((habit) => {
              const habitId =
                typeof habit === "string"
                  ? habit
                  : habit._id;

              return (
                <div
                  key={habitId}
                  className="group/habit flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />

                  <span className="max-w-32 truncate text-xs font-medium text-base-content/70">
                    {getHabitName(habit)}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveHabit(habitId)
                    }
                    disabled={habitLoading}
                    className="text-xs text-base-content/30 opacity-0 transition hover:text-error group-hover/habit:opacity-100"
                    aria-label="Remove habit"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= HABIT SELECTOR ================= */}

        {showHabitSelector && (
          <div className="mt-3 rounded-xl border border-primary/15 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-base-content">
              Add a supporting habit
            </p>

            <p className="mt-1 text-xs text-base-content/50">
              Choose one of your existing habits.
            </p>

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
                  className="select select-sm mt-3 w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none"
                >
                  <option value="">Select a habit</option>

                  {availableHabits.map((habit) => (
                    <option
                      key={habit._id}
                      value={habit._id}
                    >
                      {habit.habitName}
                    </option>
                  ))}
                </select>

                {/* Only validation error for empty selection */}

                {habitError && (
                  <p className="mt-2 text-xs font-medium text-error">
                    {habitError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleAttachHabit}
                  disabled={
                    !selectedHabitId || habitLoading
                  }
                  className="btn btn-primary btn-sm mt-3 rounded-xl"
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
              <div className="mt-3 rounded-lg bg-base-100 px-3 py-3">
                <p className="text-sm text-base-content/55">
                  All your habits are already attached to
                  this goal.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

// =========================
// ICONS
// =========================

export const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12s3.5-6 9.75-6 9.75 6 9.75 6-3.5 6-9.75 6-9.75-6-9.75-6z"
    />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

export const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20h9"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 3.5a2.12 2.12 0 013 3L8 18l-4 1 1-4 12.5-11.5z"
    />
  </svg>
);

export const ArchiveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7.5h18M4.5 7.5v10.125A2.375 2.375 0 006.875 20h10.25a2.375 2.375 0 002.375-2.375V7.5M9 11.5h6M5.25 4h13.5A1.25 1.25 0 0120 5.25v1A1.25 1.25 0 0118.75 7.5H5.25A1.25 1.25 0 014 6.25v-1A1.25 1.25 0 015.25 4z"
    />
  </svg>
);

export const RestoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
    aria-hidden="true"
  >
    {/* Circular restore arrow */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 11a8 8 0 0 0-14.9-4"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 4v4h4"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 13a8 8 0 0 0 14.9 4"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 20v-4h-4"
    />

    {/* Timer inside */}
    <circle cx="12" cy="12" r="3.2" />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 10.5v1.7l1.2.8"
    />
  </svg>
);

export const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
    />
  </svg>
);

export default GoalCard;