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
    <div className="mt-4 rounded-lg border border-base-300 bg-base-200 p-4">
      <h3 className="mb-3 font-semibold">Attach Habit</h3>

      {availableHabits.length === 0 ? (
        <p className="text-sm text-base-content/60">
          No available habits to attach.
        </p>
      ) : (
        <>
          <select
            value={selectedHabit}
            onChange={(e) => setSelectedHabit(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Select a habit</option>

            {availableHabits.map((habit) => (
              <option key={habit._id} value={habit._id}>
                {habit.habitName}
              </option>
            ))}
          </select>

          {error && <p className="mt-2 text-sm text-error">{error}</p>}

          <button
            type="button"
            onClick={handleAttach}
            className="btn btn-primary btn-sm mt-3"
          >
            Attach Habit
          </button>
        </>
      )}
    </div>
  );
};

export default AttachHabit;
