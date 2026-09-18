import { useState } from "react";
import { useDispatch } from "react-redux";

import { addReview, editReview } from "../../redux/reviewSlice";
import AlertMessage from "../../layout/AlertMessage";

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

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const isEditing = Boolean(review);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!form.improvement.trim()) {
      setMessageType("error");
      setMessage("Please describe what you could improve.");
      return;
    }

    if (!form.tomorrowPriority.trim()) {
      setMessageType("error");
      setMessage("Please add your priority for tomorrow.");
      return;
    }

    if (form.energy !== "") {
      const energy = Number(form.energy);

      if (Number.isNaN(energy) || energy < 1 || energy > 10) {
        setMessageType("error");
        setMessage("Energy must be between 1 and 10.");
        return;
      }
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

    setLoading(true);

    try {
      if (isEditing) {
        await dispatch(
          editReview({
            id: review._id,
            data: payload,
          }),
        ).unwrap();

        setMessageType("success");
        setMessage("Review updated successfully!");
      } else {
        await dispatch(
          addReview({
            date,
            ...payload,
          }),
        ).unwrap();

        setMessageType("success");
        setMessage("Review created successfully!");
      }

      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      console.error("Review save error:", err);

      setMessageType("error");
      setMessage(
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
              📝
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight text-base-content">
                {isEditing ? "Edit Daily Review" : "Daily Review"}
              </h2>

              <p className="mt-1 text-sm text-base-content/55">
                Take a moment to reflect on your day.
              </p>
            </div>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-sm btn-circle btn-ghost text-base-content/40 hover:bg-base-200 hover:text-base-content"
              aria-label="Close review"
            >
              ✕
            </button>
          )}
        </div>

        {message && (
          <div className="mt-5">
            <AlertMessage
              type={messageType}
              message={message}
              duration={3000}
              onClose={() => setMessage("")}
            />
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">
                1
              </div>

              <div>
                <h3 className="text-base font-semibold text-base-content">
                  How are you feeling?
                </h3>

                <p className="mt-0.5 text-xs text-base-content/50">
                  Choose the mood that best describes your day.
                </p>
              </div>
            </div>

            <div className="mt-4 ml-0 lg:ml-11">
              <select
                name="mood"
                value={form.mood}
                onChange={handleChange}
                className="select select-bordered h-11 w-full rounded-xl border-base-300 bg-base-100 text-sm text-base-content outline-none focus:border-primary focus:outline-none"
              >
                <option value="">Select your mood</option>
                <option value="Great">😄 Great</option>
                <option value="Good">🙂 Good</option>
                <option value="Okay">😐 Okay</option>
                <option value="Low">😔 Low</option>
                <option value="Bad">😞 Bad</option>
              </select>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">
                2
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-base-content">
                      Energy Level
                    </h3>

                    <p className="mt-0.5 text-xs text-base-content/50">
                      How much energy did you have today?
                    </p>
                  </div>

                  <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    {form.energy || "—"}/10
                  </span>
                </div>

                <div className="mt-5">
                  <div className="relative py-2">
                    {/* Track */}
                    <div className="h-2.5 w-full rounded-full bg-base-300">
                      {/* Progress */}
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-200"
                        style={{
                          width: `${((Number(form.energy || 5) - 1) / 9) * 100}%`,
                        }}
                      />
                    </div>

                    <input
                      type="range"
                      name="energy"
                      min="1"
                      max="10"
                      value={form.energy || 5}
                      onChange={handleChange}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label="Energy level"
                    />

                    {/* Thumb */}
                    <span
                      className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-primary bg-base-100 shadow-sm"
                      style={{
                        left: `calc(${
                          ((Number(form.energy || 5) - 1) / 9) * 100
                        }% - 10px)`,
                      }}
                    />
                  </div>

                  <div className="mt-1 flex justify-between text-[10px] text-base-content/35">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">
              3
            </div>

            <div>
              <h3 className="text-base font-semibold text-base-content">
                Daily Reflection
              </h3>

              <p className="mt-0.5 text-xs text-base-content/50">
                Capture what happened and what you learned.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:ml-11">
            {/* What went well */}

            <TextAreaField
              id="review-went-well"
              name="wentWell"
              label="What went well?"
              optional
              value={form.wentWell}
              onChange={handleChange}
              maxLength={150}
              placeholder="What are you proud of today?"
              count={`${form.wentWell.length}/150`}
            />

            {/* Improvement */}

            <TextAreaField
              id="review-improvement"
              name="improvement"
              label="What could you improve?"
              required
              value={form.improvement}
              onChange={handleChange}
              maxLength={200}
              placeholder="What would you like to do better tomorrow?"
              count={`${form.improvement.length}/200`}
            />
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">
              4
            </div>

            <div>
              <h3 className="text-base font-semibold text-base-content">
                Looking Ahead
              </h3>

              <p className="mt-0.5 text-xs text-base-content/50">
                Set an intention for what comes next.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:ml-11">
            {/* Tomorrow's Priority */}

            <TextAreaField
              id="review-tomorrow-priority"
              name="tomorrowPriority"
              label="Tomorrow's Priority"
              required
              value={form.tomorrowPriority}
              onChange={handleChange}
              maxLength={200}
              placeholder="What's the one thing you want to focus on tomorrow?"
              count={`${form.tomorrowPriority.length}/200`}
            />

            {/* Additional Notes */}

            <TextAreaField
              id="review-notes"
              name="notes"
              label="Additional Notes"
              optional
              value={form.notes}
              onChange={handleChange}
              maxLength={250}
              placeholder="Anything else you'd like to remember?"
              count={`${form.notes.length}/250`}
            />
          </div>
        </section>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-ghost rounded-xl px-5 text-base-content/65 hover:bg-base-200 hover:text-base-content"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary min-w-32 rounded-xl px-5"
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

const TextAreaField = ({
  id,
  name,
  label,
  optional = false,
  required = false,
  value,
  onChange,
  maxLength,
  placeholder,
  count,
}) => {
  return (
    <div className="form-control">
      <label htmlFor={id} className="mb-2 block">
        <span className="text-sm font-semibold text-base-content">
          {label}

          {required && <span className="ml-1 text-error">*</span>}

          {optional && (
            <span className="ml-1 font-normal text-base-content/40">
              Optional
            </span>
          )}
        </span>
      </label>

      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        rows={4}
        placeholder={placeholder}
        className="textarea textarea-bordered min-h-[120px] w-full resize-none rounded-xl border-base-300 bg-base-100 px-3 py-3 text-sm leading-6 text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none"
      />

      <div className="mt-1 text-right text-[10px] text-base-content/35">
        {count}
      </div>
    </div>
  );
};

export default ReviewForm;
