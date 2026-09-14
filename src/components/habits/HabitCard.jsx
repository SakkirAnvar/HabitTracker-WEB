import HabitProgress from "./HabitProgress";

const HabitCard = ({
  habit,
  existingLog,
  onDelete,
  onEdit,
  onProgressSuccess,
}) => {
  const getCategoryBadge = () => {
    switch (habit.category) {
      case "Spiritual":
        return "badge-secondary";

      case "Skills":
        return "badge-info";

      case "Physical":
        return "badge-success";

      case "Personal":
        return "badge-warning";

      default:
        return "badge-ghost";
    }
  };

  const getCategoryIcon = () => {
    switch (habit.category) {
      case "Spiritual":
        return "🧘";

      case "Skills":
        return "📚";

      case "Physical":
        return "💪";

      case "Personal":
        return "🌱";

      default:
        return "✨";
    }
  };

  return (
    <article className="group rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-5 sm:p-6">
        {/* ================= HEADER ================= */}

        <div className="flex items-start gap-4">
          {/* Category icon */}
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg sm:flex">
            {getCategoryIcon()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-base-content">
                  {habit.habitName}
                </h2>

                {habit.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-base-content/60">
                    {habit.description}
                  </p>
                )}
              </div>

              <span className={`badge badge-sm ${getCategoryBadge()}`}>
                {habit.category}
              </span>
            </div>
          </div>
        </div>

        {/* ================= HABIT DETAILS ================= */}

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="badge badge-outline border-base-300 text-base-content/70">
            {habit.type}
          </span>

          <span className="badge badge-outline border-base-300 text-base-content/70">
            {habit.frequency}
          </span>
        </div>

        {/* ================= TARGET ================= */}

        {habit.target !== undefined && habit.target !== null && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-base-200 px-4 py-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/45">
                Daily Target
              </p>

              <p className="mt-1 text-sm font-semibold text-base-content">
                {habit.target}
                {habit.unit ? ` ${habit.unit}` : ""}
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm">
              🎯
            </div>
          </div>
        )}

        {/* ================= TODAY'S PROGRESS ================= */}

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-base-content">
              Today's Progress
            </p>

            <span className="text-xs text-base-content/50">Keep going</span>
          </div>

          <HabitProgress
            key={`${habit._id}-${existingLog?._id || "empty"}`}
            habit={habit}
            existingLog={existingLog}
            onSuccess={onProgressSuccess}
          />
        </div>

        {/* ================= ACTIONS ================= */}

        {(onEdit || onDelete) && (
          <div className="mt-5 flex justify-end gap-2 border-t border-base-300 pt-4">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(habit)}
                className="btn btn-sm btn-ghost text-base-content/70 hover:bg-base-200 hover:text-base-content"
              >
                Edit
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(habit._id)}
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

export default HabitCard;
