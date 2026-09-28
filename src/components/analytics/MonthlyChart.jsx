import { useState } from "react";
import MonthPicker from "../../layout/MonthPicker";

const MonthlyChart = ({
  data,
  selectedMonth,
  onMonthChange,
  maxMonth,
  loading = false,
  error,
}) => {
  const [openPicker, setOpenPicker] = useState(false);
  if (!data?.daily?.length) {
    return (
      <section className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-lg">
          📈
        </div>

        <h2 className="mt-3 text-lg font-semibold text-base-content">
          Monthly Progress
        </h2>

        {error ? (
          <div
            role="alert"
            className="mx-auto mt-4 max-w-md rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error"
          >
            {typeof error === "string"
              ? error
              : error?.message || "Unable to load monthly progress."}
          </div>
        ) : (
          <>
            <p className="mt-1 text-sm text-base-content/60">
              No monthly analytics available yet.
            </p>

            <p className="mt-1 text-xs text-base-content/45">
              Keep tracking your habits to see your progress here.
            </p>
          </>
        )}
      </section>
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

  const elapsedDays = daily.filter((day) => !isFutureDate(day.date));

  const hasTrackedData = (day) => {
    if (!Array.isArray(day?.habits)) {
      return Number(day?.completed) > 0;
    }

    return day.habits.some(
      (habit) =>
        habit?.completed === true ||
        Number(habit?.value) > 0 ||
        Number(habit?.completion) > 0,
    );
  };

  const trackedDays = elapsedDays.filter(hasTrackedData);

  const bestDay = trackedDays.reduce((best, current) => {
    return getPercentage(current.overall) > getPercentage(best?.overall)
      ? current
      : best;
  }, trackedDays[0]);

  const bestDayValue = bestDay ? getPercentage(bestDay.overall) : 0;
  const trackedDayCount = trackedDays.length;

  const width = 1000;
  const height = 330;

  const padding = {
    top: 24,
    right: 28,
    bottom: 48,
    left: 54,
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
    <div className="relative w-full">
      <section
        className={`rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm transition-opacity duration-200 sm:p-6 lg:p-7 ${
          loading ? "opacity-60" : "opacity-100"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg">
              📈
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-base-content sm:text-xl">
                Monthly Progress
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-5 text-base-content/55">
                See how consistently your habits are progressing throughout the
                month.
              </p>
            </div>
          </div>

          <div className="self-start">
            <MonthPicker
              value={selectedMonth}
              maxMonth={maxMonth}
              placeholder="Select month"
              isOpen={openPicker}
              onOpen={() => setOpenPicker(true)}
              onClose={() => setOpenPicker(false)}
              onChange={(month) => {
                onMonthChange(month);
                setOpenPicker(false);
              }}
              align="right"
              buttonClassName="h-10 w-[150px] rounded-xl px-3 text-[11px] font-medium"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error"
          >
            {typeof error === "string"
              ? error
              : error?.message || "Unable to load monthly progress."}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-base-300 bg-base-200/35 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-base-content/45">
                Monthly Average
              </p>
              <span className="h-2 w-2 rounded-full bg-primary" />
            </div>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-bold tracking-tight text-primary">
                {monthlyAverage}%
              </span>
              <span className="pb-1 text-xs text-base-content/45">
                consistency
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-200/35 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-base-content/45">
                Best Day
              </p>
              <span className="h-2 w-2 rounded-full bg-secondary" />
            </div>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-bold tracking-tight text-base-content">
                {bestDayValue}%
              </span>
              <span className="pb-1 text-xs text-base-content/45">
                {bestDay ? formatDate(bestDay.date) : "-"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-200/35 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-base-content/45">
                Days Tracked
              </p>
              <span className="h-2 w-2 rounded-full bg-secondary/70" />
            </div>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-bold tracking-tight text-base-content">
                {trackedDayCount}
              </span>
              <span className="pb-1 text-xs text-base-content/45">
                recorded days
              </span>
            </div>
          </div>
        </div>

        {/* Chart panel */}
        <div className="mt-6 rounded-2xl border border-base-300 bg-base-200/20 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-3">
            <div>
              <p className="text-xs font-semibold text-base-content/70">
                Daily consistency
              </p>
              <p className="mt-0.5 text-[11px] text-base-content/40">
                Completed habits as a percentage of your daily target.
              </p>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-medium text-base-content/45">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Tracked
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-base-content/20" />
                Upcoming
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[720px] px-1 pb-1">
              <div className="relative h-[300px] w-full sm:h-[320px]">
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="h-full w-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="monthlyAreaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="currentColor"
                        className="text-primary"
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor="currentColor"
                        className="text-primary"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid */}
                  {[100, 75, 50, 25, 0].map((value) => {
                    const y = padding.top + ((100 - value) / 100) * chartHeight;

                    return (
                      <g key={value}>
                        <line
                          x1={padding.left}
                          x2={width - padding.right}
                          y1={y}
                          y2={y}
                          className="stroke-base-300/60"
                          strokeDasharray="2 6"
                        />

                        <text
                          x={padding.left - 12}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-base-content/35 text-[10px]"
                        >
                          {value}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Area */}
                  {areaPath && (
                    <path d={areaPath} fill="url(#monthlyAreaGradient)" />
                  )}

                  {/* Line */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      className="stroke-primary"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Data points */}
                  {progressPoints.map((point) => (
                    <circle
                      key={point.date}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      className="fill-primary stroke-base-100"
                      strokeWidth="2.5"
                    />
                  ))}

                  {/* Future markers */}
                  {points
                    .filter((point) => point.future)
                    .map((point) => (
                      <circle
                        key={`future-${point.date}`}
                        cx={point.x}
                        cy={bottomY}
                        r="2.5"
                        className="fill-base-content/20"
                      />
                    ))}

                  {/* X labels */}
                  {labelIndexes.map((index) => {
                    const point = points[index];

                    return (
                      <text
                        key={`${point.date}-${index}`}
                        x={point.x}
                        y={height - 12}
                        textAnchor="middle"
                        className={`text-[10px] ${
                          point.future
                            ? "fill-base-content/25"
                            : "fill-base-content/45"
                        }`}
                      >
                        {formatDate(point.date)}
                      </text>
                    );
                  })}
                </svg>

                {/* Hover layer */}
                <div className="absolute inset-0">
                  {points.map((point) => {
                    const x = (point.x / width) * 100;
                    const y =
                      ((point.future ? bottomY : point.y) / height) * 100;

                    return (
                      <div
                        key={`hover-${point.date}`}
                        className="group absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                        }}
                      >
                        {!point.future && (
                          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[165px] -translate-x-1/2 -translate-y-full border-l border-dashed border-primary/20 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                        )}

                        <div
                          className={`absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-base-100 shadow-sm transition-all duration-150 group-hover:scale-110 ${
                            point.future ? "bg-base-300" : "bg-primary"
                          }`}
                        />

                        <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 hidden w-[150px] -translate-x-1/2 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl group-hover:block">
                          <p className="text-xs font-semibold text-base-content">
                            {formatFullDate(point.date)}
                          </p>

                          {point.future ? (
                            <div className="mt-2">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-2 py-1 text-[10px] font-semibold text-base-content/55">
                                <span className="h-1.5 w-1.5 rounded-full bg-base-content/25" />
                                Upcoming
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="mt-2 flex items-end justify-between gap-3">
                                <span className="text-[11px] text-base-content/45">
                                  Completion
                                </span>
                                <span className="text-sm font-bold text-primary">
                                  {point.value}%
                                </span>
                              </div>

                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-base-200">
                                <div
                                  className="h-full rounded-full bg-primary transition-all"
                                  style={{ width: `${point.value}%` }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-base-100/45 backdrop-blur-[1px]"></div>
      )}
    </div>
  );
};

export default MonthlyChart;
