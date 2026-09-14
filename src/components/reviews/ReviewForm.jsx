import { useState } from "react";
import { useDispatch } from "react-redux";

import { addReview, editReview } from "../../redux/reviewSlice";

const getInitialForm = (review) => ({
  mood: review?.mood || "",
  energy: review?.energy ?? "",
  wentWell: review?.wentWell || "",
  improvement: review?.improvement || "",
  tomorrowPriority: review?.tomorrowPriority || "",
  notes: review?.notes || "",
});

const ReviewForm = ({ review = null, date, onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState(() => getInitialForm(review));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(review);

  // ================= CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ================= VALIDATION =================

    if (!form.improvement.trim()) {
      setError("Please describe what you could improve.");
      return;
    }

    if (!form.tomorrowPriority.trim()) {
      setError("Please add your priority for tomorrow.");
      return;
    }

    if (form.energy !== "") {
      const energy = Number(form.energy);

      if (Number.isNaN(energy) || energy < 1 || energy > 10) {
        setError("Energy must be between 1 and 10.");
        return;
      }
    }

    // ================= PAYLOAD =================

    const payload = {
      mood: form.mood.trim(),

      ...(form.energy !== "" && {
        energy: Number(form.energy),
      }),

      wentWell: form.wentWell.trim(),
      improvement: form.improvement.trim(),
      tomorrowPriority: form.tomorrowPriority.trim(),
      notes: form.notes.trim(),
    };

    try {
      setLoading(true);

      if (isEditing) {
        await dispatch(
          editReview({
            id: review._id,
            data: payload,
          }),
        ).unwrap();
      } else {
        await dispatch(
          addReview({
            date,
            ...payload,
          }),
        ).unwrap();
      }

      onSuccess?.();
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to save review.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-base-300 bg-base-100 shadow-sm"
    >
      <div className="p-5 sm:p-6">
        {/* ================= HEADER ================= */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
              📝
            </div>

            <div>
              <h2 className="text-xl font-semibold text-base-content">
                {isEditing ? "Edit Daily Review" : "Daily Review"}
              </h2>

              <p className="mt-1 text-sm text-base-content/60">
                Take a moment to reflect on your day.
              </p>
            </div>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-sm btn-circle btn-ghost text-base-content/50 hover:bg-base-200 hover:text-base-content"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-5 rounded-xl border border-error/20 bg-error/10 px-4 py-3">
            <p className="text-sm font-medium text-error">{error}</p>
          </div>
        )}

        {/* ================= MOOD ================= */}

        <div className="rounded-xl bg-base-200 p-4">
          <div className="mb-3">
            <p className="text-sm font-semibold text-base-content">
              How are you feeling?
            </p>

            <p className="mt-0.5 text-xs text-base-content/50">
              Choose the mood that best describes your day.
            </p>
          </div>

          <select
            name="mood"
            value={form.mood}
            onChange={handleChange}
            className="select select-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none"
          >
            <option value="">Select your mood</option>
            <option value="Great">😄 Great</option>
            <option value="Good">🙂 Good</option>
            <option value="Okay">😐 Okay</option>
            <option value="Low">😔 Low</option>
            <option value="Bad">😞 Bad</option>
          </select>
        </div>

        {/* ================= ENERGY ================= */}

        <div className="mt-4 rounded-xl bg-base-200 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-base-content">
                Energy Level
              </p>

              <p className="mt-0.5 text-xs text-base-content/50">
                How much energy did you have today?
              </p>
            </div>

            <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
              {form.energy || "-"}/10
            </span>
          </div>

          <input
            type="range"
            name="energy"
            min="1"
            max="10"
            value={form.energy || 5}
            onChange={handleChange}
            className="range range-primary w-full"
          />

          <div className="mt-1 flex justify-between text-xs text-base-content/45">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* ================= REFLECTION ================= */}

        <div className="mt-6">
          <div className="mb-4">
            <p className="text-sm font-semibold text-base-content">
              Daily Reflection
            </p>

            <p className="mt-0.5 text-xs text-base-content/50">
              Capture what happened and what you learned.
            </p>
          </div>

          {/* Went Well */}

          <div className="form-control">
            <label htmlFor="went-well" className="label">
              <span className="label-text font-medium text-base-content">
                What went well?
              </span>

              <span className="label-text-alt text-base-content/40">
                Optional
              </span>
            </label>

            <textarea
              id="went-well"
              name="wentWell"
              value={form.wentWell}
              onChange={handleChange}
              maxLength={150}
              rows={3}
              placeholder="What are you proud of today?"
              className="textarea textarea-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
            />

            <div className="mt-1 text-right text-xs text-base-content/40">
              {form.wentWell.length}/150
            </div>
          </div>

          {/* Improvement */}

          <div className="form-control mt-5">
            <label htmlFor="improvement" className="label">
              <span className="label-text font-medium text-base-content">
                What could you improve?
                <span className="ml-1 text-error">*</span>
              </span>
            </label>

            <textarea
              id="improvement"
              name="improvement"
              value={form.improvement}
              onChange={handleChange}
              maxLength={200}
              rows={3}
              placeholder="What could have gone better?"
              className="textarea textarea-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
            />

            <div className="mt-1 text-right text-xs text-base-content/40">
              {form.improvement.length}/200
            </div>
          </div>

          {/* Tomorrow Priority */}

          <div className="form-control mt-5">
            <label htmlFor="tomorrow-priority" className="label">
              <span className="label-text font-medium text-base-content">
                Tomorrow's Priority
                <span className="ml-1 text-error">*</span>
              </span>
            </label>

            <textarea
              id="tomorrow-priority"
              name="tomorrowPriority"
              value={form.tomorrowPriority}
              onChange={handleChange}
              maxLength={200}
              rows={3}
              placeholder="What's the one thing you want to focus on tomorrow?"
              className="textarea textarea-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
            />

            <div className="mt-1 text-right text-xs text-base-content/40">
              {form.tomorrowPriority.length}/200
            </div>
          </div>

          {/* Notes */}

          <div className="form-control mt-5">
            <label htmlFor="review-notes" className="label">
              <span className="label-text font-medium text-base-content">
                Additional Notes
              </span>

              <span className="label-text-alt text-base-content/40">
                Optional
              </span>
            </label>

            <textarea
              id="review-notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              maxLength={250}
              rows={4}
              placeholder="Anything else you'd like to remember?"
              className="textarea textarea-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
            />

            <div className="mt-1 text-right text-xs text-base-content/40">
              {form.notes.length}/250
            </div>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-base-300 pt-5 sm:flex-row sm:justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-ghost text-base-content/70 hover:bg-base-200 hover:text-base-content"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary min-w-32"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Saving...
              </>
            ) : isEditing ? (
              "Update Review"
            ) : (
              "Save Review"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;
