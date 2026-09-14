import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchHabits, removeHabit } from "../redux/habitSlice";
import { fetchHabitLogsByDate } from "../redux/habitLogSlice";

import HabitList from "../components/habits/HabitList";
import HabitForm from "../components/habits/HabitForm";

const Habits = () => {
  const dispatch = useDispatch();

  const { habits, status } = useSelector((state) => state.habit);

  const { logs, status: logStatus } = useSelector(
    (state) => state.habitLog,
  );

  const [editingHabit, setEditingHabit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // =========================
  // Fetch data
  // =========================

  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchHabitLogsByDate(today));
  }, [dispatch, today]);

  // =========================
  // Handlers
  // =========================

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

  const handleProgressSuccess = () => {
    // Refresh today's logs after saving progress
    dispatch(fetchHabitLogsByDate(today));
  };

  const isLoading = status === "loading" || logStatus === "loading";

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg">
              🌱
            </span>

            <span className="text-sm font-medium text-primary">
              Daily Growth
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-base-content md:text-3xl">
            My Habits
          </h1>

          <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60 md:text-base">
            Build consistency, one day at a time.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleAddHabit}
            className="btn btn-primary shrink-0"
          >
            <span className="text-lg leading-none">+</span>
            Add Habit
          </button>
        )}
      </section>

      {/* ================= HABIT FORM ================= */}

      {showForm && (
        <HabitForm
          key={editingHabit?._id || "new"}
          habit={editingHabit}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* ================= LOADING ================= */}

      {isLoading && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary" />

            <p className="text-sm text-base-content/60">
              Loading your habits...
            </p>
          </div>
        </div>
      )}

      {/* ================= HABITS ================= */}

      {!showForm && !isLoading && (
        <section>
          {habits?.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-base-content">
                  Your Habits
                </h2>

                <p className="mt-0.5 text-sm text-base-content/60">
                  Stay consistent and keep building better days.
                </p>
              </div>

              <span className="badge badge-ghost">
                {habits.length}{" "}
                {habits.length === 1 ? "habit" : "habits"}
              </span>
            </div>
          )}

          <HabitList
            habits={habits}
            logs={logs}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onProgressSuccess={handleProgressSuccess}
          />
        </section>
      )}
    </div>
  );
};

export default Habits;
