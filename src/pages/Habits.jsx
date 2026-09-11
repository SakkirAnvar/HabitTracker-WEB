import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits, removeHabit } from "../redux/habitSlice";
import { fetchHabitLogsByDate } from "../redux/habitLogSlice";
import HabitList from "../components/habits/HabitList";
import HabitForm from "../components/habits/HabitForm";

const Habits = () => {
  const dispatch = useDispatch();

  const {
    habits,
    status,
  } = useSelector((state) => state.habit);

  const {
    logs,
    status: logStatus,
  } = useSelector((state) => state.habitLog);

  const [editingHabit, setEditingHabit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toggleButton, setToggleButton] = useState(true);

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchHabitLogsByDate(today));
  }, [dispatch, today]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this habit?",
    );

    if (!confirmed) return;

    try {
      await dispatch(removeHabit(id)).unwrap();
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleAddHabit = () => {
    setEditingHabit(null);
    setToggleButton(!toggleButton);
    setShowForm(toggleButton);
  };

  const handleFormSuccess = () => {
    setEditingHabit(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingHabit(null);
    setShowForm(false);
  };

  const handleProgressSuccess = () => {
    // Refresh today's logs after saving progress
    dispatch(fetchHabitLogsByDate(today));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">My Habits</h1>

          <p className="mt-1 text-base-content/60">
            Build consistency, one day at a time.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddHabit}
          className="btn btn-primary"
        >
          + Add Habit
        </button>
      </div>

      {/* Habit Form */}
      {showForm && (
        <HabitForm
          key={editingHabit?._id || "new"}
          habit={editingHabit}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* Loading */}
      {(status === "loading" || logStatus === "loading") && (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {/* Habits */}
      {!showForm && status !== "loading" && (
        <HabitList
          habits={habits}
          logs={logs}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onProgressSuccess={handleProgressSuccess}
        />
      )}
    </div>
  );
};

export default Habits;
