
import {
  ArchiveIcon,
  DeleteIcon,
  EditIcon,
  RestoreIcon,
} from "../goals/GoalCard";
import HabitProgress from "./HabitProgress";

const HabitCard = ({
  habit,
  existingLog,
  onDelete,
  onEdit,
  onArchive,
  isArchived = false,
  onProgressSuccess,
}) => {
  const category = getCategoryConfig(habit.category);

  const hasTarget =
    habit.target !== undefined &&
    habit.target !== null &&
    habit.target !== "";

  const progressLabel = getProgressLabel(habit, existingLog);

  const isCompleted =
    habit.type === "boolean"
      ? Number(existingLog?.value) === 1
      : habit.type === "count" ||
          habit.type === "numeric" ||
          habit.type === "duration"
        ? Number(existingLog?.value) >= Number(habit.target)
        : false;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
      {/* =========================
          HEADER
      ========================= */}

      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Category Icon */}
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${category.iconBg}`}
          >
            {category.icon}
          </div>

          {/* Title + Actions */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold tracking-tight text-base-content sm:text-lg">
                  {habit.habitName}
                </h2>

                {habit.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-base-content/55">
                    {habit.description}
                  </p>
                )}
              </div>

              {(onEdit || onArchive || onDelete) && (
                <div className="dropdown dropdown-end shrink-0">
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label="Habit options"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-base-content/40 transition hover:bg-base-200 hover:text-base-content"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <circle cx="5" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="19" cy="12" r="1.5" />
                    </svg>
                  </button>

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu z-50 mt-1 w-36 rounded-xl border border-base-300 bg-base-100 p-1.5 shadow-lg"
                  >
                    {onEdit && (
                      <li>
                        <button
                          type="button"
                          onClick={() => onEdit(habit)}
                          className="flex items-center gap-2"
                        >
                          <EditIcon />
                          Edit
                        </button>
                      </li>
                    )}

                    {onArchive && (
                      <li>
                        <button
                          type="button"
                          onClick={() => onArchive(habit)}
                          className={
                            isArchived
                              ? "flex items-center gap-2 text-success hover:bg-success/10"
                              : "flex items-center gap-2 text-warning hover:bg-warning/10"
                          }
                        >
                          {isArchived ? <RestoreIcon /> : <ArchiveIcon />}
                          {isArchived ? "Restore" : "Archive"}
                        </button>
                      </li>
                    )}

                    {onDelete && (
                      <li>
                        <button
                          type="button"
                          onClick={() => onDelete(habit)}
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

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${category.badge}`}
              >
                {habit.category}
              </span>

              <span className="rounded-full border border-base-300 bg-base-200/50 px-2.5 py-1 text-[10px] font-medium text-base-content/50">
                {formatFrequency(habit.frequency)}
              </span>

              {habit.type !== "boolean" && (
                <span className="rounded-full border border-base-300 bg-base-200/50 px-2.5 py-1 text-[10px] font-medium text-base-content/50">
                  {formatType(habit.type)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            TARGET / STREAK SUMMARY
        ========================= */}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-base-300 bg-base-200/40 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
              Target
            </p>

            <p className="mt-1.5 text-sm font-bold text-base-content">
              {hasTarget
                ? `${habit.target}${habit.unit ? ` ${habit.unit}` : ""}`
                : "No target"}
            </p>
          </div>

          <div className="rounded-xl border border-base-300 bg-base-200/40 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
              Streak
            </p>

            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-sm font-bold text-base-content">
                {habit.streak ?? 0}
              </span>

              <span className="text-xs text-base-content/45">
                days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          PROGRESS
      ========================= */}

      <div className="mt-auto border-t border-base-300 px-5 py-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-base-content">
              Today's Progress
            </p>

            <p className="mt-0.5 text-xs text-base-content/45">
              {getProgressDescription(habit, existingLog)}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              isCompleted
                ? "bg-success/10 text-success"
                : "bg-base-200 text-base-content/50"
            }`}
          >
            {progressLabel}
          </span>
        </div>

        <HabitProgress
          key={`${habit._id}-${existingLog?._id || "empty"}`}
          habit={habit}
          existingLog={existingLog}
          onSuccess={onProgressSuccess}
        />
      </div>

      {/* =========================
          FOOTER
      ========================= */}

      <div className="border-t border-base-300 px-5 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-base-content/45">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path
                d="M12 3l2.2 4.7L19 9.8l-3.4 3.4.8 4.8L12 15.8 7.6 18l.8-4.8L5 9.8l4.8-2.1L12 3Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span>
              {habit.streak ?? 0} day
              {habit.streak === 1 ? "" : "s"} streak
            </span>
          </div>

          <span
            className={`text-xs font-medium ${
              isCompleted
                ? "text-success"
                : "text-base-content/30"
            }`}
          >
            {isCompleted ? "Completed" : "Keep going"}
          </span>
        </div>
      </div>
    </article>
  );
};

/* =========================================
   CATEGORY CONFIG
========================================= */

const getCategoryConfig = (category) => {
  switch (category) {
    case "Physical":
      return {
        icon: "🏃",
        iconBg: "bg-success/10 text-success",
        badge: "border-success/20 bg-success/10 text-success",
      };

    case "Spiritual":
      return {
        icon: "🕊️",
        iconBg: "bg-secondary/10 text-secondary",
        badge: "border-secondary/20 bg-secondary/10 text-secondary",
      };

    case "Skills":
      return {
        icon: "🎯",
        iconBg: "bg-info/10 text-info",
        badge: "border-info/20 bg-info/10 text-info",
      };

    case "Personal":
      return {
        icon: "🌿",
        iconBg: "bg-primary/10 text-primary",
        badge: "border-primary/20 bg-primary/10 text-primary",
      };

    default:
      return {
        icon: "✨",
        iconBg: "bg-base-200 text-base-content/60",
        badge: "border-base-300 bg-base-200 text-base-content/60",
      };
  }
};

/* =========================================
   TYPE
========================================= */

const formatType = (type) => {
  switch (type) {
    case "boolean":
      return "Done / Not Done";

    case "count":
      return "Count";

    case "numeric":
      return "Count";

    case "duration":
      return "Duration";

    case "rating":
      return "Rating";

    default:
      return type;
  }
};

/* =========================================
   FREQUENCY
========================================= */

const formatFrequency = (frequency) => {
  switch (frequency) {
    case "daily":
      return "Daily";

    case "weekly":
      return "Weekly";

    case "monthly":
      return "Monthly";

    case "custom":
      return "Custom";

    default:
      return frequency;
  }
};

/* =========================================
   PROGRESS LABEL
========================================= */

const getProgressLabel = (habit, existingLog) => {
  if (!existingLog) {
    return "Not started";
  }

  if (habit.type === "boolean") {
    return Number(existingLog.value) === 1
      ? "Completed"
      : "Not done";
  }

  if (
    habit.type === "count" ||
    habit.type === "numeric" ||
    habit.type === "duration"
  ) {
    const current = Number(existingLog.value) || 0;
    const target = Number(habit.target) || 0;

    if (target > 0) {
      return `${Math.min(
        100,
        Math.round((current / target) * 100),
      )}%`;
    }

    return "Updated";
  }

  if (habit.type === "rating") {
    return existingLog.value
      ? `${existingLog.value}/5`
      : "Not rated";
  }

  return "Keep going";
};

/* =========================================
   PROGRESS DESCRIPTION
========================================= */

const getProgressDescription = (habit, existingLog) => {
  if (!existingLog) {
    return habit.type === "boolean"
      ? "Mark this habit when you're done"
      : "Start today's progress";
  }

  if (habit.type === "boolean") {
    return Number(existingLog.value) === 1
      ? "Nice work. You completed this habit."
      : "You can still complete it today.";
  }

  if (
    habit.type === "count" ||
    habit.type === "numeric" ||
    habit.type === "duration"
  ) {
    const current = Number(existingLog.value) || 0;
    const target = Number(habit.target) || 0;

    if (target > 0) {
      return `${current} of ${target}${
        habit.unit ? ` ${habit.unit}` : ""
      } completed`;
    }

    return "Keep tracking your progress";
  }

  if (habit.type === "rating") {
    return "Track how you feel today";
  }

  return "Keep building your consistency";
};

export default HabitCard;

