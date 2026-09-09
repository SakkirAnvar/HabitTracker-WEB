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

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="card-title text-base">{habit.habitName}</h2>

            {habit.description && (
              <p className="mt-1 text-sm text-base-content/60">
                {habit.description}
              </p>
            )}
          </div>

          <span className={`badge ${getCategoryBadge()}`}>
            {habit.category}
          </span>
        </div>

        {/* Habit Details */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="badge badge-outline">{habit.type}</span>

          <span className="badge badge-outline">{habit.frequency}</span>
        </div>

        {/* Target */}
        {habit.target !== undefined && habit.target !== null && (
          <div className="mt-3 text-sm">
            <span className="text-base-content/60">Target: </span>

            <span className="font-medium">
              {habit.target}
              {habit.unit ? ` ${habit.unit}` : ""}
            </span>
          </div>
        )}

        {/* Today's Progress */}
        <HabitProgress
          key={`${habit._id}-${existingLog?._id || "empty"}`}
          habit={habit}
          existingLog={existingLog}
          onSuccess={onProgressSuccess}
        />
        {/* Actions */}
        <div className="mt-4 flex justify-end gap-2 border-t border-base-200 pt-4">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(habit)}
              className="btn btn-ghost btn-sm"
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(habit._id)}
              className="btn btn-ghost btn-sm text-error"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
