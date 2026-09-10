import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addReview,
  editReview,
} from "../../redux/reviewSlice";

const getInitialForm = (review) => ({
  mood: review?.mood || "",
  energy: review?.energy ?? "",
  wentWell: review?.wentWell || "",
  improvement: review?.improvement || "",
  tomorrowPriority: review?.tomorrowPriority || "",
  notes: review?.notes || "",
});

const ReviewForm = ({
  review = null,
  date,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState(() =>
    getInitialForm(review)
  );

  const [error, setError] = useState("");

  const isEditing = Boolean(review);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    /* ================= VALIDATION ================= */

    if (!form.improvement.trim()) {
      setError("Please describe what you could improve.");
      return;
    }

    if (!form.tomorrowPriority.trim()) {
      setError("Please add your priority for tomorrow.");
      return;
    }

    if (
      form.energy !== "" &&
      (Number(form.energy) < 1 ||
        Number(form.energy) > 10)
    ) {
      setError("Energy must be between 1 and 10.");
      return;
    }

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
      if (isEditing) {
        await dispatch(
          editReview({
            id: review._id,
            data: payload,
          })
        ).unwrap();
      } else {
        await dispatch(
          addReview({
            date,
            ...payload,
          })
        ).unwrap();
      }

      onSuccess?.();
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to save review."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm"
    >
      {/* ================= HEADER ================= */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          {isEditing
            ? "Edit Daily Review"
            : "Daily Review"}
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          Take a moment to reflect on your day.
        </p>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="alert alert-error mb-5">
          <span>{error}</span>
        </div>
      )}

      {/* ================= MOOD ================= */}

      <div className="form-control mb-5">
        <label className="label">
          <span className="label-text font-medium">
            How are you feeling?
          </span>
        </label>

        <select
          name="mood"
          value={form.mood}
          onChange={handleChange}
          className="select select-bordered w-full"
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

      <div className="form-control mb-5">
        <label className="label">
          <span className="label-text font-medium">
            Energy Level
          </span>

          <span className="label-text-alt">
            {form.energy || "-"}/10
          </span>
        </label>

        <input
          type="range"
          name="energy"
          min="1"
          max="10"
          value={form.energy || 5}
          onChange={handleChange}
          className="range range-primary"
        />

        <div className="mt-1 flex justify-between text-xs text-base-content/50">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* ================= WENT WELL ================= */}

      <div className="form-control mb-5">
        <label className="label">
          <span className="label-text font-medium">
            What went well?
          </span>
        </label>

        <textarea
          name="wentWell"
          value={form.wentWell}
          onChange={handleChange}
          maxLength={150}
          rows={3}
          placeholder="What are you proud of today?"
          className="textarea textarea-bordered w-full"
        />

        <label className="label">
          <span className="label-text-alt">
            {form.wentWell.length}/150
          </span>
        </label>
      </div>

      {/* ================= IMPROVEMENT ================= */}

      <div className="form-control mb-5">
        <label className="label">
          <span className="label-text font-medium">
            What could you improve?
            <span className="ml-1 text-error">*</span>
          </span>
        </label>

        <textarea
          name="improvement"
          value={form.improvement}
          onChange={handleChange}
          maxLength={200}
          rows={3}
          placeholder="What could have gone better?"
          className="textarea textarea-bordered w-full"
        />

        <label className="label">
          <span className="label-text-alt">
            {form.improvement.length}/200
          </span>
        </label>
      </div>

      {/* ================= TOMORROW PRIORITY ================= */}

      <div className="form-control mb-5">
        <label className="label">
          <span className="label-text font-medium">
            Tomorrow's Priority
            <span className="ml-1 text-error">*</span>
          </span>
        </label>

        <textarea
          name="tomorrowPriority"
          value={form.tomorrowPriority}
          onChange={handleChange}
          maxLength={200}
          rows={3}
          placeholder="What's the one thing you want to focus on tomorrow?"
          className="textarea textarea-bordered w-full"
        />

        <label className="label">
          <span className="label-text-alt">
            {form.tomorrowPriority.length}/200
          </span>
        </label>
      </div>

      {/* ================= NOTES ================= */}

      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text font-medium">
            Additional Notes
          </span>
        </label>

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          maxLength={250}
          rows={4}
          placeholder="Anything else you'd like to remember?"
          className="textarea textarea-bordered w-full"
        />

        <label className="label">
          <span className="label-text-alt">
            {form.notes.length}/250
          </span>
        </label>
      </div>

      {/* ================= ACTIONS ================= */}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary"
        >
          {isEditing
            ? "Update Review"
            : "Save Review"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
