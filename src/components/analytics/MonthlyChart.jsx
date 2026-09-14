const MonthlyChart = ({ data }) => {
  if (!data?.daily?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl">
          📊
        </div>

        <h2 className="mt-3 text-lg font-semibold text-base-content">
          Monthly Progress
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          No monthly analytics available yet.
        </p>

        <p className="mt-1 text-xs text-base-content/45">
          Keep tracking your habits to see your progress here.
        </p>
      </div>
    );
  }

  const formatDay = (date) => {
    return new Date(`${date}T00:00:00`).getDate();
  };

  const formatFullDate = (date) => {
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

  const monthlyAverage = getPercentage(data.overall);

  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
            📊
          </div>

          <div>
            <h2 className="text-lg font-semibold text-base-content">
              Monthly Progress
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              Daily consistency throughout the month.
            </p>
          </div>
        </div>

        {/* Average */}

        <div className="rounded-xl bg-primary/10 px-4 py-2.5 sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/50">
            Monthly Average
          </p>

          <p className="mt-0.5 text-xl font-bold text-primary">
            {monthlyAverage}%
          </p>
        </div>
      </div>

      {/* ================= CHART ================= */}

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="min-w-[700px]">
          <div className="flex">
            {/* Y Axis */}

            <div className="flex w-10 shrink-0 flex-col justify-between pb-7 text-[10px] font-medium text-base-content/40">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            {/* Chart area */}

            <div className="relative flex h-64 flex-1 items-end border-b border-base-300">
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

              <div className="relative z-10 flex h-full w-full items-end gap-1">
                {data.daily.map((day) => {
                  const percentage = getPercentage(day.overall);

                  return (
                    <div
                      key={day.date}
                      className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                    >
                      {/* Hover percentage */}

                      <div className="mb-1 rounded-md bg-base-content px-1.5 py-0.5 text-[10px] font-semibold text-base-100 opacity-0 transition-opacity group-hover:opacity-100">
                        {percentage}%
                      </div>

                      {/* Bar */}

                      <div className="flex h-52 w-full max-w-7 items-end overflow-hidden rounded-t-lg bg-base-200">
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

                      {/* Date */}

                      <span className="mt-2 text-[10px] font-medium text-base-content/50">
                        {formatDay(day.date)}
                      </span>

                      {/* Tooltip */}

                      <div className="pointer-events-none absolute bottom-full z-30 mb-8 hidden w-36 rounded-xl border border-base-300 bg-base-100 p-3 text-center shadow-xl group-hover:block">
                        <p className="text-xs font-semibold text-base-content">
                          {formatFullDate(day.date)}
                        </p>

                        <p className="mt-1 text-xs text-primary">
                          {percentage}% completed
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Monthly Average */}

        <div className="rounded-xl bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
              Monthly Average
            </p>

            <span className="text-sm">📈</span>
          </div>

          <p className="mt-2 text-xl font-bold text-primary">
            {monthlyAverage}%
          </p>

          <p className="mt-1 text-xs text-base-content/50">
            Average daily completion
          </p>
        </div>

        {/* Start Date */}

        <div className="rounded-xl bg-base-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
            Start Date
          </p>

          <p className="mt-2 text-sm font-semibold text-base-content">
            {formatFullDate(data.startDate)}
          </p>

          <p className="mt-1 text-xs text-base-content/50">
            Analytics period start
          </p>
        </div>

        {/* End Date */}

        <div className="rounded-xl bg-base-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
            End Date
          </p>

          <p className="mt-2 text-sm font-semibold text-base-content">
            {formatFullDate(data.endDate)}
          </p>

          <p className="mt-1 text-xs text-base-content/50">
            Analytics period end
          </p>
        </div>
      </div>
    </section>
  );
};

export default MonthlyChart;
