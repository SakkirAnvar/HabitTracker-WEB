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

  return (
    <div className="w-full space-y-7 pb-8">
      <section>
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
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border-[18px] border-primary/10" />

        <div className="pointer-events-none absolute -bottom-12 right-20 h-28 w-28 rounded-full bg-secondary/10" />

        <div className="pointer-events-none absolute right-10 top-12 text-5xl text-primary/10">
          ✦
        </div>

        {/* Header */}
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-primary">
              Daily progress
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              Your day at a glance.
            </h1>
          </div>

          {/* Date selector */}
          <label className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-base-300 bg-base-100/90 px-3 shadow-sm backdrop-blur-sm">
            <input
              type="date"
              value={selectedDate}
              max={getLocalDateString()}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                }
              }}
              className="w-[135px] bg-transparent text-xs font-medium text-base-content outline-none"
            />
          </label>
        </div>

        {/* Daily Summary */}
        <div className="relative z-10 mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {/* Completion Rate */}
          <div className="rounded-2xl border border-base-300/70 bg-base-100/90 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-base-content/55">
                  Completion Rate
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-base-content">
                  {daily.overall}%
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm text-primary">
                ✓
              </div>
            </div>

            <progress
              className="progress progress-primary mt-3 h-1.5 w-full"
              value={daily.overall}
              max="100"
            />

            <p className="mt-2 text-[11px] text-base-content/45">
              Selected day's completion
            </p>
          </div>

          {/* Habits Completed */}
          <div className="rounded-2xl border border-base-300/70 bg-base-100/90 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-base-content/55">
                  Habits Completed
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-base-content">
                  {daily.completed}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-sm text-secondary">
                ✓
              </div>
            </div>

            <p className="mt-4 text-[11px] text-base-content/45">
              Out of {daily.expected} expected
            </p>
          </div>

          {/* Expected */}
          <div className="rounded-2xl border border-base-300/70 bg-base-100/90 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-base-content/55">
                  Expected
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-base-content">
                  {daily.expected}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-sm text-secondary">
                ○
              </div>
            </div>

            <p className="mt-4 text-[11px] text-base-content/45">
              Habits scheduled for this day
            </p>
          </div>

          {/* Habits Tracked */}
          <div className="rounded-2xl border border-base-300/70 bg-base-100/90 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-base-content/55">
                  Habits Tracked
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-base-content">
                  {habits?.length || 0}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm text-primary">
                ◎
              </div>
            </div>

            <p className="mt-4 text-[11px] text-base-content/45">
              Active habits in your routine
            </p>
          </div>
        </div>
      </section>

      {daily?.categories && (
        <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-base-content">
              Category Progress
            </h2>

            <p className="text-sm text-base-content/50">
              See how different areas of your routine are progressing today.
            </p>
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
        {/* Weekly Progress */}
        <div className="flex min-w-0">
          {weekly && (
            <div className="flex w-full">
              <WeeklyChart
                data={weekly}
                selectedWeek={selectedWeek}
                onWeekChange={setSelectedWeek}
                maxDate={getLocalDateString()}
              />
            </div>
          )}
        </div>

        {/* Consistency Calendar */}
        <div className="flex min-w-0">
          {calendarError && (
            <div className="alert alert-error mb-4 w-full rounded-xl">
              <span>{calendarError}</span>
            </div>
          )}

          {calendar && (
            <div className="flex w-full">
              <CalendarHeatmap
                data={calendar}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                maxMonth={currentMonth}
                loading={calendarStatus === "loading"}
              />
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

        {monthly && (
          <MonthlyChart
            data={monthly}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            maxMonth={currentMonth}
            loading={monthlyStatus === "loading"}
          />
        )}
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

        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/5" />

        <div className="pointer-events-none absolute -bottom-10 right-20 h-24 w-24 rounded-full bg-secondary/5" />
      </section>
    </div>
  );
};

export default Analytics;
