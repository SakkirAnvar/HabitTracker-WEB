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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error while editing the form
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // ================= VALIDATION =================

    if (!form.title.trim()) {
      setError("Goal title is required.");
      return;
    }

    if (!form.target || Number(form.target) <= 0) {
      setError("Target must be greater than 0.");
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

    // ================= PAYLOAD =================

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
      }, 2000);
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
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6"
    >
      {/* ================= HEADER ================= */}

      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
          🎯
        </div>

        <div>
          <h2 className="text-xl font-semibold text-base-content">
            {isEditing ? "Edit Goal" : "Create New Goal"}
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            {isEditing
              ? "Update your goal details and keep moving forward."
              : "Set a clear target and turn your intentions into progress."}
          </p>
        </div>
      </div>

      {/* ================= ALERT ================= */}

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

      {/* ================= VALIDATION ERROR ================= */}

      {error && (
        <div className="mb-5 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error">
          {error}
        </div>
      )}

      {/* ================= TITLE ================= */}

      <div className="form-control">
        <label htmlFor="goal-title" className="label">
          <span className="label-text font-medium text-base-content">
            Goal Title
          </span>
        </label>

        <input
          id="goal-title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Complete 20 workouts"
          className="input input-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
        />
      </div>

      {/* ================= DESCRIPTION ================= */}

      <div className="form-control mt-4">
        <label htmlFor="goal-description" className="label">
          <span className="label-text font-medium text-base-content">
            Description
          </span>

          <span className="label-text-alt text-base-content/40">Optional</span>
        </label>

        <textarea
          id="goal-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe what you want to accomplish..."
          rows={3}
          className="textarea textarea-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
        />
      </div>

      {/* ================= TARGET + UNIT ================= */}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Target */}

        <div className="form-control">
          <label htmlFor="goal-target" className="label">
            <span className="label-text font-medium text-base-content">
              Target
            </span>
          </label>

          <input
            id="goal-target"
            type="number"
            name="target"
            value={form.target}
            onChange={handleChange}
            min="1"
            placeholder="20"
            className="input input-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Unit */}

        <div className="form-control">
          <label htmlFor="goal-unit" className="label">
            <span className="label-text font-medium text-base-content">
              Unit
            </span>
          </label>

          <input
            id="goal-unit"
            type="text"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="workouts"
            className="input input-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* ================= DATES ================= */}

      <div className="mt-4 rounded-xl bg-base-200 p-4">
        <p className="mb-3 text-sm font-semibold text-base-content">
          Goal Timeline
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Start Date */}

          <div className="form-control">
            <label htmlFor="goal-start-date" className="label">
              <span className="label-text font-medium text-base-content">
                Start Date
              </span>
            </label>

            <input
              id="goal-start-date"
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="input input-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none"
            />
          </div>

          {/* Deadline */}

          <div className="form-control">
            <label htmlFor="goal-deadline" className="label">
              <span className="label-text font-medium text-base-content">
                Deadline
              </span>
            </label>

            <input
              id="goal-deadline"
              type="date"
              name="deadLine"
              value={form.deadLine}
              onChange={handleChange}
              className="input input-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Goal"
          ) : (
            "Create Goal"
          )}
        </button>
      </div>
    </form>
  );
};

export default GoalForm;
