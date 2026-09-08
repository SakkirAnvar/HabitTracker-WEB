import { useState } from "react";
import { useDispatch } from "react-redux";
import { addHabit, editHabit } from "../../redux/habitSlice";

const getInitialForm = (habit) => ({
  habitName: habit?.habitName || "",
  description: habit?.description || "",
  category: habit?.category || "Personal",
  habitType: habit?.habitType || "boolean",
  frequency: habit?.frequency || "daily",
  target: habit?.target ?? "",
  unit: habit?.unit || "",
  scheduledDays: habit?.scheduledDays || [],
});

const weekDays = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

const HabitForm = ({ habit = null, onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState(() => getInitialForm(habit));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(habit);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDayChange = (day) => {
    setForm((prev) => {
      const alreadySelected = prev.scheduledDays.includes(day);

      return {
        ...prev,
        scheduledDays: alreadySelected
          ? prev.scheduledDays.filter((selectedDay) => selectedDay !== day)
          : [...prev.scheduledDays, day],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.habitName.trim()) {
      setError("Habit name is required.");
      return;
    }

    if (form.frequency === "custom" && form.scheduledDays.length === 0) {
      setError("Select at least one scheduled day.");
      return;
    }

    if (
      form.type !== "boolean" &&
      (form.target === "" || Number(form.target) <= 0)
    ) {
      setError("Please enter a valid target.");
      return;
    }

    const payload = {
      habitName: form.habitName.trim(),
      description: form.description.trim(),
      category: form.category,
      type: form.type,
      frequency: form.frequency,

      ...(form.type !== "boolean" && {
        target: Number(form.target),
        unit: form.unit.trim(),
      }),

      scheduledDays: form.frequency === "custom" ? form.scheduledDays : [],
    };

    try {
      setLoading(true);

      if (isEditing) {
        await dispatch(
          editHabit({
            id: habit._id,
            data: payload,
          }),
        ).unwrap();
      } else {
        await dispatch(addHabit(payload)).unwrap();
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        typeof err === "string" ? err : err?.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full bg-base-100 shadow-sm">
      <div className="card-body">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2 className="card-title">
              {isEditing ? "Edit Habit" : "Create New Habit"}
            </h2>

            <p className="text-sm text-base-content/60">
              Build a habit that moves you forward.
            </p>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-sm btn-ghost"
            >
              ✕
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error mb-3">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Habit Name</span>
            </label>

            <input
              type="text"
              name="habitName"
              value={form.habitName}
              onChange={handleChange}
              placeholder="e.g. Read a book"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What do you want to accomplish?"
              className="textarea textarea-bordered w-full"
              rows="3"
            />
          </div>

          {/* Category */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Category</span>
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Spiritual">Spiritual</option>
              <option value="Skills">Skills</option>
              <option value="Physical">Physical</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          {/* Habit Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Habit Type</span>
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="boolean">Boolean — Done / Not Done</option>

              <option value="numeric">Numeric — e.g. 8 glasses</option>

              <option value="duration">Duration — e.g. 30 minutes</option>

              <option value="rating">Rating — e.g. 1–5</option>
            </select>
          </div>

          {/* Target and Unit */}
          {form.type !== "boolean" && (
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
                  min="0"
                  step="any"
                  placeholder="e.g. 30"
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
                  placeholder="e.g. minutes"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          )}

          {/* Frequency */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Frequency</span>
            </label>

            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom Days</option>
            </select>
          </div>

          {/* Custom Days */}
          {form.frequency === "custom" && (
            <div>
              <label className="label">
                <span className="label-text font-medium">Scheduled Days</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => {
                  const selected = form.scheduledDays.includes(day.value);

                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayChange(day.value)}
                      className={`btn btn-sm ${
                        selected ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-ghost"
                disabled={loading}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : isEditing ? (
                "Update Habit"
              ) : (
                "Create Habit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;
