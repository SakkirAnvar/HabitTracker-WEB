import { useState } from "react";
import { useDispatch } from "react-redux";

import { addGoal, editGoal } from "../../redux/goalSlice";
import AlertMessage from "../../layout/AlertMessage";

const getInitialForm = (goal) => ({
  title: goal?.title || "",
  description: goal?.description || "",
  target: goal?.target ?? "",
  unit: goal?.unit || "",
  startDate: goal?.startDate ? goal.startDate.slice(0, 10) : "",
  deadLine: goal?.deadLine ? goal.deadLine.slice(0, 10) : "",
});

const GoalForm = ({ goal, onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState(() => getInitialForm(goal));

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(goal);

  // =========================
  // CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (message) {
      setMessage("");
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // =========================
    // VALIDATION
    // =========================

    if (!form.title.trim()) {
      setError("Goal title is required.");
      return;
    }

    if (!form.target || Number(form.target) <= 0) {
      setError("Target must be greater than 0.");
      return;
    }

    if (!form.unit.trim()) {
      setError("Measurement is required.");
      return;
    }

    if (!form.startDate || !form.deadLine) {
      setError("Start date and deadline are required.");
      return;
    }

    if (form.deadLine < form.startDate) {
      setError("Deadline cannot be before the start date.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      target: Number(form.target),
      unit: form.unit.trim(),
      startDate: form.startDate,
      deadLine: form.deadLine,
    };

    setLoading(true);

    try {
      if (isEditing) {
        await dispatch(
          editGoal({
            id: goal._id,
            data: payload,
          }),
        ).unwrap();

        setMessageType("success");
        setMessage("Goal updated successfully!");
      } else {
        await dispatch(addGoal(payload)).unwrap();

        setMessageType("success");
        setMessage("Goal created successfully!");
      }

      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err) {
      console.error("Goal save error:", err);

      setMessageType("error");

      setMessage(
        typeof err === "string" ? err : err?.message || "Failed to save goal.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-base-content">
              {isEditing ? "Edit Goal" : "Create New Goal"}
            </h2>

            <p className="mt-1 text-sm text-base-content/55">
              {isEditing
                ? "Update your goal details and keep moving forward."
                : "Set a clear target and turn your intentions into progress."}
            </p>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-sm shrink-0 rounded-xl border border-base-300 bg-base-100 px-4 text-base-content/60 hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              ← Back to Goals
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-7">
        {/* Alert */}

        {message && (
          <div className="mb-5">
            <AlertMessage
              type={messageType}
              message={message}
              duration={3000}
              onClose={() => setMessage("")}
            />
          </div>
        )}

        {/* Validation error */}

        {error && (
          <div className="mb-5 rounded-xl border border-error/20 bg-error/10 px-4 py-3">
            <p className="text-sm font-medium text-error">{error}</p>
          </div>
        )}

        {/* =================================================
            1. BASIC INFORMATION
        ================================================= */}

        <section>
          <SectionHeader
            number="1"
            title="Basic Information"
            description="Give your goal a clear title and description."
          />

          <div className="mt-5 space-y-5">
            {/* Goal Title */}

            <div>
              <label
                htmlFor="goal-title"
                className="mb-2 block text-sm font-semibold text-base-content"
              >
                Goal Title <span className="text-error">*</span>
              </label>

              <div className="relative">
                <input
                  id="goal-title"
                  type="text"
                  name="title"
                  value={form.title}
                  maxLength={100}
                  autoComplete="off"
                  onChange={handleChange}
                  placeholder="e.g. Complete 20 workouts"
                  className="input input-md w-full border-base-300 bg-base-100 pr-14 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary focus:outline-none"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-base-content/30">
                  {form.title.length}/100
                </span>
              </div>
            </div>

            {/* Description */}

            <div>
              <label
                htmlFor="goal-description"
                className="mb-2 block text-sm font-semibold text-base-content"
              >
                Description{" "}
                <span className="font-normal text-base-content/40">
                  (Optional)
                </span>
              </label>

              <div className="relative">
                <textarea
                  id="goal-description"
                  name="description"
                  value={form.description}
                  maxLength={300}
                  autoComplete="off"
                  onChange={handleChange}
                  placeholder="Describe what you want to accomplish..."
                  rows={4}
                  className="textarea textarea-md w-full resize-none border-base-300 bg-base-100 px-3.5 py-3 text-sm leading-6 text-base-content placeholder:text-base-content/30 focus:border-primary focus:outline-none"
                />

                <span className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] text-base-content/30">
                  {form.description.length}/300
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="my-7 border-t border-base-300" />

        {/* =================================================
            2. TARGET & MEASUREMENT
        ================================================= */}

        <section>
          <SectionHeader
            number="2"
            title="Target & Measurement"
            description="Define what you want to achieve."
          />

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Target */}

            <div>
              <label
                htmlFor="goal-target"
                className="mb-2 block text-sm font-semibold text-base-content"
              >
                Target <span className="text-error">*</span>
              </label>

              <input
                id="goal-target"
                type="number"
                name="target"
                value={form.target}
                min="1"
                step="any"
                onChange={handleChange}
                placeholder="20"
                className="input input-md w-full border-base-300 bg-base-100 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary focus:outline-none"
              />

              <p className="mt-1.5 text-xs text-base-content/45">
                The total amount you want to achieve.
              </p>
            </div>

            {/* Measurement */}

            <div>
              <label
                htmlFor="goal-unit"
                className="mb-2 block text-sm font-semibold text-base-content"
              >
                Measurement <span className="text-error">*</span>
              </label>

              <input
                id="goal-unit"
                type="text"
                name="unit"
                value={form.unit}
                maxLength={30}
                autoComplete="off"
                onChange={handleChange}
                placeholder="e.g. workouts, books, kg"
                className="input input-md w-full border-base-300 bg-base-100 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary focus:outline-none"
              />

              <p className="mt-1.5 text-xs text-base-content/45">
                What are you measuring?
              </p>
            </div>
          </div>
        </section>

        <div className="my-7 border-t border-base-300" />

        {/* =================================================
            3. TIMELINE
        ================================================= */}

        <section>
          <SectionHeader
            number="3"
            title="Timeline"
            description="Set a timeline to stay accountable."
          />

          <div className="mt-5 rounded-2xl bg-base-200/60 p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Start Date */}

              <div>
                <label
                  htmlFor="goal-start-date"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  Start Date <span className="text-error">*</span>
                </label>

                <input
                  id="goal-start-date"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="input input-md w-full border-base-300 bg-base-100 text-sm text-base-content focus:border-primary focus:outline-none"
                />
              </div>

              {/* Deadline */}

              <div>
                <label
                  htmlFor="goal-deadline"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  Deadline <span className="text-error">*</span>
                </label>

                <input
                  id="goal-deadline"
                  type="date"
                  name="deadLine"
                  value={form.deadLine}
                  onChange={handleChange}
                  className="input input-md w-full border-base-300 bg-base-100 text-sm text-base-content focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="mt-7 flex flex-col-reverse gap-2 border-t border-base-300 pt-5 sm:flex-row sm:justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-ghost btn-sm rounded-xl px-5 text-base-content/65 hover:bg-base-200 hover:text-base-content"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-sm min-w-32 rounded-xl px-5"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update Goal"
            ) : (
              "Create Goal"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({ number, title, description }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">
        {number}
      </div>

      <div>
        <h3 className="text-lg font-bold leading-6 text-base-content">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-5 text-base-content/55">
          {description}
        </p>
      </div>
    </div>
  );
};

export default GoalForm;
