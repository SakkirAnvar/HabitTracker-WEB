import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getLocalDateString } from "../../utils/date";
import { addHabitLog, editHabitLog } from "../../redux/habitLogSlice";

const HabitProgress = ({
  habit,
  existingLog,
  onSuccess,
  isArchived = false,
}) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState(existingLog?.value ?? "");
  const [loading, setLoading] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [error, setError] = useState("");

  const habitType = habit?.type || "boolean";

  const isBoolean = habitType === "boolean";
  const isNumeric = habitType === "numeric" || habitType === "count";
  const isDuration = habitType === "duration";
  const isRating = habitType === "rating";

  const isScheduledToday = isHabitScheduledToday(habit);

  const isCompleted = getIsCompleted(habit, value, existingLog);

  const saveProgress = async (newValue) => {
    if (loading) return;

    if (!isScheduledToday) {
      setSaveState("error");
      setError("This habit is not scheduled for today.");
      return;
    }

    if (isArchived) {
      setSaveState("error");
      setError("Archived habits cannot be updated.");
      return;
    }

    setError("");

    const existingValue = existingLog?.value ?? "";

    if (existingLog?._id && String(existingValue) === String(newValue)) {
      setSaveState("idle");
      return;
    }

    setLoading(true);
    setSaveState("saving");

    const date = getLocalDateString();

    try {
      if (existingLog?._id) {
        await dispatch(
          editHabitLog({
            id: existingLog._id,
            data: {
              value: newValue,
              date,
            },
          }),
        ).unwrap();
      } else {
        await dispatch(
          addHabitLog({
            habitId: habit._id,
            data: {
              value: newValue,
              date,
            },
          }),
        ).unwrap();
      }

      setValue(newValue);
      setSaveState("saved");
      setError("");

      onSuccess?.();
    } catch (err) {
      console.error("Habit progress error:", err);

      setSaveState("error");

      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to save progress.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (isCompleted || loading) return;

    await saveProgress(1);
  };

  const handleValueChange = (newValue) => {
    setValue(newValue);
    setError("");
    setSaveState("idle");
  };

  const handleNumberBlur = async () => {
    if (value === "" || value === null || value === undefined) {
      return;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      setSaveState("error");
      setError("Please enter a valid value.");
      return;
    }

    if (numericValue < 0) {
      setSaveState("error");
      setError("Value cannot be negative.");
      return;
    }

    await saveProgress(numericValue);
  };

  const handleNumberKeyDown = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    e.currentTarget.blur();
  };

  const handleRatingChange = async (rating) => {
    if (loading) return;

    setValue(rating);
    setError("");
    setSaveState("idle");

    await saveProgress(Number(rating));
  };

  useEffect(() => {
    if (saveState !== "saved") return;

    const timer = setTimeout(() => {
      setSaveState("idle");
    }, 1800);

    return () => clearTimeout(timer);
  }, [saveState]);

  if (!isScheduledToday || isArchived) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-xl bg-base-200/60 px-3.5 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-300/70 text-base-content/40">
            <CalendarIcon />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-base-content">
              {isArchived ? "Archived habit" : "Not scheduled today"}
            </p>

            <p className="mt-0.5 text-xs leading-5 text-base-content/40">
              {isArchived
                ? "Restore this habit to start tracking it again."
                : "This habit isn't scheduled for today."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress header */}
      <div
        className={`
          flex items-center justify-between gap-3
          px-4 py-3.5
          ${isCompleted ? "bg-success/[0.035]" : "bg-transparent"}
        `}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`
              flex h-8 w-8 shrink-0 items-center justify-center
              rounded-lg
              ${
                isCompleted
                  ? "bg-success/10 text-success"
                  : "bg-primary/10 text-primary"
              }
            `}
          >
            {isCompleted ? <CheckIcon /> : <ProgressIcon />}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-base-content">
              Today's progress
            </p>
          </div>
        </div>

        <span
          className={`
            shrink-0 rounded-full
            px-2.5 py-1
            text-[10px]
            font-semibold
            ${
              isCompleted
                ? "bg-success/10 text-success"
                : "bg-base-200 text-base-content/40"
            }
          `}
        >
          {getStatusLabel(habit, value, isCompleted)}
        </span>
      </div>

      <div className="h-px bg-base-300/60" />

      {isBoolean && (
        <div className="p-4">
          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleted || loading}
            className={`
              flex min-h-14 w-full
              items-center justify-between
              rounded-xl px-3.5
              transition
              ${
                isCompleted
                  ? "cursor-default bg-success/10"
                  : "bg-base-100 hover:bg-primary/5"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span
                className={`
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-full
                  border-2
                  ${
                    isCompleted
                      ? "border-success bg-success text-success-content"
                      : "border-base-300 bg-base-100 text-transparent"
                  }
                `}
              >
                <CheckIcon />
              </span>

              <div className="text-left">
                <p
                  className={`
                    text-sm font-semibold
                    ${isCompleted ? "text-success" : "text-base-content"}
                  `}
                >
                  {isCompleted
                    ? "Completed for today"
                    : loading
                      ? "Completing..."
                      : "Mark complete"}
                </p>

                <p className="mt-0.5 text-xs text-base-content/40">
                  {isCompleted
                    ? "Nice work. Keep the streak going."
                    : "Tap to complete."}
                </p>
              </div>
            </div>

            {!isCompleted && !loading && (
              <span className="text-lg text-base-content/20">→</span>
            )}

            {loading && (
              <span className="loading loading-spinner loading-sm text-primary" />
            )}
          </button>

          {saveState === "saved" && (
            <div className="mt-2 text-right">
              <span className="text-[11px] font-medium text-success">
                Saved
              </span>
            </div>
          )}

          {renderError(error)}
        </div>
      )}

      {isNumeric && (
        <div className="p-4">
          <ProgressInfo
            value={value}
            target={habit?.target}
            unit={habit?.unit}
            isCompleted={isCompleted}
          />

          <div className="mt-4">
            <label className="mb-1.5 block text-[11px] font-medium text-base-content/40">
              Today's progress
            </label>

            <div className="flex items-center rounded-xl border border-base-300/70 bg-base-100 transition focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/5">
              <input
                type="number"
                min="0"
                step="any"
                value={value}
                disabled={loading}
                onChange={(e) => handleValueChange(e.target.value)}
                onBlur={handleNumberBlur}
                onKeyDown={handleNumberKeyDown}
                placeholder={String(habit?.target || 0)}
                className="
                  input h-11 min-w-0 flex-1
                  border-0 bg-transparent
                  px-3.5
                  text-sm font-semibold
                  focus:outline-none focus:ring-0
                "
              />

              {habit?.unit && (
                <span className="px-3 text-xs font-medium text-base-content/40">
                  {habit.unit}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 flex justify-end">
            {renderSaveStatus(saveState)}
          </div>

          {renderError(error)}
        </div>
      )}

      {isDuration && (
        <div className="p-4">
          <ProgressInfo
            value={value}
            target={habit?.target}
            unit={habit?.unit || "minutes"}
            isCompleted={isCompleted}
          />

          <div className="mt-4">
            <label className="mb-1.5 block text-[11px] font-medium text-base-content/40">
              Today's progress
            </label>

            <div className="flex items-center rounded-xl border border-base-300/70 bg-base-100 transition focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/5">
              <input
                type="number"
                min="0"
                step="1"
                value={value}
                disabled={loading}
                onChange={(e) => handleValueChange(e.target.value)}
                onBlur={handleNumberBlur}
                onKeyDown={handleNumberKeyDown}
                placeholder={String(habit?.target || 0)}
                className="
                  input h-11 min-w-0 flex-1
                  border-0 bg-transparent
                  px-3.5
                  text-sm font-semibold
                  focus:outline-none focus:ring-0
                "
              />

              <span className="px-3 text-xs font-medium text-base-content/40">
                {habit?.unit || "minutes"}
              </span>
            </div>
          </div>

          <div className="mt-2 flex justify-end">
            {renderSaveStatus(saveState)}
          </div>

          {renderError(error)}
        </div>
      )}

      {isRating && (
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-base-content">
                Today's rating
              </p>

              <p className="mt-0.5 text-xs text-base-content/40">
                Choose from 1 to 5
              </p>
            </div>

            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((rating) => {
                const selected = Number(value) >= rating;

                return (
                  <button
                    key={rating}
                    type="button"
                    disabled={loading}
                    onClick={() => handleRatingChange(rating)}
                    className={`
                      flex h-8 w-8
                      items-center justify-center
                      rounded-lg
                      text-lg
                      transition
                      ${
                        selected
                          ? "text-warning"
                          : "text-base-content/15 hover:bg-warning/10 hover:text-warning"
                      }
                    `}
                    aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
                  >
                    {selected ? "★" : "☆"}
                  </button>
                );
              })}
            </div>
          </div>

          {value !== "" && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-base-200/60 px-3.5 py-2.5">
              <span className="text-xs text-base-content/40">Your rating</span>

              <span className="text-xs font-bold text-warning">
                {value} / 5
              </span>
            </div>
          )}

          <div className="mt-2 flex justify-end">
            {renderSaveStatus(saveState)}
          </div>

          {renderError(error)}
        </div>
      )}
    </div>
  );
};

const getIsCompleted = (habit, value, existingLog) => {
  if (!habit) return false;

  const current = Number(value) || 0;

  if (habit.type === "boolean") {
    return current >= 1 || existingLog?.completed === true;
  }

  if (
    habit.type === "count" ||
    habit.type === "numeric" ||
    habit.type === "duration"
  ) {
    return current >= Number(habit.target);
  }

  if (habit.type === "rating") {
    return current >= Number(habit.target || 5);
  }

  return false;
};

const getStatusLabel = (habit, value, isCompleted) => {
  if (isCompleted) return "Completed";

  const current = Number(value) || 0;

  if (
    habit.type === "count" ||
    habit.type === "numeric" ||
    habit.type === "duration"
  ) {
    if (current > 0) {
      return `${Math.min(
        100,
        Math.round((current / Number(habit.target || 1)) * 100),
      )}%`;
    }
  }

  if (habit.type === "rating" && current > 0) {
    return `${current}/5`;
  }

  return "Not started";
};

const ProgressInfo = ({ value, target, unit, isCompleted }) => {
  if (value === "" || value === null || value === undefined) {
    return (
      <div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-base-content/40">
              Daily target
            </p>

            <p className="mt-0.5 text-base font-bold text-base-content">
              {target}
              {unit ? ` ${unit}` : ""}
            </p>
          </div>

          <span className="text-xs text-base-content/35">0%</span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-base-300/70">
          <div className="h-full w-0 rounded-full bg-primary" />
        </div>
      </div>
    );
  }

  const current = Number(value) || 0;
  const goal = Number(target) || 0;

  if (goal <= 0) return null;

  const percentage = Math.min(
    100,
    Math.max(0, Math.round((current / goal) * 100)),
  );

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-base-content/40">
            Today's progress
          </p>

          <p className="mt-0.5 text-base font-bold text-base-content">
            {current}
            <span className="mx-1 text-base-content/25">/</span>
            {goal}

            {unit && (
              <span className="ml-1 text-xs font-medium text-base-content/40">
                {unit}
              </span>
            )}
          </p>
        </div>

        <span
          className={`
            text-xs font-bold
            ${isCompleted ? "text-success" : "text-base-content/45"}
          `}
        >
          {percentage}%
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-base-300/70">
        <div
          className={`
            h-full rounded-full
            transition-all duration-500
            ${isCompleted ? "bg-success" : "bg-primary"}
          `}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

const isHabitScheduledToday = (habit) => {
  if (!habit?.createdAt) return false;

  const todayString = getLocalDateString();

  const createdDateString = new Date(habit.createdAt)
    .toISOString()
    .split("T")[0];

  if (todayString < createdDateString) {
    return false;
  }

  const [year, month, day] = todayString.split("-").map(Number);

  const todayUTC = new Date(Date.UTC(year, month - 1, day));

  if (habit.frequency === "daily") {
    return true;
  }

  if (habit.frequency === "weekly") {
    const createdDate = new Date(`${createdDateString}T00:00:00.000Z`);

    return todayUTC.getUTCDay() === createdDate.getUTCDay();
  }

  if (habit.frequency === "monthly") {
    const createdDay = Number(createdDateString.split("-")[2]);

    return day === createdDay;
  }

  if (habit.frequency === "custom") {
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const scheduledDays = Array.isArray(habit.scheduledDays)
      ? habit.scheduledDays.map((item) => String(item).toLowerCase())
      : [];

    const scheduledDates = Array.isArray(habit.scheduledDates)
      ? habit.scheduledDates.map(Number)
      : [];

    if (scheduledDays.includes(dayNames[todayUTC.getUTCDay()])) {
      return true;
    }

    if (scheduledDates.includes(day)) {
      return true;
    }

    if (day === 1 && scheduledDates.length > 0) {
      const previousMonthDays = new Date(
        Date.UTC(year, month - 1, 0),
      ).getUTCDate();

      return scheduledDates.some(
        (scheduledDate) => scheduledDate > previousMonthDays,
      );
    }
  }

  return false;
};

const renderSaveStatus = (saveState) => {
  if (saveState === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-base-content/40">
        <span className="loading loading-spinner loading-xs" />
        Saving
      </span>
    );
  }

  if (saveState === "saved") {
    return (
      <span className="text-[11px] font-semibold text-success">✓ Saved</span>
    );
  }

  if (saveState === "error") {
    return (
      <span className="text-[11px] font-medium text-error">Not saved</span>
    );
  }

  return null;
};

const renderError = (error) => {
  if (!error) return null;

  return (
    <div className="mt-3 rounded-lg bg-error/10 px-3 py-2">
      <p className="text-xs font-medium text-error">{error}</p>
    </div>
  );
};

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    className="h-4 w-4"
  >
    <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProgressIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v4l2.5 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
  </svg>
);

export default HabitProgress;
