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

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          Good day, {user?.firstName}! 👋
        </h1>

        <p className="mt-1 text-base-content/60">
          Here's how you're doing today.
        </p>
      </div>

      {/* Daily Progress */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Today's Progress</h2>

          <div className="mt-4 flex flex-col items-center">
            <div
              className="radial-progress text-primary"
              style={{
                "--value": analytics?.completionPercentage || 0,
                "--size": "10rem",
                "--thickness": "10px",
              }}
              role="progressbar"
            >
              <span className="text-2xl font-bold">
                {analytics?.completionPercentage || 0}%
              </span>
            </div>

            <p className="mt-4 text-base-content/60">
              Keep going! Every completed habit counts.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat rounded-box bg-base-100 shadow-sm">
          <div className="stat-title">Expected</div>
          <div className="stat-value text-primary">
            {analytics?.expectedHabits || 0}
          </div>
          <div className="stat-desc">Today's habits</div>
        </div>

        <div className="stat rounded-box bg-base-100 shadow-sm">
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">
            {analytics?.completedHabits || 0}
          </div>
          <div className="stat-desc">Completed today</div>
        </div>

        <div className="stat rounded-box bg-base-100 shadow-sm">
          <div className="stat-title">Remaining</div>
          <div className="stat-value text-warning">
            {Math.max(
              0,
              (analytics?.expectedHabits || 0) -
                (analytics?.completedHabits || 0),
            )}
          </div>
          <div className="stat-desc">Habits left</div>
        </div>

        <div className="stat rounded-box bg-base-100 shadow-sm">
          <div className="stat-title">Score</div>
          <div className="stat-value">
            {analytics?.completionPercentage || 0}%
          </div>
          <div className="stat-desc">Daily completion</div>
        </div>
      </div>

      {/* Category Progress */}
      {analytics?.categories && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Category Progress</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Object.entries(analytics.categories).map(([category, data]) => (
                <div key={category}>
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium capitalize">{category}</span>

                    <span className="text-sm text-base-content/60">
                      {data.completed}/{data.expected}
                    </span>
                  </div>

                  <progress
                    className="progress progress-primary w-full"
                    value={data.expected ? data.completed : 0}
                    max={data.expected || 1}
                  ></progress>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
