import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabitOptions } from "../../redux/habitSlice";
import { clearStreak, fetchHabitStreak } from "../../redux/analyticSlice";

const HabitStreak = () => {
  const dispatch = useDispatch();

  const { streak, streakStatus, streakError } = useSelector(
    (store) => store.analytic,
  );

  const { habitOptions, habitOptionsStatus, habitOptionsError } = useSelector(
    (state) => state.habit,
  );

  const [selectedHabitId, setSelectedHabitId] = useState("");
  useEffect(() => {
    if (habitOptionsStatus === "idle") {
      dispatch(fetchHabitOptions());
    }
  }, [dispatch, habitOptionsStatus]);

  const activeHabitId = selectedHabitId || habitOptions[0]?._id || "";

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

  const remainingToBest = Math.max(longestStreak - currentStreak, 0);

  const selectedHabit =
    habitOptions.find((habit) => habit._id === activeHabitId) ||
    habitOptions[0];

  // Loading habit options
  if (habitOptionsStatus === "loading") {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-5 py-5 sm:px-6 lg:px-7">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg">
              🔥
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-base-content">
                Habit Streak
              </h2>

              <p className="mt-0.5 text-sm text-base-content/50">
                Loading your habits...
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-7">
          <div className="h-64 animate-pulse rounded-3xl bg-base-200" />

          <div className="space-y-4">
            <div className="h-28 animate-pulse rounded-2xl bg-base-200" />
            <div className="h-28 animate-pulse rounded-2xl bg-base-200" />
          </div>
        </div>
      </section>
    );
  }

  if (habitOptionsStatus === "failed") {
    return (
      <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="rounded-2xl border border-error/20 bg-error/10 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">⚠️</span>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-error">
                Unable to load habits
              </p>

              <p className="mt-1 text-xs leading-5 text-error/75">
                {habitOptionsError || "Failed to load habit options."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No active habits
  if (!habitOptions.length) {
    return (
      <section className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl">
          🔥
        </div>

        <h2 className="mt-4 text-lg font-semibold text-base-content">
          Habit Streak
        </h2>

        <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-base-content/55">
          Create a habit and stay consistent to start building your streak.
        </p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
      {/* Header */}

      <div className="border-b border-base-300 px-5 py-5 sm:px-6 lg:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg">
              🔥
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-base-content">
                Habit Streak
              </h2>

              <p className="mt-0.5 truncate text-sm text-base-content/50">
                {selectedHabit?.habitName || "Track your consistency"}
              </p>
            </div>
          </div>

          {/* Habit selector */}

          <div className="w-full sm:w-auto">
            <label
              htmlFor="habit-streak"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-base-content/40 sm:sr-only"
            >
              Select habit
            </label>

            <select
              id="habit-streak"
              value={selectedHabitId}
              onChange={(e) => setSelectedHabitId(e.target.value)}
              className="select select-sm h-10 w-full min-w-0 rounded-xl border-base-300 bg-base-100 px-3 text-sm font-medium text-base-content outline-none transition focus:border-primary focus:outline-none sm:w-[220px]"
            >
              <option value="" disabled>
                Select habit
              </option>

              {habitOptions.map((habit) => (
                <option key={habit._id} value={habit._id}>
                  {habit.habitName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading streak */}

      {streakStatus === "loading" && (
        <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-7">
          <div className="h-64 animate-pulse rounded-3xl bg-base-200" />

          <div className="space-y-4">
            <div className="h-28 animate-pulse rounded-2xl bg-base-200" />
            <div className="h-28 animate-pulse rounded-2xl bg-base-200" />
          </div>
        </div>
      )}

      {/* Streak error */}

      {streakStatus === "failed" && (
        <div className="p-5 sm:p-6 lg:p-7">
          <div className="rounded-2xl border border-error/20 bg-error/10 p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg">⚠️</span>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-error">
                  Unable to load streak
                </p>

                <p className="mt-1 text-xs leading-5 text-error/75">
                  {streakError || "Failed to load habit streak."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak content */}

      {streakStatus === "succeeded" && streak && (
        <div className="p-5 sm:p-6 lg:p-7">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Main streak panel */}

            <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-primary/[0.045] p-6 sm:p-7">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5" />

              <div className="absolute -bottom-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-primary/[0.025]" />

              <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-base-content/40">
                      Current streak
                    </p>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/55">
                      Keep showing up to turn small actions into consistency.
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg shadow-sm">
                    🔥
                  </div>
                </div>

                <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-end gap-2">
                      <span className="text-[4.25rem] font-bold leading-none tracking-[-0.04em] text-primary sm:text-[5rem]">
                        {currentStreak}
                      </span>

                      <span className="pb-2 text-sm font-medium text-base-content/45">
                        {currentStreak === 1 ? "day" : "days"}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-base-content/45">
                      {currentStreak === 0
                        ? "Your next completed day starts the streak."
                        : currentStreak >= longestStreak && longestStreak > 0
                          ? "You're at your personal best."
                          : "Keep the run alive."}
                    </p>
                  </div>

                  {/* Progress ring */}

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="relative h-16 w-16 shrink-0">
                      <svg
                        viewBox="0 0 40 40"
                        className="h-full w-full -rotate-90"
                        aria-hidden="true"
                      >
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          className="text-base-300"
                        />

                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeDasharray={`${Math.max(
                            streakPercentage,
                            0,
                          )} 100`}
                          pathLength="100"
                          className="text-primary transition-all duration-500"
                        />
                      </svg>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[11px] font-bold text-primary">
                          {Math.round(streakPercentage)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
                        To best
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-base-content">
                        {longestStreak} {longestStreak === 1 ? "day" : "days"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supporting information */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-base-300 bg-base-200/30 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-content/40">
                      Personal best
                    </p>

                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-3xl font-bold leading-none text-base-content">
                        {longestStreak}
                      </span>

                      <span className="pb-0.5 text-sm text-base-content/45">
                        {longestStreak === 1 ? "day" : "days"}
                      </span>
                    </div>
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-base">
                    🏆
                  </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-base-300">
                  <div
                    className="h-full rounded-full bg-secondary transition-all duration-500"
                    style={{
                      width: `${Math.max(
                        streakPercentage,
                        longestStreak ? 4 : 0,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-base-300 bg-base-200/30 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-content/40">
                      Next milestone
                    </p>

                    <p className="mt-2 text-lg font-semibold text-base-content">
                      {longestStreak === 0
                        ? "Set your first record"
                        : remainingToBest === 0
                          ? "New record 🎉"
                          : `${remainingToBest} ${
                              remainingToBest === 1 ? "day" : "days"
                            } to match`}
                    </p>
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-base">
                    🎯
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-base-content/45">
                  {longestStreak === 0
                    ? "Complete the habit consistently to create your first best."
                    : remainingToBest === 0
                      ? "You're at your current personal best. Keep going."
                      : "One completed day at a time."}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom insight */}

          <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-base-300 bg-base-100 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-sm">
                ✨
              </span>

              <p className="text-xs text-base-content/55">
                Consistency matters more than perfection.
              </p>
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-wide text-base-content/35">
              {selectedHabit?.habitName || "Selected habit"}
            </span>
          </div>
        </div>
      )}

      {/* No streak */}

      {streakStatus === "succeeded" && !streak && (
        <div className="p-5 sm:p-6 lg:p-7">
          <div className="rounded-3xl border border-dashed border-base-300 bg-base-200/30 p-9 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl">
              🌱
            </div>

            <p className="mt-4 text-sm font-semibold text-base-content">
              Start building your streak
            </p>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-base-content/50">
              Complete this habit consistently to create your first streak.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default HabitStreak;
