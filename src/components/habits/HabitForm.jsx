import { useState } from "react";
import { useDispatch } from "react-redux";

import { addHabit, editHabit } from "../../redux/habitSlice";
import AlertMessage from "../../layout/AlertMessage";

const getInitialForm = (habit) => ({
  habitName: habit?.habitName || "",
  description: habit?.description || "",
  category: habit?.category || "Personal",
  type: habit?.type || "boolean",
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
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const isEditing = Boolean(habit);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
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

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // ================= VALIDATION =================

    if (!form.habitName.trim()) {
      setMessageType("error");
      setMessage("Habit name is required.");
      return;
    }

    if (
      form.type !== "boolean" &&
      (form.target === "" || Number(form.target) <= 0)
    ) {
      setMessageType("error");
      setMessage("Please enter a valid target.");
      return;
    }

    if (form.frequency === "custom" && form.scheduledDays.length === 0) {
      setMessageType("error");
      setMessage("Select at least one scheduled day.");
      return;
    }

    // ================= PAYLOAD =================

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

    setLoading(true);

    try {
      if (isEditing) {
        await dispatch(
          editHabit({
            id: habit._id,
            data: payload,
          }),
        ).unwrap();

        setMessageType("success");
        setMessage("Habit updated successfully!");
      } else {
        await dispatch(addHabit(payload)).unwrap();

        setMessageType("success");
        setMessage("Habit created successfully!");
      }

      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      console.error("Habit save error:", err);

      setMessageType("error");
      setMessage(
        typeof err === "string" ? err : err?.message || "Failed to save habit.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <div className="p-5 sm:p-6">
        {/* ================= HEADER ================= */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
              🌱
            </div>

            <div>
              <h2 className="text-xl font-semibold text-base-content">
                {isEditing ? "Edit Habit" : "Create New Habit"}
              </h2>

              <p className="mt-1 text-sm text-base-content/60">
                Build a habit that moves you forward.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ================= HABIT NAME ================= */}

          <div className="form-control">
            <label htmlFor="habit-name" className="label">
              <span className="label-text font-medium text-base-content">
                Habit Name
              </span>
            </label>

            <input
              id="habit-name"
              type="text"
              name="habitName"
              value={form.habitName}
              onChange={handleChange}
              placeholder="e.g. Read a book"
              className="input input-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
            />
          </div>

          {/* ================= DESCRIPTION ================= */}

          <div className="form-control">
            <label htmlFor="habit-description" className="label">
              <span className="label-text font-medium text-base-content">
                Description
              </span>

              <span className="label-text-alt text-base-content/40">
                Optional
              </span>
            </label>

            <textarea
              id="habit-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What do you want to accomplish?"
              rows={3}
              className="textarea textarea-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
            />
          </div>

          {/* ================= CATEGORY + TYPE ================= */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Category */}

            <div className="form-control">
              <label htmlFor="habit-category" className="label">
                <span className="label-text font-medium text-base-content">
                  Category
                </span>
              </label>

              <select
                id="habit-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="select select-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none"
              >
                <option value="Spiritual">Spiritual</option>
                <option value="Skills">Skills</option>
                <option value="Physical">Physical</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            {/* Type */}

            <div className="form-control">
              <label htmlFor="habit-type" className="label">
                <span className="label-text font-medium text-base-content">
                  Habit Type
                </span>
              </label>

              <select
                id="habit-type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="select select-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none"
              >
                <option value="boolean">Boolean — Done / Not Done</option>

                <option value="count">Count — e.g. 8 glasses</option>

                <option value="duration">Duration — e.g. 30 minutes</option>

                <option value="rating">Rating — e.g. 1–5</option>
              </select>
            </div>
          </div>

          {/* ================= TARGET + UNIT ================= */}

          {form.type !== "boolean" && (
            <div className="rounded-xl bg-base-200 p-4">
              <div className="mb-3">
                <p className="text-sm font-semibold text-base-content">
                  Measurement
                </p>

                <p className="mt-0.5 text-xs text-base-content/50">
                  Define how you want to measure this habit.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Target */}

                <div className="form-control">
                  <label htmlFor="habit-target" className="label">
                    <span className="label-text font-medium text-base-content">
                      Target
                    </span>
                  </label>

                  <input
                    id="habit-target"
                    type="number"
                    name="target"
                    value={form.target}
                    onChange={handleChange}
                    min="0"
                    step="any"
                    placeholder="e.g. 30"
                    className="input input-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Unit */}

                <div className="form-control">
                  <label htmlFor="habit-unit" className="label">
                    <span className="label-text font-medium text-base-content">
                      Unit
                    </span>
                  </label>

                  <input
                    id="habit-unit"
                    type="text"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    placeholder="e.g. minutes"
                    className="input input-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= FREQUENCY ================= */}

          <div className="form-control">
            <label htmlFor="habit-frequency" className="label">
              <span className="label-text font-medium text-base-content">
                Frequency
              </span>
            </label>

            <select
              id="habit-frequency"
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="select select-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom Days</option>
            </select>
          </div>

          {/* ================= CUSTOM DAYS ================= */}

          {form.frequency === "custom" && (
            <div className="rounded-xl bg-base-200 p-4">
              <div className="mb-3">
                <p className="text-sm font-semibold text-base-content">
                  Scheduled Days
                </p>

                <p className="mt-0.5 text-xs text-base-content/50">
                  Choose the days you want to practice this habit.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => {
                  const selected = form.scheduledDays.includes(day.value);

                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayChange(day.value)}
                      className={`btn btn-sm min-w-14 ${
                        selected
                          ? "btn-primary"
                          : "border-base-300 bg-base-100 text-base-content/70 hover:border-primary hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {selected && "✓ "}
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= ACTIONS ================= */}

          <div className="flex flex-col-reverse gap-2 border-t border-base-300 pt-5 sm:flex-row sm:justify-end">
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
              className="btn btn-primary min-w-36"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
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
