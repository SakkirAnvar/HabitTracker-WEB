import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { addHabitLog, editHabitLog } from "../../redux/habitLogSlice";

const HabitProgress = ({ habit, existingLog, onSuccess }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState(existingLog?.value ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * Keep local value synchronized with the latest log.
   *
   * This is important when:
   * - A log is created
   * - A log is edited
   * - The selected day changes
   * - Redux refreshes the habit log
   */
  useEffect(() => {
    setValue(existingLog?.value ?? "");
    setError("");
  }, [existingLog]);

  // ================= HABIT TYPE =================

  const habitType = habit?.type || "boolean";

  const isBoolean = habitType === "boolean";

  const isNumeric = habitType === "numeric" || habitType === "count";

  const isDuration = habitType === "duration";

  const isRating = habitType === "rating";

  // ================= COMPLETION =================

  const isCompleted =
    isBoolean && (Number(value) === 1 || existingLog?.completed === true);

  // ================= SAVE =================

  const handleSubmit = async () => {
    setError("");

    /*
     * Boolean habits only accept 0 or 1.
     */
    if (isBoolean) {
      const booleanValue = Number(value);

      if (![0, 1].includes(booleanValue)) {
        setError("Please mark the habit as complete or incomplete.");
        return;
      }
    }

    /*
     * Rating must be between 1 and 5.
     */
    if (isRating) {
      const rating = Number(value);

      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        setError("Please select a rating between 1 and 5.");
        return;
      }
    }

    /*
     * Numeric / duration values.
     */
    if (isNumeric || isDuration) {
      if (value === "") {
        setError("Please enter your progress.");
        return;
      }

      const numericValue = Number(value);

      if (Number.isNaN(numericValue) || numericValue < 0) {
        setError("Please enter a valid value.");
        return;
      }
    }

    let finalValue;

    if (isBoolean) {
      finalValue = Number(value);
    } else if (isRating) {
      finalValue = Number(value);
    } else {
      finalValue = Number(value);
    }

    try {
      setLoading(true);

      if (existingLog?._id) {
        await dispatch(
          editHabitLog({
            id: existingLog._id,
            data: {
              value: finalValue,
            },
          }),
        ).unwrap();
      } else {
        await dispatch(
          addHabitLog({
            habitId: habit._id,
            data: {
              value: finalValue,
            },
          }),
        ).unwrap();
      }

      setError("");
      onSuccess?.();
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to save progress.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= BOOLEAN TOGGLE =================

  const handleBooleanToggle = () => {
    setError("");

    setValue(isCompleted ? 0 : 1);
  };

  // ================= VALUE CHANGE =================

  const handleValueChange = (newValue) => {
    setValue(newValue);

    if (error) {
      setError("");
    }
  };

  return (
    <div className="mt-4">
      {/* ================= ERROR ================= */}

      {error && (
        <div className="mb-3 rounded-xl border border-error/20 bg-error/10 px-4 py-3">
          <p className="text-sm font-medium text-error">{error}</p>
        </div>
      )}

      {/* ================= BOOLEAN ================= */}

      {isBoolean && (
        <div className="rounded-xl bg-base-200 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleBooleanToggle}
              disabled={loading}
              className={`btn ${
                isCompleted
                  ? "btn-success"
                  : "btn-outline border-base-300 bg-base-100 hover:border-primary hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {isCompleted ? "✓ Completed" : "Mark Complete"}
            </button>

            <div className="flex items-center gap-2">
              {isCompleted && (
                <button
                  type="button"
                  onClick={() => {
                    setValue(0);
                    setError("");
                  }}
                  disabled={loading}
                  className="btn btn-ghost btn-sm text-base-content/60 hover:bg-base-100 hover:text-base-content"
                >
                  Undo
                </button>
              )}

              <SaveButton loading={loading} onClick={handleSubmit} />
            </div>
          </div>

          <p className="mt-3 text-xs text-base-content/50">
            {isCompleted
              ? "Great job! You completed this habit today."
              : "Mark this habit complete when you finish it."}
          </p>
        </div>
      )}

      {/* ================= NUMERIC / COUNT ================= */}

      {isNumeric && (
        <div className="rounded-xl bg-base-200 p-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="number"
              min="0"
              step="any"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={
                habit.target ? `Target: ${habit.target}` : "Enter progress"
              }
              className="input input-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
            />

            <SaveButton loading={loading} onClick={handleSubmit} />
          </div>

          <ProgressInfo value={value} target={habit.target} unit={habit.unit} />
        </div>
      )}

      {/* ================= DURATION ================= */}

      {isDuration && (
        <div className="rounded-xl bg-base-200 p-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="number"
              min="0"
              step="1"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={
                habit.target ? `Target: ${habit.target}` : "Enter duration"
              }
              className="input input-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
            />

            <SaveButton loading={loading} onClick={handleSubmit} />
          </div>

          <ProgressInfo
            value={value}
            target={habit.target}
            unit={habit.unit || "minutes"}
          />
        </div>
      )}

      {/* ================= RATING ================= */}

      {isRating && (
        <div className="rounded-xl bg-base-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-base-content">
                How did you do today?
              </p>

              <p className="mt-0.5 text-xs text-base-content/50">
                Choose a rating from 1 to 5.
              </p>
            </div>

            <div className="rating rating-lg">
              {[1, 2, 3, 4, 5].map((rating) => (
                <input
                  key={rating}
                  type="radio"
                  name={`rating-${habit._id}`}
                  value={rating}
                  checked={Number(value) === rating}
                  onChange={() => handleValueChange(rating)}
                  className="mask mask-star-2 bg-warning"
                  aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
                />
              ))}
            </div>
          </div>

          {value !== "" && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-base-100 px-3 py-2">
              <span className="text-xs text-base-content/50">Your rating</span>

              <span className="font-semibold text-warning">{value} / 5 ⭐</span>
            </div>
          )}

          <div className="mt-3 flex justify-end">
            <SaveButton loading={loading} onClick={handleSubmit} />
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   SAVE BUTTON
========================================================= */

const SaveButton = ({ loading, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="btn btn-primary min-w-20"
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        "Save"
      )}
    </button>
  );
};

/* =========================================================
   PROGRESS INFO
========================================================= */

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

  const isComplete = current >= goal;

  return (
    <div className="mt-4">
      {/* Progress header */}

      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-base-content/45">
            Today's Progress
          </p>

          <p className="mt-1 text-sm font-semibold text-base-content">
            {current} / {goal}
            {unit ? ` ${unit}` : ""}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`text-sm font-bold ${
              isComplete ? "text-success" : "text-primary"
            }`}
          >
            {percentage}%
          </span>

          {isComplete && <p className="text-[11px] text-success">Completed</p>}
        </div>
      </div>

      {/* Progress bar */}

      <progress
        className={`progress w-full ${
          isComplete ? "progress-success" : "progress-primary"
        }`}
        value={percentage}
        max="100"
      />

      {/* Completion message */}

      {isComplete && (
        <div className="mt-3 rounded-lg border border-success/20 bg-success/10 px-3 py-2">
          <p className="text-xs font-medium text-success">
            🎉 You've reached your target for today!
          </p>
        </div>
      )}
    </div>
  );
};

export default HabitProgress;
