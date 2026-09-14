import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { clearStreak, fetchHabitStreak } from "../../redux/analyticSlice";

const HabitStreak = ({ habits = [] }) => {
  const dispatch = useDispatch();

  const { streak, streakStatus, streakError } = useSelector(
    (store) => store.analytic,
  );

  const [selectedHabitId, setSelectedHabitId] = useState("");

  // Use selected habit, otherwise use the first habit
  const activeHabitId = selectedHabitId || habits[0]?._id || "";

  /*
   * Fetch streak whenever the active habit changes.
   *
   * Only ONE effect is needed here.
   * The previous version had two effects that both
   * called fetchHabitStreak().
   */
  useEffect(() => {
    if (!activeHabitId) {
      dispatch(clearStreak());
      return;
    }

    dispatch(fetchHabitStreak(activeHabitId));
  }, [dispatch, activeHabitId]);

  const handleHabitChange = (e) => {
    setSelectedHabitId(e.target.value);
  };

  // No habits
  if (!habits.length) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl">
          🔥
        </div>

        <h2 className="mt-3 text-lg font-semibold text-base-content">
          Habit Streaks
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          Create a habit to start building streaks.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      {/* ================= HEADER ================= */}

      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
          🔥
        </div>

        <div>
          <h2 className="text-lg font-semibold text-base-content">
            Habit Streak
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            See how consistently you're maintaining a habit.
          </p>
        </div>
      </div>

      {/* ================= HABIT SELECTOR ================= */}

      <div className="mt-6">
        <label
          htmlFor="habit-streak"
          className="mb-2 block text-sm font-semibold text-base-content"
        >
          Select Habit
        </label>

        <select
          id="habit-streak"
          value={selectedHabitId}
          onChange={handleHabitChange}
          className="select select-bordered w-full border-base-300 bg-base-100 text-base-content outline-none focus:border-primary focus:outline-none"
        >
          {habits.map((habit) => (
            <option key={habit._id} value={habit._id}>
              {habit.habitName}
            </option>
          ))}
        </select>
      </div>

      {/* ================= LOADING ================= */}

      {streakStatus === "loading" && (
        <div className="mt-5 flex min-h-44 items-center justify-center rounded-xl bg-base-200">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-md text-primary" />

            <p className="text-sm text-base-content/50">Loading streak...</p>
          </div>
        </div>
      )}

      {/* ================= ERROR ================= */}

      {streakStatus === "failed" && (
        <div className="mt-5 rounded-xl border border-error/20 bg-error/10 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">⚠️</span>

            <div>
              <p className="text-sm font-semibold text-error">
                Unable to load streak
              </p>

              <p className="mt-1 text-xs text-error/80">
                {streakError || "Failed to load habit streak."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= STREAK DATA ================= */}

      {streakStatus === "succeeded" && streak && (
        <>
          {/* Streak cards */}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Current streak */}

            <div className="group rounded-2xl border border-base-300 bg-base-200 p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                🔥
              </div>

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Current Streak
              </p>

              <p className="mt-1 text-3xl font-bold text-primary">
                {Number(streak.currentStreak) || 0}
              </p>

              <p className="mt-1 text-xs text-base-content/50">
                consecutive days
              </p>
            </div>

            {/* Longest streak */}

            <div className="group rounded-2xl border border-base-300 bg-base-200 p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-2xl">
                🏆
              </div>

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Longest Streak
              </p>

              <p className="mt-1 text-3xl font-bold text-secondary">
                {Number(streak.longestStreak) || 0}
              </p>

              <p className="mt-1 text-xs text-base-content/50">best streak</p>
            </div>
          </div>

          {/* Streak comparison */}

          <div className="mt-4 rounded-xl bg-primary/5 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
                  Streak Progress
                </p>

                <p className="mt-1 text-sm text-base-content/60">
                  Keep going to beat your personal best.
                </p>
              </div>

              <span className="shrink-0 text-sm font-bold text-primary">
                {Number(streak.currentStreak) || 0}/
                {Number(streak.longestStreak) || 0}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-base-300">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${
                    Number(streak.longestStreak) > 0
                      ? Math.min(
                          100,
                          ((Number(streak.currentStreak) || 0) /
                            Number(streak.longestStreak)) *
                            100,
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* ================= EMPTY STREAK ================= */}

      {streakStatus === "succeeded" && !streak && (
        <div className="mt-5 rounded-xl border border-dashed border-base-300 bg-base-200 p-6 text-center">
          <div className="text-2xl">🌱</div>

          <p className="mt-2 text-sm font-medium text-base-content">
            No streak information yet
          </p>

          <p className="mt-1 text-xs text-base-content/50">
            Start completing this habit to build your streak.
          </p>
        </div>
      )}
    </section>
  );
};

export default HabitStreak;
