import { useState } from "react";
import { useDispatch } from "react-redux";
import { addGoal, editGoal } from "../../redux/goalSlice";

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

  const isEditing = Boolean(goal);

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

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      target: Number(form.target),
      unit: form.unit.trim(),
      startDate: form.startDate,
      deadLine: form.deadLine,
    };

    try {
      if (isEditing) {
        await dispatch(
          editGoal({
            id: goal._id,
            data: payload,
          }),
        ).unwrap();
      } else {
        await dispatch(addGoal(payload)).unwrap();
      }

      onSuccess?.();
    } catch (err) {
      setError(err?.message || err?.payload?.message || "Failed to save goal.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm"
    >
      <h2 className="mb-5 text-xl font-semibold">
        {isEditing ? "Edit Goal" : "Create Goal"}
      </h2>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Title */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-medium">Goal Title</span>
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Complete 20 workouts"
          className="input input-bordered w-full"
        />
      </div>

      {/* Description */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-medium">Description</span>
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your goal..."
          className="textarea textarea-bordered w-full"
          rows={3}
        />
      </div>

      {/* Target + Unit */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Target</span>
          </label>

          <input
            type="number"
            name="target"
            value={form.target}
            onChange={handleChange}
            min="1"
            placeholder="20"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Unit</span>
          </label>

          <input
            type="text"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="workouts"
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Start Date</span>
          </label>

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Deadline</span>
          </label>

          <input
            type="date"
            name="deadLine"
            value={form.deadLine}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-ghost">
            Cancel
          </button>
        )}

        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Goal" : "Create Goal"}
        </button>
      </div>
    </form>
  );
};

export default GoalForm;
