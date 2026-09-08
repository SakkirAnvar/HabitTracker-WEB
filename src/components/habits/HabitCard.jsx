import { useState } from "react";

const HabitCard = ({ habit, onToggle, onDelete, onEdit }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setLoading(true);
      await onToggle(habit._id);
    } catch (error) {
      console.error("Failed to toggle habit:", error);
    } finally {
      setLoading(false);
    }
  };

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
            <h2
              className={`card-title text-base ${
                !habit.isActive ? "text-base-content/40" : ""
              }`}
            >
              {habit.habitName}
            </h2>

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

        {/* Actions */}
        <div className="card-actions mt-4 justify-between">
          {/* Complete */}
          <button
            onClick={handleToggle}
            disabled={loading || !habit.active}
            className={`btn btn-sm ${
              habit.isCompleted ? "btn-success" : "btn-primary"
            }`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : habit.isCompleted ? (
              "✓ Completed"
            ) : (
              "Complete"
            )}
          </button>

          {/* Edit + Delete */}
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(habit)}
                className="btn btn-ghost btn-sm"
              >
                Edit
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(habit._id)}
                className="btn btn-ghost btn-sm text-error"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
