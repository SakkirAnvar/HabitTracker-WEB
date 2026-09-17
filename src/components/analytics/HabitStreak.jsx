import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { clearStreak, fetchHabitStreak } from "../../redux/analyticSlice";

const HabitStreak = ({ habits = [] }) => {
  const dispatch = useDispatch();

  const { streak, streakStatus, streakError } = useSelector(
    (store) => store.analytic,
  );

  const [selectedHabitId, setSelectedHabitId] = useState("");

  const activeHabitId = selectedHabitId || habits[0]?._id || "";

  useEffect(() => {
    if (!activeHabitId) {
      dispatch(clearStreak());
      return;
    }

    dispatch(fetchHabitStreak(activeHabitId));
  }, [dispatch, activeHabitId]);

  const currentStreak = Number(streak?.currentStreak) || 0;
  const longestStreak = Number(streak?.longestStreak) || 0;

  const streakPercentage =
    longestStreak > 0
      ? Math.min(100, (currentStreak / longestStreak) * 100)
      : 0;

  const selectedHabit =
    habits.find((habit) => habit._id === activeHabitId) || habits[0];

  if (!habits.length) {
    return (
      <section className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-lg">
          🔥
        </div>

        <h2 className="mt-3 text-lg font-semibold text-base-content">
          Habit Streak
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          Create a habit to start building your streak.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
            🔥
          </div>

          <div>
            <h2 className="text-lg font-semibold leading-tight text-base-content">
              Habit Streak
            </h2>

            <p className="mt-1 text-sm text-base-content/55">
              Stay consistent and build your longest streak.
            </p>
          </div>
        </div>

        {/* Habit selector */}

        <div className="flex items-center gap-2">
          <label
            htmlFor="habit-streak"
            className="hidden text-xs font-medium text-base-content/50 sm:block"
          >
            Habit
          </label>

          <select
            id="habit-streak"
            value={selectedHabitId}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className="select select-sm w-full min-w-[180px] rounded-xl border-base-300 bg-base-100 text-sm text-base-content outline-none focus:border-primary focus:outline-none sm:w-auto"
          >
            {habits.map((habit) => (
              <option key={habit._id} value={habit._id}>
                {habit.habitName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {streakStatus === "loading" && (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[0.75fr_0.75fr_1.5fr]">
          <div className="h-36 animate-pulse rounded-2xl bg-base-200" />
          <div className="h-36 animate-pulse rounded-2xl bg-base-200" />
          <div className="h-36 animate-pulse rounded-2xl bg-base-200" />
        </div>
      )}

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

      {streakStatus === "succeeded" && streak && (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[0.75fr_0.75fr_1.5fr]">
          <div className="rounded-2xl border border-base-300 bg-base-200/40 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
                Current Streak
              </p>

              <span className="text-lg">🔥</span>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-bold leading-none text-primary">
                {currentStreak}
              </span>

              <span className="pb-0.5 text-sm text-base-content/50">days</span>
            </div>

            <p className="mt-2 text-xs text-base-content/50">
              {selectedHabit?.habitName || "Selected habit"}
            </p>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-200/40 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
                Longest Streak
              </p>

              <span className="text-lg">🏆</span>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-bold leading-none text-secondary">
                {longestStreak}
              </span>

              <span className="pb-0.5 text-sm text-base-content/50">days</span>
            </div>

            <p className="mt-2 text-xs text-base-content/50">Personal best</p>
          </div>

          <div className="rounded-2xl bg-primary/5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
                    Streak Progress
                  </p>

                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {Math.round(streakPercentage)}%
                  </span>
                </div>

                <p className="mt-1 text-sm text-base-content/60">
                  Keep going to reach your personal best.
                </p>
              </div>

              <p className="text-sm font-bold text-primary">
                {currentStreak} / {longestStreak} days
              </p>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-base-300">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${streakPercentage}%`,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-base-content/45">
              <span>Current</span>
              <span>Personal best</span>
            </div>
          </div>
        </div>
      )}

      {streakStatus === "succeeded" && !streak && (
        <div className="mt-5 rounded-2xl border border-dashed border-base-300 bg-base-200/40 p-7 text-center">
          <div className="text-2xl">🌱</div>

          <p className="mt-2 text-sm font-semibold text-base-content">
            Start building your streak
          </p>

          <p className="mt-1 text-xs text-base-content/50">
            Complete this habit consistently to create your first streak.
          </p>
        </div>
      )}
    </section>
  );
};

export default HabitStreak;
