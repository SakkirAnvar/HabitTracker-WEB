const CalendarHeatmap = ({
  data,
  selectedMonth,
  onMonthChange,
  maxMonth,
  loading = false,
}) => {
  if (!data?.calendar?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-lg">
          📅
        </div>

        <h2 className="mt-3 text-lg font-semibold text-base-content">
          Consistency Calendar
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          No calendar data available yet.
        </p>

        <p className="mt-1 text-xs text-base-content/45">
          Start tracking your habits to see your consistency here.
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

  const getDateNumber = (date) => {
    return new Date(`${date}T00:00:00`).getDate();
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDayStatus = (day) => {
    if (isFutureDate(day.date)) {
      return "assigned";
    }

    return day.status || "nodata";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-primary text-primary-content";

      case "partial":
        return "bg-secondary/55 text-base-content";

      case "missed":
        return "bg-error/15 text-error";

      case "assigned":
        return "border border-base-300 bg-base-200 text-base-content/35";

      default:
        return "bg-base-200 text-base-content/30";
    }
  };

  const completedDays = data.calendar.filter(
    (day) => !isFutureDate(day.date) && day.status === "completed",
  ).length;

  const partialDays = data.calendar.filter(
    (day) => !isFutureDate(day.date) && day.status === "partial",
  ).length;

  const missedDays = data.calendar.filter(
    (day) => !isFutureDate(day.date) && day.status === "missed",
  ).length;

  const trackedDays = data.calendar.filter(
    (day) => !isFutureDate(day.date),
  ).length;

  const assignedDays = data.calendar.filter((day) =>
    isFutureDate(day.date),
  ).length;

  const consistencyPercentage =
    trackedDays > 0 ? Math.round((completedDays / trackedDays) * 100) : 0;

  const firstDate = data.calendar[0]?.date;

  const firstDayIndex = firstDate
    ? new Date(`${firstDate}T00:00:00`).getDay()
    : 0;

  const emptyDays = Array.from(
    { length: firstDayIndex },
    (_, index) => `empty-${index}`,
  );

  return (
    <div className="relative w-full">
      <section
        className={`w-full rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-opacity duration-200 sm:p-5 ${
          loading ? "opacity-60" : "opacity-100"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
              📅
            </div>

            <div>
              <h2 className="text-lg font-semibold leading-tight text-base-content">
                Consistency Calendar
              </h2>

              <p className="mt-1 text-sm text-base-content/55">
                Your daily consistency at a glance.
              </p>
            </div>
          </div>

          {/* Month */}
          <label className="flex h-9 shrink-0 items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 transition hover:bg-base-200">
            <input
              type="month"
              value={selectedMonth}
              max={maxMonth}
              onChange={(e) => {
                if (e.target.value) {
                  onMonthChange(e.target.value);
                }
              }}
              className="w-[120px] bg-transparent text-xs font-medium text-base-content outline-none"
            />
          </label>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/45">
              Monthly Consistency
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {consistencyPercentage}%
              </span>

              <span className="text-xs text-base-content/45">
                {completedDays} of {trackedDays} days
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-base-content/45">
              {assignedDays} upcoming
            </p>
          </div>
        </div>

        {/* Progress */}

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-base-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${consistencyPercentage}%`,
            }}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          <LegendItem className="bg-primary" label="Completed" />

          <LegendItem className="bg-secondary/55" label="Partial" />

          <LegendItem
            className="bg-error/15 border border-error/20"
            label="Missed"
          />

          <LegendItem
            className="bg-base-200 border border-base-300"
            label="Assigned"
          />
        </div>

        <div className="mt-6 grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="pb-1 text-center text-[10px] font-semibold text-base-content/35"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {emptyDays.map((day) => (
            <div key={day} className="aspect-square" />
          ))}

          {data.calendar.map((day) => {
            const future = isFutureDate(day.date);
            const status = getDayStatus(day);
            const percentage = Number(day.completion) || 0;

            const tooltipStatus = future
              ? "Assigned"
              : status === "nodata"
                ? "No data"
                : status.charAt(0).toUpperCase() + status.slice(1);

            return (
              <div key={day.date} className="group relative aspect-square">
                {/* Calendar Cell */}

                <div
                  className={`flex h-full w-full items-center justify-center rounded-lg text-[11px] font-semibold transition-all duration-150 hover:z-20 hover:scale-105 sm:text-xs ${getStatusClass(
                    status,
                  )}`}
                >
                  {getDateNumber(day.date)}
                </div>

                <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-40 -translate-x-1/2 rounded-xl border border-base-300 bg-base-100 p-3 shadow-xl group-hover:block">
                  <p className="text-xs font-semibold text-base-content">
                    {formatDate(day.date)}
                  </p>

                  {future ? (
                    <>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-base-content/30" />

                        <span className="text-xs font-medium text-base-content/60">
                          Assigned
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] text-base-content/40">
                        Upcoming day
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-base-content/50">
                          Completion
                        </span>

                        <span className="text-xs font-bold text-primary">
                          {percentage}%
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs text-base-content/50">
                          Habits
                        </span>

                        <span className="text-xs font-medium text-base-content">
                          {day.completed} / {day.expected}
                        </span>
                      </div>

                      <div className="mt-2 border-t border-base-300 pt-2 text-[10px] text-base-content/45">
                        {tooltipStatus}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-base-300 border-t border-base-300 pt-4">
          <div className="pr-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-base-content/40">
              Completed
            </p>

            <p className="mt-1 text-lg font-bold text-primary">
              {completedDays}
            </p>
          </div>

          <div className="px-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-base-content/40">
              Partial
            </p>

            <p className="mt-1 text-lg font-bold text-secondary">
              {partialDays}
            </p>
          </div>

          <div className="pl-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-base-content/40">
              Missed
            </p>

            <p className="mt-1 text-lg font-bold text-error">{missedDays}</p>
          </div>
        </div>
      </section>
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-base-100/45 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-2 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-pulse" />
              <span
                className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-pulse"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-pulse"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LegendItem = ({ className, label }) => {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-sm ${className}`} />

      <span className="text-[10px] font-medium text-base-content/55">
        {label}
      </span>
    </div>
  );
};

export default CalendarHeatmap;
