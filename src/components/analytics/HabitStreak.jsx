import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { clearStreak, fetchHabitStreak } from "../../redux/analyticSlice";

const HabitStreak = ({ habits = [] }) => {
  const dispatch = useDispatch();

  const { streak, streakStatus, streakError } = useSelector(
    (store) => store.analytic,
  );

  const [selectedHabitId, setSelectedHabitId] = useState("");

  // Use selected habit, otherwise default to first habit
  const activeHabitId = selectedHabitId || habits[0]?._id || "";

  useEffect(() => {
    if (!activeHabitId) {
      dispatch(clearStreak());
      return;
    }

    dispatch(fetchHabitStreak(activeHabitId));
  }, [dispatch, activeHabitId]);

  // Fetch streak whenever selected habit changes
  useEffect(() => {
    if (!selectedHabitId) {
      dispatch(clearStreak());
      return;
    }

    dispatch(fetchHabitStreak(selectedHabitId));
  }, [dispatch, selectedHabitId]);

  const handleHabitChange = (e) => {
    setSelectedHabitId(e.target.value);
  };

  if (!habits.length) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-center shadow-sm">
        <div className="text-3xl">🔥</div>

        <h2 className="mt-2 text-lg font-semibold">Habit Streaks</h2>

        <p className="mt-1 text-sm text-base-content/60">
          Create a habit to start building streaks.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Habit Streak</h2>

        <p className="mt-1 text-sm text-base-content/60">
          See how consistently you're maintaining a habit.
        </p>
      </div>

      {/* Habit selector */}
      <div className="mt-5">
        <label
          htmlFor="habit-streak"
          className="mb-2 block text-sm font-medium"
        >
          Select Habit
        </label>

        <select
          id="habit-streak"
          value={selectedHabitId}
          onChange={handleHabitChange}
          className="select select-bordered w-full"
        >
          {habits.map((habit) => (
            <option key={habit._id} value={habit._id}>
              {habit.habitName}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {streakStatus === "loading" && (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-md" />
        </div>
      )}

      {/* Error */}
      {streakStatus === "failed" && (
        <div className="alert alert-error mt-5">
          <span>{streakError || "Failed to load habit streak."}</span>
        </div>
      )}

      {/* Streak data */}
      {streakStatus === "succeeded" && streak && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Current streak */}
          <div className="rounded-xl bg-base-200 p-5 text-center">
            <div className="text-3xl">🔥</div>

            <p className="mt-2 text-sm text-base-content/60">Current Streak</p>

            <p className="mt-1 text-3xl font-bold">
              {Number(streak.currentStreak) || 0}
            </p>

            <p className="text-sm text-base-content/50">days</p>
          </div>

          {/* Longest streak */}
          <div className="rounded-xl bg-base-200 p-5 text-center">
            <div className="text-3xl">🏆</div>

            <p className="mt-2 text-sm text-base-content/60">Longest Streak</p>

            <p className="mt-1 text-3xl font-bold">
              {Number(streak.longestStreak) || 0}
            </p>

            <p className="text-sm text-base-content/50">days</p>
          </div>
        </div>
      )}

      {/* Empty streak */}
      {streakStatus === "succeeded" && !streak && (
        <div className="mt-5 rounded-lg bg-base-200 p-5 text-center">
          <p className="text-sm text-base-content/60">
            No streak information available.
          </p>
        </div>
      )}
    </div>
  );
};

export default HabitStreak;
