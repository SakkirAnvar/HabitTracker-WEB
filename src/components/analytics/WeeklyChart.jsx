const WeeklyChart = ({ data }) => {
  if (!data?.daily?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-lg">
          📊
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

  const getLocalDateString = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getLocalDateString();

  const isFutureDate = (date) => date > today;

  const getPercentage = (value) =>
    Math.min(100, Math.max(0, Number(value) || 0));

  const formatDay = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const daily = data.daily;
  const weeklyAverage = getPercentage(data.overall);

  const chartMax = 110;

  const gridValues = [100, 75, 50, 25, 0];

  return (
    <section className="flex h-full w-full flex-col rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
            📊
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold leading-tight text-base-content">
              Weekly Progress
            </h2>

            <p className="mt-1 truncate text-sm text-base-content/55">
              Daily habit completion this week.
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex shrink-0 items-center">
          {/* Average */}

          <div className="hidden px-4 text-center sm:block sm:px-5">
            <p className="text-[10px] font-medium text-base-content/50">
              Weekly Average
            </p>

            <p className="mt-0.5 text-xl font-bold leading-none text-primary">
              {weeklyAverage}%
            </p>
          </div>

          <div className="hidden h-9 w-px bg-base-300 sm:block" />

          {/* Selector */}

          <button
            type="button"
            className="ml-0 flex h-10 min-w-[105px] items-center justify-between gap-3 rounded-xl border border-base-300 bg-base-100 px-3 text-xs font-medium text-base-content transition hover:bg-base-200 sm:ml-3"
          >
            <span>This Week</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-base-content/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-2.5 sm:hidden">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/45">
            Weekly Average
          </p>

          <p className="mt-0.5 text-lg font-bold leading-none text-primary">
            {weeklyAverage}%
          </p>
        </div>

        <span className="text-base">📈</span>
      </div>

      <div className="mt-4 flex flex-1 items-center">
        <div className="w-full">
          <div className="relative h-[285px] w-full">
            <div className="absolute bottom-10 left-0 top-2 w-8">
              {gridValues.map((value) => {
                const top = ((chartMax - value) / chartMax) * 100;

                return (
                  <span
                    key={value}
                    className="absolute right-1 -translate-y-1/2 text-[10px] font-medium text-base-content/40"
                    style={{ top: `${top}%` }}
                  >
                    {value}
                  </span>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-10 right-0 top-0">
              <div className="relative h-full w-full">
                <div className="pointer-events-none absolute inset-x-0 bottom-10 top-2">
                  {gridValues.map((value) => {
                    const top = ((chartMax - value) / chartMax) * 100;

                    return (
                      <div
                        key={value}
                        className="absolute inset-x-0 border-t border-dashed border-base-300/55"
                        style={{ top: `${top}%` }}
                      />
                    );
                  })}
                </div>

                <div className="absolute inset-x-0 bottom-10 top-2 flex items-end justify-between gap-2 px-1 sm:gap-3 sm:px-2">
                  {daily.map((day) => {
                    const future = isFutureDate(day.date);

                    const percentage = future ? 0 : getPercentage(day.overall);

                    return (
                      <div
                        key={day.date}
                        className="group relative flex h-full min-w-0 flex-1 flex-col items-center"
                      >
                        {/* Bar wrapper */}

                        <div className="relative flex h-full w-full items-end justify-center">
                          {/* Actual bar */}

                          {!future && percentage > 0 && (
                            <div
                              className={`w-[68%] max-w-12 rounded-t-xl transition-all duration-500 ${
                                percentage === 100 ? "bg-success" : "bg-primary"
                              }`}
                              style={{
                                height: `${Math.min(
                                  100,
                                  (percentage / chartMax) * 100,
                                )}%`,
                              }}
                            />
                          )}

                          {/* Future */}

                          {future && (
                            <div className="mb-0.5 h-1.5 w-1.5 rounded-full bg-base-content/20" />
                          )}
                        </div>

                        <div className="pointer-events-none absolute bottom-[calc(100%-1rem)] left-1/2 z-30 hidden w-[150px] -translate-x-1/2 rounded-xl border border-base-300 bg-base-100 p-3 shadow-xl group-hover:block">
                          <p className="text-[11px] font-semibold text-base-content">
                            {formatDate(day.date)}
                          </p>

                          {future ? (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-base-content/25" />

                              <span className="text-[11px] font-medium text-base-content/60">
                                Assigned
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary" />

                                <span className="text-[11px] font-medium text-base-content/70">
                                  {percentage}% completed
                                </span>
                              </div>

                              <p className="mt-1 text-[10px] text-base-content/45">
                                {day.completed} of {day.expected} habits
                              </p>
                            </>
                          )}
                        </div>

                        <span
                          className={`absolute -bottom-7 text-[10px] font-medium ${
                            future
                              ? "text-base-content/30"
                              : "text-base-content/50"
                          }`}
                        >
                          {formatDay(day.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="absolute inset-x-0 bottom-10 border-t border-base-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 border-t border-base-300 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-base-content/40">
              Week
            </p>

            <p className="mt-1 text-xs font-medium text-base-content/60">
              {formatDate(data.startDate)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-wide text-base-content/40">
              Through
            </p>

            <p className="mt-1 text-xs font-medium text-base-content/60">
              {formatDate(data.endDate)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklyChart;
