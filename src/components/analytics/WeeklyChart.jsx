const WeeklyChart = ({ data }) => {
  if (!data?.daily?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl">
          📈
        </div>

        <h2 className="mt-3 text-lg font-semibold text-base-content">
          Weekly Progress
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          No weekly data available yet.
        </p>

        <p className="mt-1 text-xs text-base-content/45">
          Keep tracking your habits to see your weekly progress.
        </p>
      </div>
    );
  }

  const formatDay = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getPercentage = (value) => {
    return Math.min(100, Math.max(0, Number(value) || 0));
  };

  const weeklyAverage = getPercentage(data.overall);

  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
            📈
          </div>

          <div>
            <h2 className="text-lg font-semibold text-base-content">
              Weekly Progress
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              Daily habit completion for this week.
            </p>
          </div>
        </div>

        {/* Weekly Average */}

        <div className="rounded-xl bg-primary/10 px-4 py-2.5 sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/50">
            Weekly Average
          </p>

          <p className="mt-0.5 text-xl font-bold text-primary">
            {weeklyAverage}%
          </p>
        </div>
      </div>

      {/* ================= CHART ================= */}

      <div className="mt-6">
        <div className="relative">
          {/* Y-axis labels */}

          <div className="absolute bottom-8 left-0 top-0 flex w-8 flex-col justify-between text-[10px] font-medium text-base-content/40">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          {/* Chart */}

          <div className="ml-9">
            <div className="relative flex h-64 items-end gap-2 border-b border-base-300 sm:gap-4">
              {/* Grid lines */}

              <div className="pointer-events-none absolute inset-x-0 top-0 flex h-52 flex-col justify-between">
                {[100, 75, 50, 25, 0].map((value) => (
                  <div
                    key={value}
                    className="border-t border-dashed border-base-300/70"
                  />
                ))}
              </div>

              {/* Bars */}

              {data.daily.map((day) => {
                const percentage = getPercentage(day.overall);

                return (
                  <div
                    key={day.date}
                    className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                  >
                    {/* Percentage */}

                    <span className="mb-1 rounded-md bg-base-content px-1.5 py-0.5 text-[10px] font-semibold text-base-100 opacity-0 transition-opacity group-hover:opacity-100">
                      {percentage}%
                    </span>

                    {/* Bar */}

                    <div className="relative flex h-52 w-full max-w-12 items-end overflow-hidden rounded-t-lg bg-base-200">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          percentage === 100
                            ? "bg-success"
                            : percentage > 0
                              ? "bg-primary"
                              : "bg-base-300"
                        }`}
                        style={{
                          height: `${percentage}%`,
                        }}
                      />
                    </div>

                    {/* Day */}

                    <span className="mt-2 text-[10px] font-medium text-base-content/50 sm:text-xs">
                      {formatDay(day.date)}
                    </span>

                    {/* Tooltip */}

                    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-8 hidden w-40 -translate-x-1/2 rounded-xl border border-base-300 bg-base-100 p-3 text-center shadow-xl group-hover:block">
                      <p className="text-xs font-semibold text-base-content">
                        {formatDate(day.date)}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-primary">
                        {percentage}% completed
                      </p>

                      <p className="mt-1 text-[11px] text-base-content/50">
                        {day.completed} of {day.expected} habits
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Average */}

        <div className="rounded-xl bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
              Weekly Average
            </p>

            <span className="text-sm">📊</span>
          </div>

          <p className="mt-2 text-xl font-bold text-primary">
            {weeklyAverage}%
          </p>

          <p className="mt-1 text-xs text-base-content/50">
            Average daily completion
          </p>
        </div>

        {/* Start */}

        <div className="rounded-xl bg-base-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
            Start
          </p>

          <p className="mt-2 text-sm font-semibold text-base-content">
            {formatDate(data.startDate)}
          </p>

          <p className="mt-1 text-xs text-base-content/50">
            Week starting date
          </p>
        </div>

        {/* End */}

        <div className="rounded-xl bg-base-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
            End
          </p>

          <p className="mt-2 text-sm font-semibold text-base-content">
            {formatDate(data.endDate)}
          </p>

          <p className="mt-1 text-xs text-base-content/50">Week ending date</p>
        </div>
      </div>
    </section>
  );
};

export default WeeklyChart;
