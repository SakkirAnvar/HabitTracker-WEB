import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
    dailyError,
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
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-base-content/60">
          Understand your consistency and track your growth.
        </p>
      </div>

      {/* ================= DAILY ERROR ================= */}

      {dailyError && (
        <div className="alert alert-error">
          <span>{dailyError}</span>
        </div>
      )}

      {/* ================= DAILY SUMMARY ================= */}

      {daily && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-base-content">
            Today
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Completion */}

            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
              <p className="text-sm text-base-content/60">Completion</p>

              <p className="mt-2 text-3xl font-bold text-base-content">
                {daily.overall}%
              </p>

              <progress
                className="progress progress-primary mt-3 w-full"
                value={daily.overall}
                max="100"
              />
            </div>

            {/* Completed */}

            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
              <p className="text-sm text-base-content/60">Completed</p>

              <p className="mt-2 text-3xl font-bold text-base-content">
                {daily.completed}
              </p>

              <p className="mt-1 text-sm text-base-content/50">
                of {daily.expected} expected
              </p>
            </div>

            {/* Expected */}

            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
              <p className="text-sm text-base-content/60">Expected Habits</p>

              <p className="mt-2 text-3xl font-bold text-base-content">
                {daily.expected}
              </p>

              <p className="mt-1 text-sm text-base-content/50">
                scheduled today
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ================= CATEGORY SUMMARY ================= */}

      {daily?.categories && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-base-content">
            Today's Categories
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(daily.categories).map(([category, stats]) => (
              <div
                key={category}
                className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold capitalize text-base-content">
                    {category}
                  </h3>

                  <span className="text-sm font-semibold text-primary">
                    {stats.percentage}%
                  </span>
                </div>

                <progress
                  className="progress progress-primary mt-4 w-full"
                  value={stats.percentage}
                  max="100"
                />

                <p className="mt-2 text-xs text-base-content/50">
                  {stats.completed} of {stats.expected} completed
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= WEEKLY ================= */}

      {weeklyError && (
        <div className="alert alert-error">
          <span>{weeklyError}</span>
        </div>
      )}

      {weekly && <WeeklyChart data={weekly} />}

      {/* ================= MONTHLY ================= */}

      {monthlyError && (
        <div className="alert alert-error">
          <span>{monthlyError}</span>
        </div>
      )}

      {monthly && <MonthlyChart data={monthly} />}

      {/* ================= CALENDAR ================= */}

      {calendarError && (
        <div className="alert alert-error">
          <span>{calendarError}</span>
        </div>
      )}

      {calendar && <CalendarHeatmap data={calendar} />}

      {/* ================= HABIT STREAK ================= */}

      {habits?.length > 0 && <HabitStreak habits={habits} />}
    </div>
  );
};

export default Analytics;
