import { useDispatch, useSelector } from "react-redux";
import {
  fetchHabits,
  toggleHabitStatus,
  removeHabit,
} from "../redux/habitSlice";
import { useEffect, useState } from "react";
import HabitList from "../components/habits/HabitList";
import HabitForm from "../components/habits/HabitForm";

const Habits = () => {
  const dispatch = useDispatch();

 const { habits, status, error } = useSelector(
  (state) => state.habit
);


  const [editingHabit, setEditingHabit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  const handleToggle = async (id) => {
    await dispatch(toggleHabitStatus(id)).unwrap();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this habit?"
    );

    if (!confirmed) return;

    await dispatch(removeHabit(id)).unwrap();
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setEditingHabit(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingHabit(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            My Habits
          </h1>

          <p className="mt-1 text-base-content/60">
            Build consistency, one day at a time.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingHabit(null);
            setShowForm(true);
          }}
        >
          + Add Habit
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <HabitForm
          key={editingHabit?._id || "new"}
          habit={editingHabit}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* Loading */}
      {status === "loading" && (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Habit List */}
      {status !== "loading" && (
        <HabitList
          habits={habits}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default Habits;
