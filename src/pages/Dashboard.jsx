import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDailyAnalytics } from "../api/analyticsApi";
import { DashboardShimmer } from "../layout/Shimmer";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getGreeting = (name) => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return `Good morning, ${name}!`;
    }

    if (hour >= 12 && hour < 17) {
      return `Good afternoon, ${name}!`;
    }

    if (hour >= 17 && hour < 21) {
      return `Good evening, ${name}!`;
    }

    return `Good night, ${name}!`;
  };

  const greeting = getGreeting(user?.firstName);

  useEffect(() => {
    const fetchDailyAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDailyAnalytics();

        if (response.status) {
          setAnalytics(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch daily analytics:", err);

        setError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDailyAnalytics();
  }, []);

  if (loading) {
    return <DashboardShimmer />;
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      </div>
    );
  }

  const expected = Number(analytics?.expected) || 0;
  const completed = Number(analytics?.completed) || 0;
  const remaining = Math.max(0, expected - completed);

  const overall = Math.min(100, Math.max(0, Number(analytics?.overall) || 0));

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const getProgressMessage = () => {
    if (overall === 100) {
      return {
        eyebrow: "Well done",
        title: "You've done it!",
        description: "You've completed all your habits for today.",
      };
    }

    if (overall >= 75) {
      return {
        eyebrow: "Almost there",
        title: "Keep going!",
        description: "You're close to completing your day.",
      };
    }

    if (overall > 0) {
      return {
        eyebrow: "Keep going",
        title: "Small steps make big changes.",
        description: "Keep building your better day, one habit at a time.",
      };
    }

    return {
      eyebrow: "Start small",
      title: "Small steps make big changes.",
      description: "Complete your habits for today and keep moving forward.",
    };
  };

  const progressMessage = getProgressMessage();

  const categoryIcons = {
    spiritual: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20c4.5-2.5 6-6.2 6-10.5C15.5 9.8 13.4 7.7 12 4c-1.4 3.7-3.5 5.8-6 5.5C6 13.8 7.5 17.5 12 20z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20v-7" />
      </svg>
    ),

    skills: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7.5L12 4l8 3.5L12 11 4 7.5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 9v5.5c0 1.7 2.2 3 5 3s5-1.3 5-3V9"
        />
      </svg>
    ),

    physical: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 9v6M18 9v6M3.5 10.5h5v3h-5zM15.5 10.5h5v3h-5zM8.5 12h7"
        />
      </svg>
    ),

    personal: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5"
      >
        <circle cx="12" cy="8" r="3" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.5 19a6.5 6.5 0 0113 0"
        />
      </svg>
    ),
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ================= HEADER ================= */}

        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              {greeting}
            </h1>

            <p className="mt-1 text-sm text-base-content/60 sm:text-base">
              Here's your progress for today.
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-sm font-semibold text-base-content">
              {formattedDate}
            </p>

            <p className="mt-1 text-sm text-base-content/50">
              Stay consistent.
            </p>
          </div>
        </header>

        {/* ================= TODAY'S PROGRESS ================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-base-300
            bg-base-100
            shadow-sm
          "
        >
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5" />

          <div className="pointer-events-none absolute -bottom-24 -right-8 h-48 w-48 rounded-full bg-secondary/5" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[240px_1fr_180px] lg:items-center lg:p-10">
            {/* Progress Ring */}

            <div className="flex justify-center lg:justify-start">
              <div
                className="
                  flex h-48 w-48
                  items-center justify-center
                  rounded-full
                  border-[14px]
                  border-base-200
                  bg-base-100
                "
                style={{
                  background: `
                    radial-gradient(circle, var(--fallback-b1,oklch(var(--b1))) 62%, transparent 63%),
                    conic-gradient(
                      var(--fallback-p,oklch(var(--p))) ${overall}%,
                      var(--fallback-b2,oklch(var(--b2))) ${overall}% 100%
                    )
                  `,
                }}
              >
                <div className="flex h-36 w-36 items-center justify-center rounded-full bg-base-100">
                  <div className="text-center">
                    <p className="text-4xl font-bold tracking-tight text-base-content">
                      {overall}%
                    </p>

                    <p className="mt-1 text-sm text-base-content/50">
                      Today's progress
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}

            <div className="text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {progressMessage.eyebrow}
              </p>

              <h2 className="mt-3 max-w-xl text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
                {progressMessage.title}
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-base-content/60 sm:text-base">
                {progressMessage.description}
              </p>

              <Link
                to="/habits"
                className="
                  btn
                  btn-primary
                  mt-6
                  rounded-xl
                  px-5
                  shadow-sm
                "
              >
                View Today's Habits
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M13 6l6 6-6 6"
                  />
                </svg>
              </Link>
            </div>

            {/* Small Quote */}

            <div className="hidden border-l border-base-300 pl-6 lg:block">
              <p className="text-sm italic leading-6 text-base-content/50">
                “A better you is built one consistent day at a time.”
              </p>

              <div className="mt-4 h-px w-8 bg-primary" />
            </div>
          </div>
        </section>

        {/* ================= SUMMARY ================= */}

        <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Completed */}

          <div
            className="
              rounded-2xl
              border border-base-300
              bg-base-100
              p-5
              shadow-sm
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-base-content/60">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-success">
                  {completed}
                </p>

                <p className="mt-1 text-xs text-base-content/50">
                  of {expected} habits
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="8.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.5 12l2.2 2.2 4.8-4.8"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Remaining */}

          <div
            className="
              rounded-2xl
              border border-base-300
              bg-base-100
              p-5
              shadow-sm
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-base-content/60">
                  Remaining
                </p>

                <p className="mt-2 text-3xl font-bold text-warning">
                  {remaining}
                </p>

                <p className="mt-1 text-xs text-base-content/50">
                  habits left today
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="8.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7v5l3 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Expected */}

          <div
            className="
              rounded-2xl
              border border-base-300
              bg-base-100
              p-5
              shadow-sm
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-base-content/60">
                  Expected
                </p>

                <p className="mt-2 text-3xl font-bold text-primary">
                  {expected}
                </p>

                <p className="mt-1 text-xs text-base-content/50">
                  today's habits
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <rect x="4" y="5.5" width="16" height="14" rx="2" />
                  <path strokeLinecap="round" d="M8 3.5v4M16 3.5v4M4 10h16" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CATEGORY PROGRESS ================= */}

        {analytics?.categories && (
          <section
            className="
              mt-5
              rounded-2xl
              border border-base-300
              bg-base-100
              shadow-sm
            "
          >
            <div className="p-5 sm:p-6">
              {/* Section Header */}

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-base-content sm:text-xl">
                    Habit Categories
                  </h2>

                  <p className="mt-1 text-sm text-base-content/50">
                    See how you're progressing across each area.
                  </p>
                </div>

                <Link
                  to="/habits"
                  className="
                    hidden
                    items-center
                    gap-1
                    text-sm
                    font-medium
                    text-primary
                    hover:underline
                    sm:flex
                  "
                >
                  View all
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 6l6 6-6 6"
                    />
                  </svg>
                </Link>
              </div>

              {/* Categories */}

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Object.entries(analytics.categories).map(
                  ([category, data]) => {
                    const categoryExpected = Number(data?.expected) || 0;
                    const categoryCompleted = Number(data?.completed) || 0;

                    const categoryPercentage = categoryExpected
                      ? Math.min(
                          100,
                          Math.round(
                            (categoryCompleted / categoryExpected) * 100,
                          ),
                        )
                      : 0;

                    const categoryKey = category.toLowerCase();

                    return (
                      <div
                        key={category}
                        className="
                          rounded-2xl
                          border border-base-300
                          bg-base-200/30
                          p-4
                          transition-colors
                          hover:bg-base-200/50
                        "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              flex h-10 w-10 shrink-0
                              items-center justify-center
                              rounded-xl
                              bg-primary/10
                              text-primary
                            "
                          >
                            {categoryIcons[categoryKey] || (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                className="h-5 w-5"
                              >
                                <circle cx="12" cy="12" r="8" />
                              </svg>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold capitalize text-base-content">
                                {category}
                              </p>

                              <span className="text-sm text-base-content/50">
                                {categoryCompleted}/{categoryExpected}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Progress */}

                        <div className="mt-4">
                          <div className="h-2 overflow-hidden rounded-full bg-base-300">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{
                                width: `${categoryPercentage}%`,
                              }}
                            />
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-base-content/45">
                              Progress
                            </span>

                            <span className="text-xs font-semibold text-primary">
                              {categoryPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </section>
        )}

        {/* ================= MOBILE VIEW ALL ================= */}

        <div className="mt-4 sm:hidden">
          <Link
            to="/habits"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all habits →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
