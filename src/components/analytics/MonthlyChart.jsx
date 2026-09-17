const MonthlyChart = ({ data }) => {
  if (!data?.daily?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-lg">
          📈
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

  const daily = data.daily;

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

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  const formatFullDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const monthlyAverage = getPercentage(data.overall);

  const completedDays = daily.filter((day) => !isFutureDate(day.date));

  const bestDay = completedDays.reduce((best, current) => {
    return getPercentage(current.overall) > getPercentage(best?.overall)
      ? current
      : best;
  }, completedDays[0]);

  const bestDayValue = bestDay ? getPercentage(bestDay.overall) : 0;

  const width = 1000;
  const height = 275;

  const padding = {
    top: 14,
    right: 10,
    bottom: 38,
    left: 42,
  };

  const chartWidth = width - padding.left - padding.right;

  const chartHeight = height - padding.top - padding.bottom;

  const bottomY = padding.top + chartHeight;

  const points = daily.map((day, index) => {
    const future = isFutureDate(day.date);

    const value = future ? null : getPercentage(day.overall);

    const x =
      padding.left + (index / Math.max(daily.length - 1, 1)) * chartWidth;

    const y =
      value === null
        ? bottomY
        : padding.top + ((100 - value) / 100) * chartHeight;

    return {
      x,
      y,
      value,
      date: day.date,
      future,
    };
  });

  const progressPoints = points.filter((point) => !point.future);

  const createSmoothPath = (items) => {
    if (!items.length) return "";

    if (items.length === 1) {
      return `M ${items[0].x} ${items[0].y}`;
    }

    let path = `M ${items[0].x} ${items[0].y}`;

    for (let i = 0; i < items.length - 1; i++) {
      const current = items[i];
      const next = items[i + 1];

      const controlX = (current.x + next.x) / 2;

      path += `
        C
        ${controlX} ${current.y},
        ${controlX} ${next.y},
        ${next.x} ${next.y}
      `;
    }

    return path;
  };

  const linePath = createSmoothPath(progressPoints);

  const areaPath = progressPoints.length
    ? `
      ${linePath}
      L ${progressPoints[progressPoints.length - 1].x} ${bottomY}
      L ${progressPoints[0].x} ${bottomY}
      Z
    `
    : "";

  const labelIndexes = [];

  daily.forEach((_, index) => {
    if (
      index === 0 ||
      index === 4 ||
      index === 9 ||
      index === 14 ||
      index === 19 ||
      index === 24 ||
      index === daily.length - 1
    ) {
      if (!labelIndexes.includes(index)) {
        labelIndexes.push(index);
      }
    }
  });

  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 px-5 pb-4 pt-5 shadow-sm sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base">
            📈
          </div>

          <div>
            <h2 className="text-lg font-semibold leading-tight text-base-content">
              Monthly Progress
            </h2>

            <p className="mt-1 text-xs text-base-content/55 sm:text-sm">
              Daily consistency throughout the month.
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center justify-between lg:justify-end">
          {/* Monthly Average */}

          <div className="px-3 text-center sm:px-5">
            <p className="text-[9px] font-medium text-base-content/50">
              Monthly Average
            </p>

            <p className="mt-1 text-lg font-bold leading-none text-primary sm:text-xl">
              {monthlyAverage}%
            </p>
          </div>

          <div className="h-8 w-px bg-base-300" />

          {/* Best Day */}

          <div className="px-3 text-center sm:px-5">
            <p className="text-[9px] font-medium text-base-content/50">
              Best Day
            </p>

            <p className="mt-1 text-sm font-bold leading-none text-primary">
              {bestDayValue}%
            </p>

            <p className="mt-1 text-[9px] text-base-content/45">
              {bestDay ? formatDate(bestDay.date) : "-"}
            </p>
          </div>

          <div className="hidden h-8 w-px bg-base-300 sm:block" />

          {/* Month */}

          <button
            type="button"
            className="ml-2 hidden h-9 min-w-[105px] items-center justify-between gap-3 rounded-xl border border-base-300 bg-base-100 px-3 text-[11px] font-medium text-base-content transition hover:bg-base-200 sm:flex"
          >
            <span>This Month</span>

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

      <div className="mt-4 w-full overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="relative h-[260px] w-full">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-full w-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* GRID */}

              {[100, 75, 50, 25, 0].map((value) => {
                const y = padding.top + ((100 - value) / 100) * chartHeight;

                return (
                  <g key={value}>
                    <line
                      x1={padding.left}
                      x2={width - padding.right}
                      y1={y}
                      y2={y}
                      className="stroke-base-300/55"
                      strokeDasharray="3 5"
                    />

                    <text
                      x={padding.left - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-base-content/40 text-[10px]"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}

              {/* AREA */}

              {areaPath && <path d={areaPath} className="fill-primary/10" />}

              {/* LINE */}

              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* PAST + TODAY */}

              {progressPoints.map((point) => (
                <circle
                  key={point.date}
                  cx={point.x}
                  cy={point.y}
                  r="3.5"
                  className="fill-primary stroke-base-100"
                  strokeWidth="2"
                />
              ))}

              {/* FUTURE MARKERS */}

              {points
                .filter((point) => point.future)
                .map((point) => (
                  <circle
                    key={`future-${point.date}`}
                    cx={point.x}
                    cy={bottomY}
                    r="2"
                    className="fill-base-content/20"
                  />
                ))}

              {/* X LABELS */}

              {labelIndexes.map((index) => {
                const point = points[index];

                return (
                  <text
                    key={`${point.date}-${index}`}
                    x={point.x}
                    y={height - 10}
                    textAnchor="middle"
                    className={`text-[10px] ${
                      point.future
                        ? "fill-base-content/30"
                        : "fill-base-content/45"
                    }`}
                  >
                    {formatDate(point.date)}
                  </text>
                );
              })}
            </svg>

            <div className="absolute inset-0">
              {points.map((point) => {
                const x = (point.x / width) * 100;

                const y = ((point.future ? bottomY : point.y) / height) * 100;

                return (
                  <div
                    key={`hover-${point.date}`}
                    className="group absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                  >
                    {/* Vertical guide */}

                    {!point.future && (
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[135px] -translate-x-1/2 -translate-y-full border-l border-dashed border-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}

                    {/* Point */}

                    <div
                      className={`absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-base-100 shadow-sm ${
                        point.future ? "bg-base-300" : "bg-primary"
                      } opacity-0 transition-opacity group-hover:opacity-100`}
                    />

                    {/* Tooltip */}

                    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 hidden w-[125px] -translate-x-1/2 rounded-xl border border-base-300 bg-base-100 px-3 py-2.5 shadow-lg group-hover:block">
                      <p className="text-[11px] font-semibold text-base-content">
                        {formatFullDate(point.date)}
                      </p>

                      {point.future ? (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-base-content/25" />

                          <span className="text-[11px] font-medium text-base-content/60">
                            Assigned
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-primary" />

                          <span className="text-[11px] font-medium text-base-content/70">
                            {point.value}% completed
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyChart;
