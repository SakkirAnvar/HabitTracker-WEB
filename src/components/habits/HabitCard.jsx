import HabitProgress from "./HabitProgress";

const HabitCard = ({
  habit,
  existingLog,
  onDelete,
  onEdit,
  onProgressSuccess,
}) => {
  const category = getCategoryConfig(habit.category);

  const hasTarget =
    habit.target !== undefined && habit.target !== null && habit.target !== "";

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

  return (
    <article className="flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${category.iconBg}`}
        >
          {category.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-base-content sm:text-lg">
                {habit.habitName}
              </h2>

              {habit.description && (
                <p className="mt-1 line-clamp-1 text-sm text-base-content/55">
                  {habit.description}
                </p>
              )}
            </div>

            {(onEdit || onDelete) && (
              <div className="dropdown dropdown-end shrink-0">
                <button
                  type="button"
                  tabIndex={0}
                  aria-label="Habit options"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-lg leading-none text-base-content/40 transition hover:bg-base-200 hover:text-base-content"
                >
                  ⋯
                </button>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu z-50 mt-1 w-32 rounded-xl border border-base-300 bg-base-100 p-1.5 shadow-lg"
                >
                  {onEdit && (
                    <li>
                      <button type="button" onClick={() => onEdit(habit)}>
                        Edit
                      </button>
                    </li>
                  )}

                  {onDelete && (
                    <li>
                      <button
                        type="button"
                        onClick={() => onDelete(habit)}
                        className="text-error hover:bg-error/10"
                      >
                        Delete
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${category.badge}`}
            >
              {habit.category}
            </span>

            <span className="rounded-full border border-base-300 bg-base-100 px-2.5 py-1 text-[11px] font-medium text-base-content/50">
              {formatFrequency(habit.frequency)}
            </span>

            {habit.type !== "boolean" && (
              <span className="rounded-full border border-base-300 bg-base-100 px-2.5 py-1 text-[11px] font-medium text-base-content/50">
                {formatType(habit.type)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        {/* Target */}

        {hasTarget && (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
                  Daily Target
                </p>

                <p className="mt-1 text-sm font-bold text-base-content">
                  {habit.target}
                  {habit.unit ? ` ${habit.unit}` : ""}
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-base-content">
              Today's Progress
            </p>

            <span className="text-xs text-base-content/40">
              {getProgressLabel(habit, existingLog)}
            </span>
          </div>

          <HabitProgress
            key={`${habit._id}-${existingLog?._id || "empty"}`}
            habit={habit}
            existingLog={existingLog}
            onSuccess={onProgressSuccess}
          />
        </div>
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between border-t border-base-300 pt-4">
          <div className="flex items-center gap-2 text-sm text-base-content/50">
            <span className="text-base">▥</span>

            <span>Streak {habit.streak ?? 0} days</span>
          </div>

          <span className="text-lg text-base-content/30">→</span>
        </div>
      </div>
    </article>
  );
};

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

const getProgressLabel = (habit, existingLog) => {
  if (!existingLog) {
    return "Keep going";
  }

  if (habit.type === "boolean") {
    return Number(existingLog.value) === 1 ? "Completed" : "Keep going";
  }

  if (
    habit.type === "count" ||
    habit.type === "numeric" ||
    habit.type === "duration"
  ) {
    const current = Number(existingLog.value) || 0;
    const target = Number(habit.target) || 0;

    if (target > 0) {
      return `${Math.min(100, Math.round((current / target) * 100))}%`;
    }

    return "Updated";
  }

  if (habit.type === "rating") {
    return existingLog.value ? `${existingLog.value}/5` : "Keep going";
  }

  return "Keep going";
};

export default HabitCard;
