import { useState } from "react";
import { useDispatch } from "react-redux";
import { addHabitLog, editHabitLog } from "../../redux/habitLogSlice";

const HabitProgress = ({ habit, existingLog, onSuccess }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState(existingLog?.value ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCompleted = existingLog?.completed;

  const handleSubmit = async () => {
    setError("");

    if (value === "") {
      setError("Please enter your progress.");
      return;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue) || numericValue < 0) {
      setError("Please enter a valid value.");
      return;
    }

    try {
      setLoading(true);

      if (existingLog?._id) {
        await dispatch(
          editHabitLog({
            id: existingLog._id,
            data: {
              value: numericValue,
            },
          }),
        ).unwrap();
      } else {
        await dispatch(
          addHabitLog({
            habitId: habit._id,
            data: {
              value: numericValue,
            },
          }),
        ).unwrap();
      }

      onSuccess?.();
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to save progress.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooleanToggle = () => {
    setValue(isCompleted ? 0 : 1);
  };

  return (
    <div className="mt-4">
      {/* Error */}
      {error && (
        <div className="mb-3 rounded-lg bg-error/10 p-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Boolean */}
      {habit.type === "boolean" && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBooleanToggle}
            className={`btn ${
              value === 1 || isCompleted ? "btn-success" : "btn-outline"
            }`}
          >
            {value === 1 || isCompleted ? "✓ Completed" : "Mark Complete"}
          </button>

          {(value === 1 || isCompleted) && (
            <button
              type="button"
              onClick={() => setValue(0)}
              className="btn btn-ghost btn-sm"
            >
              Undo
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary btn-sm"
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      )}

      {/* Numeric */}
      {habit.type === "numeric" && (
        <div>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Target: ${habit.target}`}
              className="input input-bordered w-full"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Save"
              )}
            </button>
          </div>

          <ProgressInfo value={value} target={habit.target} unit={habit.unit} />
        </div>
      )}

      {/* Duration */}
      {habit.type === "duration" && (
        <div>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Target: ${habit.target}`}
              className="input input-bordered w-full"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Save"
              )}
            </button>
          </div>

          <ProgressInfo
            value={value}
            target={habit.target}
            unit={habit.unit || "minutes"}
          />
        </div>
      )}

      {/* Rating */}
      {habit.type === "rating" && (
        <div>
          <div className="flex gap-2">
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select rating</option>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐⭐</option>
              <option value="3">3 ⭐⭐⭐</option>
              <option value="4">4 ⭐⭐⭐⭐</option>
              <option value="5">5 ⭐⭐⭐⭐⭐</option>
            </select>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Save"
              )}
            </button>
          </div>

          <ProgressInfo value={value} target={habit.target} unit="" />
        </div>
      )}
    </div>
  );
};

const ProgressInfo = ({ value, target, unit }) => {
  if (value === "" || !target) return null;

  const percentage = Math.min(
    100,
    Math.round((Number(value) / Number(target)) * 100),
  );

  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-base-content/60">Progress</span>

        <span className="font-medium">
          {value} / {target} {unit}
        </span>
      </div>

      <progress
        className={`progress w-full ${
          percentage >= 100 ? "progress-success" : "progress-primary"
        }`}
        value={percentage}
        max="100"
      />

      <p className="mt-1 text-right text-xs text-base-content/50">
        {percentage}% complete
      </p>
    </div>
  );
};

export default HabitProgress;
