import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnalyticsShimmer } from "../layout/Shimmer";
import DatePicker from "../layout/DatePicker";
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

  return new Date(`${dateString}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

  const { habits, status: habitStatus } = useSelector((store) => store.habit);

  const today = new Date();

  const currentMonth = getMonthString(today);

  const currentWeek = getLocalDateString(getStartOfWeek(today));

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [openPicker, setOpenPicker] = useState(null);

  useEffect(() => {
    dispatch(
      fetchDailyAnalytics({
        date: selectedDate,
      }),
    );
  }, [dispatch, selectedDate]);

  useEffect(() => {
    dispatch(
      fetchWeeklyAnalytics({
        date: selectedWeek,
      }),
    );
  }, [dispatch, selectedWeek]);

  useEffect(() => {
    dispatch(
      fetchMonthlyAnalytics({
        date: `${selectedMonth}-01`,
      }),
    );
  }, [dispatch, selectedMonth]);

  useEffect(() => {
    const [year, month] = selectedMonth.split("-");

    dispatch(
      fetchCalendarAnalytics({
        year: Number(year),
        month: Number(month),
      }),
    );
  }, [dispatch, selectedMonth]);

  useEffect(() => {
    if (habitStatus === "idle") {
      dispatch(fetchHabits());
    }
  }, [dispatch, habitStatus]);

  const isInitialLoading = !daily && !weekly && !monthly && !calendar;

  if (isInitialLoading) {
    return <AnalyticsShimmer />;
  }

  const completionRate = Math.min(
    100,
    Math.max(0, Number(daily?.overall) || 0),
  );

  const completed = Number(daily?.completed) || 0;

  const expected = Number(daily?.expected) || 0;

  const remaining = Math.max(expected - completed, 0);

  return (
    <div className="w-full space-y-6 pb-8">
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
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Daily Progress
                </span>
              </div>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                Your day at a glance.
              </h1>

              <p className="mt-3 text-sm leading-6 text-base-content/60 sm:text-base">
                See how your habits are progressing and understand your
                consistency for the selected day.
              </p>
            </div>

            {/* Date selector */}
            <div className="w-full shrink-0 sm:w-auto">
              <DatePicker
                value={selectedDate}
                max={getLocalDateString()}
                placeholder="Select date"
                isOpen={openPicker === "daily"}
                onOpen={() => setOpenPicker("daily")}
                onClose={() => setOpenPicker(null)}
                onChange={(date) => {
                  if (!date) return;

                  setSelectedDate(date);
                  setOpenPicker(null);
                }}
                align="right"
              />
            </div>
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
                    <path d="M6 12h12" strokeLinecap="round" />
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
            {Object.entries(daily.categories).map(([category, stats]) => {
              const percentage = Math.min(
                100,
                Math.max(0, Number(stats?.percentage) || 0),
              );

              const completedCategory = Number(stats?.completed) || 0;

              const expectedCategory = Number(stats?.expected) || 0;

              const icon = categoryIcons[category.toLowerCase()] || "🌿";

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
                          {completedCategory} of {expectedCategory} completed
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
            })}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2">
        {/* Weekly Progress */}
        <div className="min-w-0 h-full">
          {weekly ? (
            <div className="h-full [&>div]:h-full [&>section]:h-full">
              <WeeklyChart
                data={weekly}
                selectedWeek={selectedWeek}
                onWeekChange={setSelectedWeek}
                maxDate={getLocalDateString()}
              />
            </div>
          ) : (
            <AnalyticsCardSkeleton type="weekly" />
          )}
        </div>

        {/* Consistency Calendar */}
        <div className="min-w-0 h-full">
          {calendarError ? (
            <div className="flex min-h-[470px] h-full items-center rounded-3xl border border-error/20 bg-error/10 p-5 text-sm font-medium text-error">
              {calendarError}
            </div>
          ) : calendar ? (
            <div className="h-full">
              <CalendarHeatmap
                data={calendar}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                maxMonth={currentMonth}
                loading={calendarStatus === "loading"}
              />
            </div>
          ) : (
            <AnalyticsCardSkeleton type="calendar" />
          )}
        </div>
      </section>

      {monthlyError && (
        <div className="rounded-2xl border border-error/20 bg-error/10 p-4 text-sm font-medium text-error">
          {monthlyError}
        </div>
      )}

      <section className="min-w-0">
        {monthly ? (
          <MonthlyChart
            data={monthly}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            maxMonth={currentMonth}
            loading={monthlyStatus === "loading"}
            error={monthlyError}
          />
        ) : (
          <AnalyticsCardSkeleton type="monthly" />
        )}
      </section>

      {habits?.length > 0 && (
        <section className="min-w-0">
          <HabitStreak habits={habits} />
        </section>
      )}
    </div>
  );
};

const AnalyticsCardSkeleton = ({ type }) => {
  if (type === "monthly") {
    return (
      <section className="min-h-[430px] rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-2xl bg-base-200" />

            <div>
              <div className="h-4 w-36 animate-pulse rounded bg-base-200" />
              <div className="mt-2 h-3 w-56 animate-pulse rounded bg-base-200" />
            </div>
          </div>

          <div className="h-10 w-36 animate-pulse rounded-xl bg-base-200" />
        </div>

        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-base-200/80" />
      </section>
    );
  }

  return (
    <section className="min-h-[470px] rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 animate-pulse rounded-2xl bg-base-200" />

          <div>
            <div className="h-4 w-36 animate-pulse rounded bg-base-200" />
            <div className="mt-2 h-3 w-48 animate-pulse rounded bg-base-200" />
          </div>
        </div>

        <div className="h-10 w-32 animate-pulse rounded-xl bg-base-200" />
      </div>

      <div className="mt-7 h-2 animate-pulse rounded-full bg-base-200" />

      <div className="mt-6 grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, index) => (
          <div
            key={index}
            className="h-10 animate-pulse rounded-lg bg-base-200"
          />
        ))}
      </div>

      <div className="mt-7 grid grid-cols-3 gap-3 border-t border-base-300 pt-4">
        <div className="h-12 animate-pulse rounded-xl bg-base-200" />
        <div className="h-12 animate-pulse rounded-xl bg-base-200" />
        <div className="h-12 animate-pulse rounded-xl bg-base-200" />
      </div>
    </section>
  );
};

export default Analytics;
