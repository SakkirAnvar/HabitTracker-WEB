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
  scheduledDates: habit?.scheduledDates?.map(Number) || [],
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

const scheduleOptions = [
  {
    value: "days",
    title: "Days of the week",
    description: "Repeat on specific weekdays",
  },
  {
    value: "dates",
    title: "Dates of the month",
    description: "Repeat on specific dates",
  },
];

const monthDates = Array.from({ length: 31 }, (_, index) => index + 1);

const habitTypes = [
  {
    value: "boolean",
    icon: "✓",
    title: "Boolean",
    description: "Done / Not Done",
  },
  {
    value: "count",
    icon: "#",
    title: "Count",
    description: "Track a number",
    example: "e.g. 8 glasses",
  },
  {
    value: "duration",
    icon: "◷",
    title: "Duration",
    description: "Track time",
    example: "e.g. 30 minutes",
  },
  {
    value: "rating",
    icon: "☆",
    title: "Rating",
    description: "Rate on a scale",
    example: "e.g. 1–5",
  },
];

const HabitForm = ({ habit = null, onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState(() => getInitialForm(habit));

  const [scheduleMode, setScheduleMode] = useState(() =>
    habit?.scheduledDates?.length > 0 ? "dates" : "days",
  );

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

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
      ...(type === "boolean"
        ? {
            target: "",
            unit: "",
          }
        : {}),
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

  const handleScheduleModeChange = (mode) => {
    setScheduleMode(mode);

    setForm((prev) => ({
      ...prev,
      scheduledDays: mode === "days" ? prev.scheduledDays : [],
      scheduledDates: mode === "dates" ? prev.scheduledDates : [],
    }));

    setMessage("");
  };

  const handleDateChange = (date) => {
    setForm((prev) => {
      const numericDate = Number(date);
      const alreadySelected = prev.scheduledDates.includes(numericDate);

      return {
        ...prev,
        scheduledDates: alreadySelected
          ? prev.scheduledDates.filter(
              (selectedDate) => selectedDate !== numericDate,
            )
          : [...prev.scheduledDates, numericDate].sort((a, b) => a - b),
      };
    });

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

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

    if (form.frequency === "custom") {
      const hasSchedule =
        scheduleMode === "days"
          ? form.scheduledDays.length > 0
          : form.scheduledDates.length > 0;

      if (!hasSchedule) {
        setMessageType("error");
        setMessage(
          scheduleMode === "days"
            ? "Select at least one day."
            : "Select at least one date.",
        );
        return;
      }
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

      scheduledDays:
        form.frequency === "custom" && scheduleMode === "days"
          ? form.scheduledDays
          : [],

      scheduledDates:
        form.frequency === "custom" && scheduleMode === "dates"
          ? form.scheduledDates
          : [],
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
    <div className="w-full">
      <section className="relative mb-6 overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-5 sm:p-7">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border-[14px] border-primary/10" />

        <div className="pointer-events-none absolute -bottom-8 right-24 h-20 w-20 rounded-full bg-secondary/10" />

        <div className="pointer-events-none absolute right-6 top-6 text-4xl text-primary/10">
          ✦
        </div>

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <div className="flex min-w-0 items-start gap-4">
            <div className="min-w-0">
               <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {isEditing ? "Refine your routine" : "Build your routine"}
              </span>
            </div>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
                {isEditing ? "Edit Habit" : "Create a New Habit"}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/60">
                {isEditing
                  ? "Update your habit details and keep building consistency."
                  : "Choose one small action and make it part of your everyday routine."}
              </p>
            </div>
          </div>

          {/* Back button */}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-outline btn-sm shrink-0 self-start rounded-xl sm:self-center"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Habits
            </button>
          )}
        </div>
      </section>

      <div className="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        <form onSubmit={handleSubmit}>
          {/* Alert */}
          {message && (
            <div className="border-b border-base-300 px-5 py-4 sm:px-8">
              <AlertMessage
                type={messageType}
                message={message}
                duration={3000}
                onClose={() => setMessage("")}
              />
            </div>
          )}

          <div className="p-5 sm:p-8 lg:p-10">
            <FormSection
              number="1"
              title="Basic Information"
              description="Give your habit a clear name and description."
            >
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Habit Name */}
                <div className="form-control">
                  <label
                    htmlFor="habit-name"
                    className="mb-2 block text-sm font-semibold text-base-content"
                  >
                    Habit Name
                    <span className="ml-1 text-error">*</span>
                  </label>

                  <div className="relative">
                    <input
                      id="habit-name"
                      type="text"
                      name="habitName"
                      value={form.habitName}
                      autoComplete="off"
                      onChange={handleChange}
                      maxLength={50}
                      placeholder="e.g. Read a book"
                      className="input input-bordered h-12 w-full border-base-300 bg-base-100 pr-14 text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-base-content/40">
                      {form.habitName.length}/50
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div className="form-control">
                  <label
                    htmlFor="habit-category"
                    className="mb-2 block text-sm font-semibold text-base-content"
                  >
                    Category
                    <span className="ml-1 text-error">*</span>
                  </label>

                  <select
                    id="habit-category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="select select-bordered h-12 w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="Spiritual">Spiritual</option>

                    <option value="Skills">Skills</option>

                    <option value="Physical">Physical</option>

                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="form-control mt-5">
                <label
                  htmlFor="habit-description"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  Description
                  <span className="ml-1 font-normal text-base-content/40">
                    (Optional)
                  </span>
                </label>

                <div className="relative">
                  <textarea
                    id="habit-description"
                    name="description"
                    autoComplete="off"
                    value={form.description}
                    onChange={handleChange}
                    maxLength={200}
                    placeholder="What do you want to accomplish?"
                    rows={4}
                    className="textarea textarea-bordered min-h-28 w-full resize-none border-base-300 bg-base-100 pb-8 text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />

                  <span className="absolute bottom-2 right-3 text-[11px] text-base-content/40">
                    {form.description.length}/200
                  </span>
                </div>
              </div>
            </FormSection>

            <div className="mt-8">
              <FormSection
                number="2"
                title="Habit Type"
                description="Choose how you want to track this habit."
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {habitTypes.map((type) => {
                    const selected = form.type === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleTypeChange(type.value)}
                        className={`relative min-h-28 rounded-2xl border p-4 text-left transition-all duration-200 ${
                          selected
                            ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                            : "border-base-300 bg-base-100 hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        {selected && (
                          <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">
                            ✓
                          </span>
                        )}

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl font-semibold ${
                            selected
                              ? "bg-primary/10 text-primary"
                              : "bg-base-200 text-base-content/70"
                          }`}
                        >
                          {type.icon}
                        </div>

                        <p className="mt-3 text-sm font-bold text-base-content">
                          {type.title}
                        </p>

                        <p className="mt-0.5 text-xs text-base-content/55">
                          {type.description}
                        </p>

                        {type.example && (
                          <p className="mt-0.5 text-[11px] text-base-content/40">
                            {type.example}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {form.type !== "boolean" && (
                  <div className="mt-5 rounded-2xl bg-base-200/70 p-5">
                    <div className="mb-4">
                      <p className="text-sm font-bold text-base-content">
                        Measurement
                      </p>

                      <p className="mt-1 text-xs text-base-content/50">
                        Define how you want to measure this habit.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Target */}
                      <div className="form-control">
                        <label
                          htmlFor="habit-target"
                          className="mb-2 block text-sm font-medium text-base-content"
                        >
                          Target
                        </label>

                        <input
                          id="habit-target"
                          type="number"
                          name="target"
                          value={form.target}
                          onChange={handleChange}
                          min="0"
                          step="any"
                          placeholder={
                            form.type === "rating" ? "e.g. 5" : "e.g. 30"
                          }
                          className="input input-bordered h-12 w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none"
                        />
                      </div>

                      {/* Unit */}
                      <div className="form-control">
                        <label
                          htmlFor="habit-unit"
                          className="mb-2 block text-sm font-medium text-base-content"
                        >
                          Unit
                        </label>

                        <input
                          id="habit-unit"
                          type="text"
                          name="unit"
                          value={form.unit}
                          autoComplete="off"
                          onChange={handleChange}
                          placeholder={
                            form.type === "duration"
                              ? "e.g. minutes"
                              : "e.g. glasses"
                          }
                          className="input input-bordered h-12 w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </FormSection>
            </div>

            <div className="mt-8">
              <FormSection
                number="3"
                title="Schedule"
                description="How often do you want to do this habit?"
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
                  {/* Frequency */}
                  <div className="form-control">
                    <label
                      htmlFor="habit-frequency"
                      className="mb-2 block text-sm font-semibold text-base-content"
                    >
                      Frequency
                    </label>

                    <select
                      id="habit-frequency"
                      name="frequency"
                      value={form.frequency}
                      onChange={handleChange}
                      className="select select-bordered h-12 w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="daily">Daily</option>

                      <option value="weekly">Weekly</option>

                      <option value="monthly">Monthly</option>

                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {/* Schedule Tip */}
                  <div className="hidden rounded-2xl bg-primary/10 p-4 lg:flex lg:items-center lg:gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
                      📅
                    </div>

                    <div>
                      <p className="text-sm font-bold text-primary">
                        Start with daily
                      </p>

                      <p className="mt-0.5 text-xs text-base-content/55">
                        Daily habits are easier to build consistently.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Custom Schedule */}
                {form.frequency === "custom" && (
                  <div className="mt-5 rounded-2xl border border-base-300 bg-base-200/50 p-5 sm:p-6">
                    <div className="mb-5">
                      <p className="text-sm font-bold text-base-content">
                        Choose your schedule
                      </p>

                      <p className="mt-1 text-xs text-base-content/50">
                        Select how you want this habit to repeat.
                      </p>
                    </div>

                    {/* Schedule Type */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {scheduleOptions.map((option) => {
                        const selected = scheduleMode === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              handleScheduleModeChange(option.value)
                            }
                            className={`group relative rounded-2xl border p-4 text-left transition-all duration-200 ${
                              selected
                                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                                : "border-base-300 bg-base-100 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <div
                              className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold transition ${
                                selected
                                  ? "border-primary bg-primary text-primary-content"
                                  : "border-base-300 bg-base-100 text-transparent"
                              }`}
                            >
                              ✓
                            </div>

                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                                selected
                                  ? "bg-primary/10 text-primary"
                                  : "bg-base-200 text-base-content/60 group-hover:bg-primary/10 group-hover:text-primary"
                              }`}
                            >
                              {option.value === "days" ? (
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  className="h-5 w-5"
                                >
                                  <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="17"
                                    rx="2"
                                  />
                                  <path
                                    d="M16 2v4M8 2v4M3 10h18"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  className="h-5 w-5"
                                >
                                  <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="17"
                                    rx="2"
                                  />
                                  <path
                                    d="M16 2v4M8 2v4M3 10h18"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M8 14h8M8 18h5"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              )}
                            </div>

                            <p className="mt-3 pr-8 text-sm font-bold text-base-content">
                              {option.title}
                            </p>

                            <p className="mt-1 pr-6 text-xs leading-5 text-base-content/50">
                              {option.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Weekdays */}
                    {scheduleMode === "days" && (
                      <div className="mt-5 rounded-2xl border border-base-300 bg-base-100 p-5">
                        <div className="mb-4">
                          <p className="text-sm font-bold text-base-content">
                            Select days
                          </p>

                          <p className="mt-1 text-xs text-base-content/50">
                            Choose the weekdays for this habit.
                          </p>
                        </div>

                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                          {weekDays.map((day) => {
                            const selected = form.scheduledDays.includes(
                              day.value,
                            );

                            return (
                              <button
                                key={day.value}
                                type="button"
                                onClick={() => handleDayChange(day.value)}
                                className={`h-11 rounded-xl border text-sm font-semibold transition-all ${
                                  selected
                                    ? "border-primary bg-primary text-primary-content shadow-sm"
                                    : "border-base-300 bg-base-100 text-base-content/60 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                                }`}
                              >
                                {selected && <span className="mr-1">✓</span>}
                                {day.label}
                              </button>
                            );
                          })}
                        </div>

                        {form.scheduledDays.length > 0 && (
                          <p className="mt-4 text-xs font-medium text-primary">
                            {form.scheduledDays.length}{" "}
                            {form.scheduledDays.length === 1 ? "day" : "days"}{" "}
                            selected
                          </p>
                        )}
                      </div>
                    )}

                    {/* Dates of month */}
                    {scheduleMode === "dates" && (
                      <div className="mt-5 rounded-2xl border border-base-300 bg-base-100 p-5">
                        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <p className="text-sm font-bold text-base-content">
                              Select dates
                            </p>

                            <p className="mt-1 text-xs text-base-content/50">
                              Choose recurring dates from 1 to 31.
                            </p>
                          </div>

                          <span className="text-[11px] font-medium text-base-content/40">
                            {form.scheduledDates.length}{" "}
                            {form.scheduledDates.length === 1
                              ? "date"
                              : "dates"}{" "}
                            selected
                          </span>
                        </div>

                        <div className="grid grid-cols-7 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
                          {monthDates.map((date) => {
                            const selected = form.scheduledDates.includes(date);

                            return (
                              <button
                                key={date}
                                type="button"
                                onClick={() => handleDateChange(date)}
                                className={`flex h-10 items-center justify-center rounded-xl border text-sm font-semibold transition-all ${
                                  selected
                                    ? "border-primary bg-primary text-primary-content shadow-sm"
                                    : "border-base-300 bg-base-100 text-base-content/60 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                                }`}
                              >
                                {date}
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-4 rounded-xl bg-primary/5 px-4 py-3">
                          <p className="text-xs leading-5 text-base-content/55">
                            <span className="font-semibold text-primary">
                              Note:
                            </span>{" "}
                            When a selected date does not exist in a month, it
                            moves to the 1st of the following month. For
                            example, the 31st moves to the 1st after a month
                            without a 31st.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </FormSection>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-base-300 bg-base-200/30 px-5 py-5 sm:flex-row sm:justify-end sm:px-8 lg:px-10">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="btn h-12 border-base-300 bg-base-100 px-6 text-base-content/70 hover:bg-base-200 hover:text-base-content"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary h-12 min-w-40 rounded-xl px-6"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditing ? "Update Habit" : "Create Habit"}

                  <span className="text-lg">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormSection = ({ number, title, description, children }) => {
  return (
    <section className="border-b border-base-300 pb-8 last:border-b-0 last:pb-0">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">
          {number}
        </div>

        <div>
          <h2 className="text-lg font-bold text-base-content">{title}</h2>

          <p className="mt-0.5 text-sm text-base-content/55">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
};

export default HabitForm;
