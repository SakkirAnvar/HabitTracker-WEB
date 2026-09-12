const CalendarHeatmap = ({ data }) => {
  if (!data?.calendar?.length) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-center shadow-sm">
        <p className="text-base-content/60">No calendar data available.</p>
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

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Consistency Calendar</h2>

          <p className="text-sm text-base-content/60">
            Track your daily consistency throughout the month.
          </p>
        </div>

        <div className="text-sm font-medium">
          {data.month}/{data.year}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-success" />
          <span>Completed</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-warning" />
          <span>Partial</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-error" />
          <span>Missed</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-base-200" />
          <span>No data</span>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="mt-6 grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-base-content/50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="mt-2 grid grid-cols-7 gap-2">
        {data.calendar.map((day) => {
          const percentage = Number(day.completion) || 0;

          return (
            <div
              key={day.date}
              className={`group relative flex aspect-square min-h-10 items-center justify-center rounded-lg text-sm font-medium transition-transform hover:scale-105 ${getStatusClass(
                day.status,
              )}`}
              title={`${formatDate(day.date)} — ${percentage}%`}
            >
              {new Date(`${day.date}T00:00:00`).getDate()}

              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-40 -translate-x-1/2 rounded-lg bg-base-content p-2 text-center text-xs text-base-100 shadow-lg group-hover:block">
                <p className="font-semibold">{formatDate(day.date)}</p>

                <p className="mt-1">{percentage}% completed</p>

                <p>
                  {day.completed} / {day.expected} habits
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-success/10 p-3">
          <p className="text-xs text-base-content/60">Completed</p>

          <p className="mt-1 text-xl font-bold">{completedDays}</p>
        </div>

        <div className="rounded-lg bg-warning/10 p-3">
          <p className="text-xs text-base-content/60">Partial</p>

          <p className="mt-1 text-xl font-bold">{partialDays}</p>
        </div>

        <div className="rounded-lg bg-error/10 p-3">
          <p className="text-xs text-base-content/60">Missed</p>

          <p className="mt-1 text-xl font-bold">{missedDays}</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeatmap;
