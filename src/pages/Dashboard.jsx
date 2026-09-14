import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDailyAnalytics } from "../api/analyticsApi";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  const expected = analytics?.expected || 0;
  const completed = analytics?.completed || 0;
  const remaining = Math.max(0, expected - completed);
  const overall = analytics?.overall || 0;

  return (
    <div className="w-full space-y-6">
      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-2xl font-bold text-base-content md:text-3xl">
          Good day, {user?.firstName}! 👋
        </h1>

        <p className="mt-1 text-sm text-base-content/60 sm:text-base">
          Here's how you're doing today.
        </p>
      </div>

      {/* ================= DAILY PROGRESS ================= */}

      <section
        className="
          rounded-2xl
          border
          border-base-300
          bg-base-100
          shadow-sm
        "
      >
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-base-content">
            Today's Progress
          </h2>

          <div className="flex flex-col items-center py-6">
            <div
              className="radial-progress text-primary"
              style={{
                "--value": overall,
                "--size": "10rem",
                "--thickness": "10px",
              }}
              role="progressbar"
              aria-valuenow={overall}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <span className="text-2xl font-bold text-base-content">
                {overall}%
              </span>
            </div>

            <p className="mt-5 text-center text-sm text-base-content/60">
              Keep going! Every completed habit counts.
            </p>
          </div>
        </div>
      </section>

      {/* ================= STATISTICS ================= */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Expected */}

        <div
          className="
            rounded-2xl
            border
            border-base-300
            bg-base-100
            p-5
            shadow-sm
          "
        >
          <p className="text-sm font-medium text-base-content/60">Expected</p>

          <p className="mt-2 text-3xl font-bold text-primary">{expected}</p>

          <p className="mt-1 text-xs text-base-content/50">Today's habits</p>
        </div>

        {/* Completed */}

        <div
          className="
            rounded-2xl
            border
            border-base-300
            bg-base-100
            p-5
            shadow-sm
          "
        >
          <p className="text-sm font-medium text-base-content/60">Completed</p>

          <p className="mt-2 text-3xl font-bold text-success">{completed}</p>

          <p className="mt-1 text-xs text-base-content/50">Completed today</p>
        </div>

        {/* Remaining */}

        <div
          className="
            rounded-2xl
            border
            border-base-300
            bg-base-100
            p-5
            shadow-sm
          "
        >
          <p className="text-sm font-medium text-base-content/60">Remaining</p>

          <p className="mt-2 text-3xl font-bold text-warning">{remaining}</p>

          <p className="mt-1 text-xs text-base-content/50">Habits left</p>
        </div>

        {/* Score */}

        <div
          className="
            rounded-2xl
            border
            border-base-300
            bg-base-100
            p-5
            shadow-sm
          "
        >
          <p className="text-sm font-medium text-base-content/60">Score</p>

          <p className="mt-2 text-3xl font-bold text-base-content">
            {overall}%
          </p>

          <p className="mt-1 text-xs text-base-content/50">Daily completion</p>
        </div>
      </section>

      {/* ================= CATEGORY PROGRESS ================= */}

      {analytics?.categories && (
        <section
          className="
            rounded-2xl
            border
            border-base-300
            bg-base-100
            shadow-sm
          "
        >
          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-base-content">
              Category Progress
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              {Object.entries(analytics.categories).map(([category, data]) => {
                const categoryPercentage = data.expected
                  ? Math.round((data.completed / data.expected) * 100)
                  : 0;

                return (
                  <div
                    key={category}
                    className="rounded-xl border border-base-300 bg-base-200/50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="font-medium capitalize text-base-content">
                        {category}
                      </span>

                      <span className="text-sm font-medium text-base-content/60">
                        {data.completed}/{data.expected}
                      </span>
                    </div>

                    <progress
                      className="progress progress-primary w-full"
                      value={categoryPercentage}
                      max="100"
                    />

                    <div className="mt-2 flex justify-between">
                      <span className="text-xs text-base-content/50">
                        Progress
                      </span>

                      <span className="text-xs font-semibold text-primary">
                        {categoryPercentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
