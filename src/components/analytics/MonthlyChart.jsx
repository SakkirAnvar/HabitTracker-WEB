const MonthlyChart = ({ data }) => {
  if (!data?.daily?.length) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-center shadow-sm">
        <p className="text-base-content/60">No monthly analytics available.</p>
      </div>
    );
  }

 const formatDay = (date) => {
  return new Date(`${date}T00:00:00`).getDate();
};

const formatFullDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

  const getPercentage = (value) => {
    return Math.min(100, Math.max(0, Number(value) || 0));
  };

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Monthly Progress</h2>

          <p className="text-sm text-base-content/60">
            Daily consistency throughout the month
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-base-content/50">Monthly Average</p>

          <p className="text-2xl font-bold text-primary">
            {getPercentage(data.overall)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Y-axis labels */}
          <div className="flex">
            <div className="flex w-10 shrink-0 flex-col justify-between pb-6 text-xs text-base-content/40">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            {/* Bars */}
            <div className="flex h-64 flex-1 items-end gap-1 border-b border-base-300">
              {data.daily.map((day) => {
                const percentage = getPercentage(day.overall);

                return (
                  <div
                    key={day.date}
                    className="group flex h-full flex-1 flex-col items-center justify-end"
                  >
                    {/* Percentage */}
                    <div className="mb-1 text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-100">
                      {percentage}%
                    </div>

                    {/* Bar container */}
                    <div className="flex h-52 w-full max-w-6 items-end rounded-t-md bg-base-200">
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          percentage === 100
                            ? "bg-success"
                            : percentage > 0
                              ? "bg-primary"
                              : "bg-base-300"
                        }`}
                        style={{
                          height: `${percentage}%`,
                        }}
                        title={`${day.date}: ${percentage}%`}
                      />
                    </div>

                    {/* Date */}
                    <span className="mt-2 text-[10px] text-base-content/50">
                     {formatDay(day.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-base-200 p-3">
          <p className="text-xs text-base-content/50">Monthly Average</p>

          <p className="mt-1 text-lg font-semibold">
            {getPercentage(data.overall)}%
          </p>
        </div>

        <div className="rounded-lg bg-base-200 p-3">
          <p className="text-xs text-base-content/50">Start Date</p>

          <p className="mt-1 text-sm font-medium">
           {formatFullDate(data.startDate)}
          </p>
        </div>

        <div className="rounded-lg bg-base-200 p-3">
          <p className="text-xs text-base-content/50">End Date</p>

          <p className="mt-1 text-sm font-medium">{formatFullDate(data.endDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyChart;
