
import { useEffect, useState } from "react";
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

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getMonthString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

const getStartOfWeek = (date) => {
  const current = new Date(date);
  const day = current.getDay();

  const difference = day === 0 ? -6 : 1 - day;

  current.setDate(current.getDate() + difference);
  current.setHours(0, 0, 0, 0);

  return current;
};

const formatSelectedDate = (dateString) => {
  if (!dateString) return "";

  return new Date(`${dateString}T00:00:00`).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
};

const Analytics = () => {
  const dispatch = useDispatch();

  const {
    daily,
    weekly,
    monthly,
    calendar,
    monthlyStatus,
    calendarStatus,
    monthlyError,
    calendarError,
  } = useSelector((store) => store.analytic);

  const {
    habits,
    status: habitStatus,
  } = useSelector((store) => store.habit);

  const today = new Date();

  const currentMonth = getMonthString(today);

  const currentWeek = getLocalDateString(
    getStartOfWeek(today),
  );

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const [selectedWeek, setSelectedWeek] =
    useState(currentWeek);

  const [selectedDate, setSelectedDate] =
    useState(getLocalDateString());

  // =========================
  // DAILY ANALYTICS
  // =========================

  useEffect(() => {
    dispatch(
      fetchDailyAnalytics({
        date: selectedDate,
      }),
    );
  }, [dispatch, selectedDate]);

  // =========================
  // WEEKLY ANALYTICS
  // =========================

  useEffect(() => {
    dispatch(
      fetchWeeklyAnalytics({
        date: selectedWeek,
      }),
    );
  }, [dispatch, selectedWeek]);

  // =========================
  // MONTHLY ANALYTICS
  // =========================

  useEffect(() => {
    dispatch(
      fetchMonthlyAnalytics({
        date: `${selectedMonth}-01`,
      }),
    );
  }, [dispatch, selectedMonth]);

  // =========================
  // CALENDAR ANALYTICS
  // =========================

  useEffect(() => {
    const [year, month] = selectedMonth.split("-");

    dispatch(
      fetchCalendarAnalytics({
        year: Number(year),
        month: Number(month),
      }),
    );
  }, [dispatch, selectedMonth]);

  // =========================
  // HABITS
  // =========================

  useEffect(() => {
    if (habitStatus === "idle") {
      dispatch(fetchHabits());
    }
  }, [dispatch, habitStatus]);

  // =========================
  // INITIAL LOADING
  // =========================

  const isInitialLoading =
    !daily &&
    !weekly &&
    !monthly &&
    !calendar;

  if (isInitialLoading) {
    return <AnalyticsShimmer />;
  }

  // =========================
  // SELECTED DAY VALUES
  // =========================

  const completionRate = Math.min(
    100,
    Math.max(0, Number(daily?.overall) || 0),
  );

  const completed = Number(daily?.completed) || 0;

  const expected = Number(daily?.expected) || 0;

  const remaining = Math.max(
    expected - completed,
    0,
  );

  return (
    <div className="w-full space-y-6 pb-8">
      {/* =================================================
          DAILY PROGRESS
      ================================================= */}

      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full border-[20px] border-primary/10" />

        <div className="pointer-events-none absolute -bottom-10 right-28 h-32 w-32 rounded-full bg-secondary/10" />

        <div className="pointer-events-none absolute right-10 top-8 text-5xl text-primary/10">
          ✦
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary">
                Daily progress
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                Your day at a glance.
              </h1>

              <p className="mt-3 text-sm leading-6 text-base-content/60 sm:text-base">
                See how your habits are progressing and understand
                your consistency for the selected day.
              </p>
            </div>

            {/* Date selector */}
           <label className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-base-300 bg-base-100/90 px-3 shadow-sm transition hover:border-primary/30 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10">
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4 shrink-0 text-primary"
  >
    <path
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

  <input
    type="date"
    value={selectedDate}
    max={getLocalDateString()}
    onChange={(e) => {
      if (e.target.value) {
        setSelectedDate(e.target.value);
      }
    }}
    className="w-[130px] cursor-pointer bg-transparent text-xs font-semibold text-base-content outline-none"
  />
</label>
          </div>

          {/* Selected date */}
          <div className="mt-6 flex items-center gap-2 border-t border-primary/10 pt-4">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            <p className="text-sm font-medium text-base-content/60">
              {formatSelectedDate(selectedDate)}
            </p>

            {selectedDate === getLocalDateString() && (
              <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                Today
              </span>
            )}
          </div>

          {/* =================================================
              SELECTED DAY SUMMARY
          ================================================= */}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {/* Completion */}
            <div className="rounded-2xl border border-base-300/70 bg-base-100/90 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-base-content/50">
                    Completion
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-base-content">
                    {completionRate}%
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path
                      d="M5 12.5l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-base-300">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${completionRate}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[10px] text-base-content/40">
                Completion for this day
              </p>
            </div>

            {/* Completed */}
            <div className="rounded-2xl border border-base-300/70 bg-base-100/90 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-base-content/50">
                    Completed
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-base-content">
                    {completed}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10 text-success">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path
                      d="M5 12.5l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <p className="mt-4 text-[10px] text-base-content/40">
                Habits completed on this day
              </p>
            </div>

            {/* Expected */}
            <div className="rounded-2xl border border-base-300/70 bg-base-100/90 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-base-content/50">
                    Expected
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-base-content">
                    {expected}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="8.5" />
                    <path
                      d="M12 7.5v5l3 1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <p className="mt-4 text-[10px] text-base-content/40">
                Habits scheduled for this day
              </p>
            </div>

            {/* Remaining */}
            <div className="rounded-2xl border border-base-300/70 bg-base-100/90 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-base-content/50">
                    Remaining
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-base-content">
                    {remaining}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path
                      d="M6 12h12"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="12" r="8.5" />
                  </svg>
                </div>
              </div>

              <p className="mt-4 text-[10px] text-base-content/40">
                Expected habits still incomplete
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CATEGORY PROGRESS
      ================================================= */}

      {daily?.categories && (
        <section className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/60">
              Daily breakdown
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-base-content">
              Category Progress
            </h2>

            <p className="mt-1 text-sm text-base-content/50">
              See how each area of your routine is progressing on this day.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(daily.categories).map(
              ([category, stats]) => {
                const percentage = Math.min(
                  100,
                  Math.max(
                    0,
                    Number(stats?.percentage) || 0,
                  ),
                );

                const completedCategory =
                  Number(stats?.completed) || 0;

                const expectedCategory =
                  Number(stats?.expected) || 0;

                const icon =
                  categoryIcons[
                    category.toLowerCase()
                  ] || "🌿";

                return (
                  <div
                    key={category}
                    className="rounded-2xl border border-base-300 bg-base-200/30 p-4 transition hover:border-primary/15 hover:bg-primary/[0.025]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
                          {icon}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold capitalize text-base-content">
                            {category}
                          </h3>

                          <p className="mt-0.5 text-xs text-base-content/45">
                            {completedCategory} of{" "}
                            {expectedCategory} completed
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-sm font-bold text-primary">
                        {percentage}%
                      </span>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-base-300">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </section>
      )}

      {/* =================================================
          WEEKLY + CALENDAR
      ================================================= */}

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Weekly Progress */}
        <div className="min-w-0">
          {weekly ? (
            <WeeklyChart
              data={weekly}
              selectedWeek={selectedWeek}
              onWeekChange={setSelectedWeek}
              maxDate={getLocalDateString()}
            />
          ) : (
            <div className="min-h-[300px] rounded-2xl border border-base-300 bg-base-100" />
          )}
        </div>

        {/* Consistency Calendar */}
        <div className="min-w-0">
          {calendarError ? (
            <div className="rounded-2xl border border-error/20 bg-error/10 p-4 text-sm font-medium text-error">
              {calendarError}
            </div>
          ) : calendar ? (
            <CalendarHeatmap
              data={calendar}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              maxMonth={currentMonth}
              loading={calendarStatus === "loading"}
            />
          ) : (
            <div className="min-h-[300px] rounded-2xl border border-base-300 bg-base-100" />
          )}
        </div>
      </section>

      {/* =================================================
          MONTHLY PROGRESS
      ================================================= */}

      {monthlyError && (
        <div className="rounded-2xl border border-error/20 bg-error/10 p-4 text-sm font-medium text-error">
          {monthlyError}
        </div>
      )}

      {monthly && (
        <section className="min-w-0">
          <MonthlyChart
            data={monthly}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            maxMonth={currentMonth}
            loading={monthlyStatus === "loading"}
          />
        </section>
      )}

      {/* =================================================
          HABIT STREAK
      ================================================= */}

      {habits?.length > 0 && (
        <section className="min-w-0">
          <HabitStreak habits={habits} />
        </section>
      )}

      {/* =================================================
          CLOSING MESSAGE
      ================================================= */}

      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10" />

        <div className="pointer-events-none absolute -bottom-10 right-24 h-24 w-24 rounded-full bg-secondary/10" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/60">
              Keep going
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-base-content sm:text-2xl">
              Small steps. Big changes.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/55">
              Progress doesn't need to be perfect. Stay consistent,
              keep showing up, and let the small actions compound.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-base-100 text-primary shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-6 w-6"
            >
              <path
                d="M12 20V9"
                strokeLinecap="round"
              />

              <path
                d="M12 13c-3.5 0-5.5-2.2-5.5-5.5C10 7.5 12 9.5 12 13Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M12 16c3.5 0 5.5-2.2 5.5-5.5C14 10.5 12 12.5 12 16Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
