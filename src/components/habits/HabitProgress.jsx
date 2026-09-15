import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getLocalDateString } from "../../utils/date";
import { addHabitLog, editHabitLog } from "../../redux/habitLogSlice";

const HabitProgress = ({ habit, existingLog, onSuccess }) => {
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

  const isCompleted =
    isBoolean && (Number(value) === 1 || existingLog?.completed === true);

  const saveProgress = async (newValue) => {
    if (loading) return;

    setError("");

    const existingValue = existingLog?.value ?? "";

    if (existingLog?._id && String(existingValue) === String(newValue)) {
      setSaveState("saved");
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
    }, 2000);

    return () => clearTimeout(timer);
  }, [saveState]);

  return (
    <div className="mt-3">
      {isBoolean && (
        <div>
          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleted || loading}
            className={`flex min-h-14 w-full items-center justify-between rounded-xl px-4 transition-all duration-200 ${
              isCompleted
                ? "cursor-default bg-success/10"
                : "bg-base-100 hover:bg-primary/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  isCompleted
                    ? "border-success bg-success text-success-content"
                    : "border-base-300 bg-base-100 text-transparent"
                }`}
              >
                ✓
              </span>

              <span
                className={`text-sm font-semibold ${
                  isCompleted ? "text-success" : "text-base-content"
                }`}
              >
                {isCompleted
                  ? "Completed"
                  : loading
                    ? "Completing..."
                    : "Mark Complete"}
              </span>
            </div>

            {isCompleted ? (
              <span className="text-xs font-semibold text-success">Done</span>
            ) : (
              <span className="text-lg text-base-content/25">→</span>
            )}
          </button>

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-base-content/40">
              {isCompleted
                ? "Great job! Habit completed for today."
                : "Complete this habit when you're done."}
            </p>

            {!isCompleted && renderSaveStatus(saveState)}
          </div>

          {renderError(error)}
        </div>
      )}
      {isNumeric && (
        <div>
          <div className="flex items-center gap-2 rounded-xl bg-base-200/70 p-2">
            <input
              type="number"
              min="0"
              step="any"
              value={value}
              disabled={loading}
              onChange={(e) => handleValueChange(e.target.value)}
              onBlur={handleNumberBlur}
              onKeyDown={handleNumberKeyDown}
              placeholder={habit?.target ? `${habit.target}` : "Enter progress"}
              className="input input-sm h-10 min-w-0 flex-1 border-0 bg-transparent px-2 text-sm font-medium text-base-content placeholder:text-base-content/30 focus:outline-none focus:ring-0"
            />

            {habit?.unit && (
              <span className="shrink-0 px-2 text-xs font-medium text-base-content/45">
                {habit.unit}
              </span>
            )}
          </div>

          <div className="mt-2 flex justify-end">
            {renderSaveStatus(saveState)}
          </div>

          <ProgressInfo
            value={value}
            target={habit?.target}
            unit={habit?.unit}
          />

          {renderError(error)}
        </div>
      )}
      {isDuration && (
        <div>
          <div className="flex items-center gap-2 rounded-xl bg-base-200/70 p-2">
            <input
              type="number"
              min="0"
              step="1"
              value={value}
              disabled={loading}
              onChange={(e) => handleValueChange(e.target.value)}
              onBlur={handleNumberBlur}
              onKeyDown={handleNumberKeyDown}
              placeholder={habit?.target ? `${habit.target}` : "Enter duration"}
              className="input input-sm h-10 min-w-0 flex-1 border-0 bg-transparent px-2 text-sm font-medium text-base-content placeholder:text-base-content/30 focus:outline-none focus:ring-0"
            />

            <span className="shrink-0 px-2 text-xs font-medium text-base-content/45">
              {habit?.unit || "minutes"}
            </span>
          </div>

          <div className="mt-2 flex justify-end">
            {renderSaveStatus(saveState)}
          </div>

          <ProgressInfo
            value={value}
            target={habit?.target}
            unit={habit?.unit || "minutes"}
          />

          {renderError(error)}
        </div>
      )}
      {isRating && (
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-base-content">
                Today's rating
              </p>

              <p className="mt-0.5 text-xs text-base-content/40">
                Choose 1 to 5
              </p>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((rating) => {
                const selected = Number(value) >= rating;

                return (
                  <button
                    key={rating}
                    type="button"
                    disabled={loading}
                    onClick={() => handleRatingChange(rating)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition ${
                      selected
                        ? "text-warning"
                        : "text-base-content/20 hover:bg-warning/10 hover:text-warning"
                    }`}
                    aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
                  >
                    {selected ? "★" : "☆"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 flex justify-end">
            {renderSaveStatus(saveState)}
          </div>

          {value !== "" && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-base-200 px-3 py-2">
              <span className="text-xs text-base-content/45">Your rating</span>

              <span className="text-xs font-bold text-warning">
                {value} / 5
              </span>
            </div>
          )}

          {Number(value) === 5 && (
            <div className="mt-3 rounded-lg bg-success/10 px-3 py-2">
              <p className="text-xs font-semibold text-success">✓ Completed</p>
            </div>
          )}

          {renderError(error)}
        </div>
      )}
    </div>
  );
};
const renderSaveStatus = (saveState) => {
  if (saveState === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-base-content/45">
        <span className="loading loading-spinner loading-xs" />
        Saving...
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
const ProgressInfo = ({ value, target, unit }) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const current = Number(value) || 0;
  const goal = Number(target) || 0;

  if (goal <= 0) {
    return null;
  }

  const percentage = Math.min(
    100,
    Math.max(0, Math.round((current / goal) * 100)),
  );

  const isTargetReached = current >= goal;

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-base-content/45">
            Today's Progress
          </p>

          <p className="mt-0.5 text-sm font-semibold text-base-content">
            {current} / {goal}
            {unit ? ` ${unit}` : ""}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`text-xs font-bold ${
              isTargetReached ? "text-success" : "text-base-content/50"
            }`}
          >
            {percentage}%
          </span>

          {isTargetReached && (
            <p className="text-[10px] font-semibold text-success">Completed</p>
          )}
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-base-300">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isTargetReached ? "bg-success" : "bg-primary"
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default HabitProgress;
