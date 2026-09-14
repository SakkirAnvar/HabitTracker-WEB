import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { attachHabitToGoal } from "../../redux/goalSlice";

const AttachHabit = ({ goal, onSuccess }) => {
  const dispatch = useDispatch();

  const { habits } = useSelector((store) => store.habit);

  const [selectedHabit, setSelectedHabit] = useState("");
  const [error, setError] = useState("");

  const attachedHabitIds =
    goal.habitIds?.map((habit) =>
      typeof habit === "string" ? habit : habit._id,
    ) || [];

  const availableHabits = habits.filter(
    (habit) => !attachedHabitIds.includes(habit._id),
  );

  const handleAttach = async () => {
    if (!selectedHabit) {
      setError("Please select a habit.");
      return;
    }

    setError("");

    try {
      await dispatch(
        attachHabitToGoal({
          goalId: goal._id,
          habitId: selectedHabit,
        }),
      ).unwrap();

      setSelectedHabit("");
      onSuccess?.();
    } catch (err) {
      setError(err?.message || "Failed to attach habit.");
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
          🌱
        </div>

        <div>
          <h3 className="font-semibold text-base-content">Attach a Habit</h3>

          <p className="mt-0.5 text-sm text-base-content/60">
            Connect a habit to help you make progress toward this goal.
          </p>
        </div>
      </div>

      {availableHabits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-base-300 bg-base-200 px-4 py-5 text-center">
          <div className="mb-2 text-2xl">🌿</div>

          <p className="text-sm font-medium text-base-content">
            No available habits
          </p>

          <p className="mt-1 text-xs text-base-content/60">
            All your existing habits are already attached to this goal.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Habit Select */}
          <div>
            <label
              htmlFor={`habit-${goal._id}`}
              className="mb-1.5 block text-sm font-medium text-base-content"
            >
              Choose a habit
            </label>

            <select
              id={`habit-${goal._id}`}
              value={selectedHabit}
              onChange={(e) => {
                setSelectedHabit(e.target.value);
                if (error) setError("");
              }}
              className="select select-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none"
            >
              <option value="">Select a habit</option>

              {availableHabits.map((habit) => (
                <option key={habit._id} value={habit._id}>
                  {habit.habitName}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-error/20 bg-error/10 px-3 py-2.5 text-sm font-medium text-error">
              {error}
            </div>
          )}

          {/* Action */}
          <button
            type="button"
            onClick={handleAttach}
            disabled={!selectedHabit}
            className="btn btn-primary btn-sm w-full sm:w-auto"
          >
            + Attach Habit
          </button>
        </div>
      )}
    </div>
  );
};

export default AttachHabit;
