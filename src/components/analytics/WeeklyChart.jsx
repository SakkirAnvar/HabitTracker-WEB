const WeeklyChart = ({ data }) => {
  if (!data?.daily?.length) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-5">
        <h2 className="text-lg font-semibold">Weekly Progress</h2>

        <p className="mt-2 text-sm text-base-content/60">
          No weekly data available.
        </p>
      </div>
    );
  }

  const formatDay = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
    });
  };

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
      {/* Header */}

      <div className="mb-5">
        <h2 className="text-lg font-semibold">Weekly Progress</h2>

        <p className="text-sm text-base-content/60">
          Daily habit completion for this week
        </p>
      </div>

      {/* Chart */}

      <div className="flex h-64 items-end gap-2 sm:gap-4">
        {data.daily.map((day) => {
          const percentage = Math.min(
            100,
            Math.max(0, Number(day.overall) || 0),
          );

          return (
            <div
              key={day.date}
              className="flex h-full flex-1 flex-col items-center justify-end"
            >
              {/* Percentage */}

              <span className="mb-2 text-xs font-medium">{percentage}%</span>

              {/* Bar area */}

              <div className="flex h-48 w-full max-w-12 items-end rounded-md bg-base-200">
                <div
                  className={`w-full rounded-md transition-all ${
                    percentage === 100 ? "bg-success" : "bg-primary"
                  }`}
                  style={{
                    height: `${percentage}%`,
                  }}
                  title={`${day.completed} of ${day.expected} completed`}
                />
              </div>

              {/* Day */}

              <span className="mt-2 text-xs text-base-content/60">
                {formatDay(day.date)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-base-200 pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-base-content/50">Weekly Average</p>

          <p className="mt-1 text-lg font-semibold">{data.overall}%</p>
        </div>

        <div>
          <p className="text-xs text-base-content/50">Start</p>

          <p className="mt-1 text-sm font-medium">{data.startDate}</p>
        </div>

        <div>
          <p className="text-xs text-base-content/50">End</p>

          <p className="mt-1 text-sm font-medium">{data.endDate}</p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;
