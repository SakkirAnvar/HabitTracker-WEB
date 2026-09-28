import { useState } from "react";
import MonthPicker from "../../layout/MonthPicker";

const CalendarHeatmap = ({
  data,
  selectedMonth,
  onMonthChange,
  maxMonth,
  loading = false,
}) => {
  const [openPicker, setOpenPicker] = useState(false);

  if (!data?.calendar?.length) {
    return (
      <section className="min-h-[400px] rounded-2xl border border-base-300 bg-base-100 p-5 text-center shadow-sm sm:p-6">
        <div className="flex items-center gap-3 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-base">
            📅
          </div>
          <div>
            <h2 className="text-base font-semibold text-base-content">
              Consistency Calendar
            </h2>
            <p className="mt-0.5 text-xs text-base-content/50">
              Your habit activity across the month.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-sm font-medium text-base-content/60">
            No calendar data available yet.
          </p>
          <p className="mt-1 text-xs text-base-content/40">
            Start tracking habits to see your consistency.
          </p>
        </div>
      </section>
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

  const getDateNumber = (date) =>
    new Date(`${date}T00:00:00`).getDate();

  const formatDate = (date) =>
    date
      ? new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "-";

  const getDayStatus = (day) =>
    isFutureDate(day.date) ? "assigned" : day.status || "nodata";

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-primary text-primary-content";
      case "partial":
        return "bg-secondary/55 text-base-content";
      case "missed":
        return "bg-error/10 text-error";
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
    (day) => !isFutureDate(day.date) && Number(day.expected) > 0,
  ).length;

  const assignedDays = data.calendar.filter((day) =>
    isFutureDate(day.date),
  ).length;

  const consistencyPercentage =
    trackedDays > 0
      ? Math.round((completedDays / trackedDays) * 100)
      : 0;

  const firstDate = data.calendar[0]?.date;
  const firstDayIndex = firstDate
    ? new Date(`${firstDate}T00:00:00`).getDay()
    : 0;

  const emptyDays = Array.from(
    { length: firstDayIndex },
    (_, index) => `empty-${index}`,
  );

  return (
    <section
      className={`relative min-h-[400px] rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-opacity sm:p-6 ${
        loading ? "opacity-60" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base">
            📅
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-base-content">
              Consistency Calendar
            </h2>
            <p className="mt-0.5 text-xs text-base-content/50">
              Your habit activity across the month.
            </p>
          </div>
        </div>

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

      {/* Compact summary */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-base-200/35 px-3.5 py-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-base-content/35">
            Monthly consistency
          </p>

          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {consistencyPercentage}%
            </span>
            <span className="text-[10px] text-base-content/45">
              {completedDays} of {trackedDays} active days
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-base-content/35">
            Upcoming
          </p>
          <p className="mt-0.5 text-sm font-semibold text-base-content/60">
            {assignedDays}
          </p>
        </div>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-base-300">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${consistencyPercentage}%` }}
        />
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2">
        <LegendItem dot="bg-primary" label="Completed" />
        <LegendItem dot="bg-secondary" label="Partial" />
        <LegendItem dot="border border-error/20 bg-error/10" label="Missed" />
        <LegendItem
          dot="border border-base-300 bg-base-200"
          label="Upcoming"
        />
      </div>

      {/* Calendar */}
      <div className="mt-4 rounded-2xl border border-base-300/80 p-3 sm:p-4">
        <div className="grid grid-cols-7 gap-1.5">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="pb-0.5 text-center text-[9px] font-semibold text-base-content/30"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="mt-1.5 grid grid-cols-7 gap-1.5">
          {emptyDays.map((day) => (
            <div key={day} className="h-9 sm:h-10" />
          ))}

          {data.calendar.map((day) => {
            const future = isFutureDate(day.date);
            const status = getDayStatus(day);
            const percentage = Number(day.completion) || 0;

            return (
              <div key={day.date} className="group relative h-9 sm:h-10">
                <div
                  className={`flex h-full w-full items-center justify-center rounded-lg text-[10px] font-semibold transition-all duration-150 hover:z-20 hover:scale-[1.03] sm:text-[11px] ${getStatusClass(
                    status,
                  )}`}
                >
                  {getDateNumber(day.date)}
                </div>

                <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-36 -translate-x-1/2 rounded-xl border border-base-300 bg-base-100 p-2.5 shadow-xl group-hover:block">
                  <p className="text-[10px] font-semibold text-base-content">
                    {formatDate(day.date)}
                  </p>

                  {future ? (
                    <p className="mt-1.5 text-[10px] text-base-content/50">
                      Upcoming day
                    </p>
                  ) : (
                    <>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-base-content/45">
                          Completion
                        </span>
                        <span className="text-[10px] font-semibold text-primary">
                          {percentage}%
                        </span>
                      </div>

                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-base-content/45">
                          Habits
                        </span>
                        <span className="text-[10px] font-medium text-base-content">
                          {day.completed} / {day.expected}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-base-300 pt-2.5 text-[9px] text-base-content/35">
          <span>Tap or hover a day for details</span>
          <span className="font-semibold text-primary">Today</span>
        </div>
      </div>

      {/* Footer stats */}
      <div className="mt-3 grid grid-cols-3 divide-x divide-base-300 border-t border-base-300 pt-3">
        <Stat label="Completed" value={completedDays} valueClass="text-primary" />
        <Stat label="Partial" value={partialDays} valueClass="text-secondary" />
        <Stat label="Missed" value={missedDays} valueClass="text-error" />
      </div>

      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-base-100/45 backdrop-blur-[1px]">
        </div>
      )}
    </section>
  );
};

const LegendItem = ({ dot, label }) => (
  <div className="flex items-center gap-1.5 rounded-full border border-base-300 px-2 py-1">
    <span className={`h-2 w-2 rounded-full ${dot}`} />
    <span className="text-[9px] font-medium text-base-content/50">
      {label}
    </span>
  </div>
);

const Stat = ({ label, value, valueClass }) => (
  <div className="px-2 first:pl-0 last:pr-0">
    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-base-content/35">
      {label}
    </p>
    <p className={`mt-0.5 text-base font-bold ${valueClass}`}>{value}</p>
  </div>
);

export default CalendarHeatmap;
