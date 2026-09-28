import { useState } from "react";
import DatePicker from "../../layout/DatePicker";

const WeeklyChart = ({
  data,
  selectedWeek,
  onWeekChange,
  maxDate,
  error,
  loading = false,
}) => {
  const [openPicker, setOpenPicker] = useState(false);

  if (!data?.daily?.length) {
    return (
      <section className="min-h-[400px] rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base">
            📊
          </div>

          <div>
            <h2 className="text-base font-semibold text-base-content">
              Weekly Progress
            </h2>
            <p className="mt-0.5 text-xs text-base-content/50">
              Daily completion this week.
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-xs font-medium text-error">
            {typeof error === "string"
              ? error
              : error?.message || "Unable to load weekly progress."}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-base-content/60">
              No weekly data available yet.
            </p>
            <p className="mt-1 text-xs text-base-content/40">
              Keep tracking your habits to see progress here.
            </p>
          </div>
        )}
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
  const getPercentage = (value) =>
    Math.min(100, Math.max(0, Number(value) || 0));

  const formatDay = (date) =>
    date
      ? new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
          weekday: "short",
        })
      : "-";

  const formatDate = (date) =>
    date
      ? new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "-";

  const daily = data.daily;
  const weeklyAverage = getPercentage(data.overall);
  const gridValues = [100, 50, 0];
  const chartMax = 100;

  return (
    <section
      className={`relative flex min-h-[400px] w-full flex-col rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-opacity sm:p-6 ${
        loading ? "opacity-60" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base">
            📊
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-base font-semibold text-base-content">
                Weekly Progress
              </h2>

              <span className="hidden rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary sm:inline">
                {weeklyAverage}%
              </span>
            </div>

            <p className="mt-0.5 text-xs text-base-content/50">
              Daily completion this week.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <DatePicker
            value={selectedWeek}
            max={maxDate}
            placeholder="Select week"
            isOpen={openPicker}
            onOpen={() => setOpenPicker(true)}
            onClose={() => setOpenPicker(false)}
            onChange={(value) => {
              if (!value) return;

              const selected = new Date(`${value}T00:00:00`);
              if (Number.isNaN(selected.getTime())) {
                setOpenPicker(false);
                return;
              }

              const max = maxDate
                ? new Date(`${maxDate}T00:00:00`)
                : null;

              if (max && !Number.isNaN(max.getTime()) && selected > max) {
                setOpenPicker(false);
                return;
              }

              const day = selected.getDay();
              const difference = day === 0 ? -6 : 1 - day;
              selected.setDate(selected.getDate() + difference);

              const year = selected.getFullYear();
              const month = String(selected.getMonth() + 1).padStart(2, "0");
              const date = String(selected.getDate()).padStart(2, "0");

              onWeekChange(`${year}-${month}-${date}`);
              setOpenPicker(false);
            }}
            align="right"
            buttonClassName="h-9 w-[138px] rounded-xl px-3 text-[11px] font-medium"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-error/20 bg-error/10 px-3 py-2.5 text-xs font-medium text-error">
          {typeof error === "string"
            ? error
            : error?.message || "Unable to load weekly progress."}
        </div>
      )}

      {/* Chart */}
      <div className="mt-5 flex min-h-0 flex-1 items-center">
        <div className="relative h-[245px] w-full">
          <div className="absolute bottom-8 left-0 top-2 w-7">
            {gridValues.map((value) => (
              <span
                key={value}
                className="absolute right-1 -translate-y-1/2 text-[9px] font-medium text-base-content/35"
                style={{ top: `${100 - value}%` }}
              >
                {value}
              </span>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 left-8 top-0">
            <div className="pointer-events-none absolute inset-x-0 bottom-8 top-2">
              {gridValues.map((value) => (
                <div
                  key={value}
                  className="absolute inset-x-0 border-t border-dashed border-base-300/50"
                  style={{ top: `${100 - value}%` }}
                />
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-8 top-2 flex items-end justify-between gap-2">
              {daily.map((day) => {
                const future = isFutureDate(day.date);
                const percentage = future ? 0 : getPercentage(day.overall);

                return (
                  <div
                    key={day.date}
                    className="group relative flex h-full min-w-0 flex-1 flex-col items-center"
                  >
                    <div className="relative flex h-full w-full items-end justify-center">
                      {!future && percentage > 0 && (
                        <div
                          className={`w-[58%] max-w-10 rounded-t-lg transition-all duration-500 ${
                            percentage === 100 ? "bg-success" : "bg-primary"
                          }`}
                          style={{
                            height: `${Math.max(
                              3,
                              (percentage / chartMax) * 100,
                            )}%`,
                          }}
                        />
                      )}

                      {future && (
                        <span className="mb-1 h-1.5 w-1.5 rounded-full bg-base-content/20" />
                      )}
                    </div>

                    <div className="pointer-events-none absolute bottom-[calc(100%-0.75rem)] left-1/2 z-30 hidden w-[140px] -translate-x-1/2 rounded-xl border border-base-300 bg-base-100 px-3 py-2.5 shadow-lg group-hover:block">
                      <p className="text-[10px] font-semibold text-base-content">
                        {formatDate(day.date)}
                      </p>

                      <p className="mt-1.5 text-[10px] text-base-content/55">
                        {future
                          ? "Upcoming day"
                          : `${percentage}% completed`}
                      </p>

                      {!future && (
                        <p className="mt-0.5 text-[10px] text-base-content/40">
                          {day.completed} of {day.expected} habits
                        </p>
                      )}
                    </div>

                    <span
                      className={`absolute -bottom-6 text-[9px] font-medium ${
                        future
                          ? "text-base-content/25"
                          : "text-base-content/45"
                      }`}
                    >
                      {formatDay(day.date)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="absolute inset-x-0 bottom-8 border-t border-base-300" />
          </div>
        </div>
      </div>

      {/* Compact footer */}
      <div className="mt-3 flex items-center justify-between border-t border-base-300 pt-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-base-content/35">
            Week
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-base-content/55">
            {formatDate(data.startDate)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-base-content/35">
            Through
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-base-content/55">
            {formatDate(data.endDate)}
          </p>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-base-100/45 backdrop-blur-[1px]">
          <div className="rounded-full border border-base-300 bg-base-100 px-3 py-2 text-[10px] font-medium text-base-content/50 shadow-sm">
            Updating…
          </div>
        </div>
      )}
    </section>
  );
};

export default WeeklyChart;
