import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnalyticsShimmer } from "../layout/Shimmer";
import {
  fetchDailyAnalytics,
  fetchWeeklyAnalytics,
  fetchMonthlyAnalytics,
  fetchCalendarAnalytics,
} from "../redux/analyticSlice";

import { fetchHabits } from "../redux/habitSlice";

import WeeklyChart from "../components/analytics/WeeklyChart";
import MonthlyChart from "../components/analytics/MonthlyChart";
import CalendarHeatmap from "../components/analytics/CalenderHeatMap";
import HabitStreak from "../components/analytics/HabitStreak";

const categoryIcons = {
  spiritual: "🪷",
  skills: "🎯",
  physical: "🏃",
  personal: "🌱",
};

const Analytics = () => {
  const dispatch = useDispatch();

  const {
    daily,
    weekly,
    monthly,
    calendar,
    dailyStatus,
    weeklyStatus,
    monthlyStatus,
    calendarStatus,
    weeklyError,
    monthlyError,
    calendarError,
  } = useSelector((store) => store.analytic);

  const { habits, status: habitStatus } = useSelector((store) => store.habit);

  useEffect(() => {
    dispatch(fetchDailyAnalytics());
    dispatch(fetchWeeklyAnalytics());
    dispatch(fetchMonthlyAnalytics());
    dispatch(fetchCalendarAnalytics());

    if (habitStatus === "idle") {
      dispatch(fetchHabits());
    }
  }, [dispatch, habitStatus]);

  const isLoading =
    dailyStatus === "loading" ||
    weeklyStatus === "loading" ||
    monthlyStatus === "loading" ||
    calendarStatus === "loading" ||
    habitStatus === "loading";

  if (isLoading) {
    return <AnalyticsShimmer />;
  }

  return (
    <div className="w-full space-y-7 pb-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-primary">Your progress</p>

          <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Your Progress, Clearly.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/60">
            Understand your consistency, recognize your progress, and keep
            building better days.
          </p>
        </div>

        {/* Date / Period */}
        <div className="flex items-center gap-2 self-start rounded-xl border border-base-300 bg-base-100 px-3 py-2 shadow-sm sm:self-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <span className="text-sm font-medium text-base-content">
            This month
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-base-content/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-base-100 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
            <span>🌱</span>
            Keep going
          </div>

          <h2 className="text-xl font-bold text-base-content sm:text-2xl">
            Small actions are becoming real progress.
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/60">
            Your daily consistency adds up over time. Use your analytics to
            understand what is working and keep moving forward.
          </p>
        </div>

        {/* Decorative graphic */}
        <div className="pointer-events-none absolute -right-6 -top-8 hidden h-48 w-48 rounded-full border-[18px] border-primary/10 sm:block" />

        <div className="pointer-events-none absolute right-8 bottom-5 hidden h-20 w-20 rounded-full bg-secondary/10 sm:block" />

        <div className="pointer-events-none absolute right-16 top-10 hidden text-5xl opacity-20 sm:block">
          ✦
        </div>

        <div className="pointer-events-none absolute right-16 bottom-5 hidden text-3xl opacity-20 sm:block">
          🌿
        </div>
      </section>

      {daily && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Completion Rate */}
          <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60">
                  Completion Rate
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-base-content">
                  {daily.overall}%
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                ✓
              </div>
            </div>

            <progress
              className="progress progress-primary mt-4 h-1.5 w-full"
              value={daily.overall}
              max="100"
            />

            <p className="mt-2 text-xs text-base-content/50">
              Today's completion
            </p>
          </div>

          {/* Completed */}
          <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60">
                  Habits Completed
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-base-content">
                  {daily.completed}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                ✓
              </div>
            </div>

            <p className="mt-4 text-xs text-base-content/50">
              Out of {daily.expected} expected today
            </p>
          </div>

          {/* Expected */}
          <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60">
                  Expected Today
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-base-content">
                  {daily.expected}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                ○
              </div>
            </div>

            <p className="mt-4 text-xs text-base-content/50">
              Habits scheduled today
            </p>
          </div>

          {/* Habits Tracked */}
          <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60">
                  Habits Tracked
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-base-content">
                  {habits?.length || 0}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                ◎
              </div>
            </div>

            <p className="mt-4 text-xs text-base-content/50">
              Active habits in your routine
            </p>
          </div>
        </section>
      )}

      {daily?.categories && (
        <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-base-content">
                Category Progress
              </h2>

              <p className="text-sm text-base-content/50">
                See how different areas of your routine are progressing today.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(daily.categories).map(([category, stats]) => {
              const percentage = Math.min(
                100,
                Math.max(0, Number(stats.percentage) || 0),
              );

              const icon = categoryIcons[category.toLowerCase()] || "🌿";

              return (
                <div
                  key={category}
                  className="rounded-xl border border-base-300 bg-base-200/30 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
                        {icon}
                      </div>

                      <div>
                        <h3 className="font-semibold capitalize text-base-content">
                          {category}
                        </h3>

                        <p className="text-xs text-base-content/50">
                          {stats.completed} of {stats.expected} completed
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-bold text-primary">
                      {percentage}%
                    </span>
                  </div>

                  <progress
                    className="progress progress-primary mt-4 h-1.5 w-full"
                    value={percentage}
                    max="100"
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Weekly */}
        <div className="flex min-w-0">
          {weeklyError && (
            <div className="alert alert-error mb-4 w-full rounded-xl">
              <span>{weeklyError}</span>
            </div>
          )}

          {weekly && (
            <div className="flex w-full">
              <WeeklyChart data={weekly} />
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="flex min-w-0">
          {calendarError && (
            <div className="alert alert-error mb-4 w-full rounded-xl">
              <span>{calendarError}</span>
            </div>
          )}

          {calendar && (
            <div className="flex w-full">
              <CalendarHeatmap data={calendar} />
            </div>
          )}
        </div>
      </section>

      <section className="min-w-0">
        {monthlyError && (
          <div className="alert alert-error mb-4 rounded-xl">
            <span>{monthlyError}</span>
          </div>
        )}

        {monthly && <MonthlyChart data={monthly} />}
      </section>

      {habits?.length > 0 && (
        <section className="min-w-0">
          <HabitStreak habits={habits} />
        </section>
      )}

      <section className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold text-base-content">
              Small steps. Big changes.
            </p>

            <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/55">
              Progress doesn't need to be perfect. Stay consistent and keep
              showing up for yourself.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
            🌱
          </div>
        </div>

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/5" />
        <div className="pointer-events-none absolute -bottom-10 right-20 h-24 w-24 rounded-full bg-secondary/5" />
      </section>
    </div>
  );
};

export default Analytics;
