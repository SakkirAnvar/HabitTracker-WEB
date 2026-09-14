const CalendarHeatmap = ({ data }) => {
  if (!data?.calendar?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl">
          📅
        </div>

        <p className="mt-3 text-sm font-medium text-base-content">
          No calendar data available
        </p>

        <p className="mt-1 text-xs text-base-content/50">
          Your consistency data will appear here once you start tracking habits.
        </p>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-content";

      case "partial":
        return "bg-warning text-warning-content";

      case "missed":
        return "bg-error text-error-content";

      default:
        return "bg-base-200 text-base-content/40";
    }
  };

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const completedDays = data.calendar.filter(
    (day) => day.status === "completed",
  ).length;

  const partialDays = data.calendar.filter(
    (day) => day.status === "partial",
  ).length;

  const missedDays = data.calendar.filter(
    (day) => day.status === "missed",
  ).length;

  const totalDays = data.calendar.length;

  const consistencyPercentage =
    totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
            📅
          </div>

          <div>
            <h2 className="text-lg font-semibold text-base-content">
              Consistency Calendar
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              Track your daily consistency throughout the month.
            </p>
          </div>
        </div>

        {/* Month */}

        <div className="self-start rounded-xl bg-base-200 px-3 py-2 text-sm font-semibold text-base-content sm:self-auto">
          {data.month}/{data.year}
        </div>
      </div>

      {/* ================= MONTH SUMMARY ================= */}

      <div className="mt-5 rounded-xl bg-primary/5 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-base-content/45">
              Monthly Consistency
            </p>

            <p className="mt-1 text-sm text-base-content/60">
              {completedDays} of {totalDays} tracked days completed
            </p>
          </div>

          <span className="text-lg font-bold text-primary">
            {consistencyPercentage}%
          </span>
        </div>
      </div>

      {/* ================= LEGEND ================= */}

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
        <LegendItem className="bg-success" label="Completed" />

        <LegendItem className="bg-warning" label="Partial" />

        <LegendItem className="bg-error" label="Missed" />

        <LegendItem className="bg-base-200" label="No data" />
      </div>

      {/* ================= WEEKDAYS ================= */}

      <div className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-base-content/40 sm:text-xs"
          >
            <span className="hidden sm:inline">{day}</span>

            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* ================= CALENDAR ================= */}

      <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
        {data.calendar.map((day) => {
          const percentage = Number(day.completion) || 0;

          const dateNumber = new Date(`${day.date}T00:00:00`).getDate();

          return (
            <div
              key={day.date}
              className={`group relative flex aspect-square min-h-9 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150 hover:z-20 hover:scale-105 sm:min-h-10 sm:text-sm ${getStatusClass(
                day.status,
              )}`}
              title={`${formatDate(day.date)} — ${percentage}%`}
            >
              {dateNumber}

              {/* Tooltip */}

              <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-44 -translate-x-1/2 rounded-xl border border-base-300 bg-base-100 p-3 text-left shadow-xl group-hover:block">
                <p className="text-xs font-semibold text-base-content">
                  {formatDate(day.date)}
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-base-content/50">
                    Completion
                  </span>

                  <span className="text-xs font-bold text-primary">
                    {percentage}%
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <span className="text-xs text-base-content/50">Habits</span>

                  <span className="text-xs font-medium text-base-content">
                    {day.completed} / {day.expected}
                  </span>
                </div>

                <div className="mt-2 border-t border-base-300 pt-2 text-[11px] capitalize text-base-content/50">
                  {day.status || "No data"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        <SummaryCard
          label="Completed"
          value={completedDays}
          wrapperClass="bg-success/10"
          valueClass="text-success"
        />

        <SummaryCard
          label="Partial"
          value={partialDays}
          wrapperClass="bg-warning/10"
          valueClass="text-warning"
        />

        <SummaryCard
          label="Missed"
          value={missedDays}
          wrapperClass="bg-error/10"
          valueClass="text-error"
        />
      </div>
    </section>
  );
};

/* =========================================================
   LEGEND ITEM
========================================================= */

const LegendItem = ({ className, label }) => {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-sm ${className}`} />

      <span className="text-xs text-base-content/60">{label}</span>
    </div>
  );
};

/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({ label, value, wrapperClass, valueClass }) => {
  return (
    <div className={`rounded-xl p-3 sm:p-4 ${wrapperClass}`}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/50">
        {label}
      </p>

      <p className={`mt-1 text-xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
};

export default CalendarHeatmap;
