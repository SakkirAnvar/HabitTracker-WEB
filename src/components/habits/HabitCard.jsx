import { DeleteIcon, EditIcon } from "../goals/GoalCard";
import HabitProgress from "./HabitProgress";

const HabitCard = ({
  habit,
  existingLog,
  onDelete,
  onEdit,
  onArchive,
  isArchived = false,
  onProgressSuccess,
}) => {
  const category = getCategoryConfig(habit.category);

  return (
    <article
      className="
        group flex h-full flex-col overflow-hidden
        rounded-2xl border border-base-300/70
        bg-base-100
        shadow-[0_1px_2px_rgba(0,0,0,0.02)]
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-base-content/10
        hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]
      "
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          {/* Category icon */}
          <div
            className={`
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-xl
              ${category.iconBg}
            `}
          >
            <span className="text-lg leading-none">{category.icon}</span>
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2
                  className="
                    truncate
                    text-[17px]
                    font-bold
                    tracking-[-0.02em]
                    text-base-content
                  "
                >
                  {habit.habitName}
                </h2>

                {habit.description && (
                  <p
                    className="
                      mt-1
                      line-clamp-1
                      text-sm
                      leading-5
                      text-base-content/45
                    "
                  >
                    {habit.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              {(onEdit || onArchive || onDelete) && (
                <div className="dropdown dropdown-end shrink-0">
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label="Habit options"
                    className="
                      flex h-8 w-8 items-center justify-center
                      rounded-lg
                      text-base-content/30
                      transition
                      hover:bg-base-200
                      hover:text-base-content
                    "
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <circle cx="5" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="19" cy="12" r="1.5" />
                    </svg>
                  </button>

                  <ul
                    tabIndex={0}
                    className="
                      dropdown-content
                      menu
                      z-50
                      mt-2
                      w-40
                      rounded-xl
                      border border-base-300
                      bg-base-100
                      p-1.5
                      shadow-xl
                    "
                  >
                    {onEdit && (
                      <li>
                        <button type="button" onClick={() => onEdit(habit)}>
                          <EditIcon />
                          Edit
                        </button>
                      </li>
                    )}

                    {onArchive && (
                      <li>
                        <button
                          type="button"
                          onClick={() => onArchive(habit)}
                          className={
                            isArchived
                              ? "text-success hover:bg-success/10"
                              : "text-warning hover:bg-warning/10"
                          }
                        >
                          {isArchived ? <RestoreIcon /> : <ArchiveIcon />}

                          {isArchived ? "Restore" : "Archive"}
                        </button>
                      </li>
                    )}

                    {onDelete && (
                      <li>
                        <button
                          type="button"
                          onClick={() => onDelete(habit)}
                          className="text-error hover:bg-error/10"
                        >
                          <DeleteIcon />
                          Delete
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span
                className={`
                  rounded-full
                  border
                  px-2.5 py-1
                  text-[10px]
                  font-semibold
                  ${category.badge}
                `}
              >
                {habit.category}
              </span>

              <span
                className="
                  rounded-full
                  border border-base-300
                  bg-base-200/30
                  px-2.5 py-1
                  text-[10px]
                  font-medium
                  text-base-content/50
                "
              >
                {formatFrequency(habit.frequency)}
              </span>

              {habit.type !== "boolean" && (
                <span
                  className="
                    rounded-full
                    border border-base-300
                    bg-base-200/30
                    px-2.5 py-1
                    text-[10px]
                    font-medium
                    text-base-content/50
                  "
                >
                  {formatType(habit.type)}
                </span>
              )}

              {habit.streak > 0 && (
                <span
                  className="
                    inline-flex items-center gap-1
                    rounded-full
                    border border-primary/10
                    bg-primary/5
                    px-2.5 py-1
                    text-[10px]
                    font-semibold
                    text-primary
                  "
                >
                  <StreakIcon />
                  {habit.streak}d
                </span>
              )}
            </div>

            {/* Custom schedule */}
            {habit.frequency === "custom" && getCustomScheduleText(habit) && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-primary/70">
                  <CalendarIcon />
                </span>

                <span className="text-xs text-base-content/45">
                  {getCustomScheduleText(habit)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto px-5 pb-5 sm:px-6 sm:pb-6">
        <div
          className="
            overflow-hidden
            rounded-2xl
            border border-base-300/70
            bg-base-200/20
          "
        >
          <HabitProgress
            key={`${habit._id}-${existingLog?._id || "empty"}`}
            habit={habit}
            existingLog={existingLog}
            isArchived={isArchived}
            onSuccess={onProgressSuccess}
          />
        </div>
      </div>
    </article>
  );
};

const getCategoryConfig = (category) => {
  switch (category) {
    case "Physical":
      return {
        icon: "🏃",
        iconBg: "bg-success/10 text-success",
        badge: "border-success/20 bg-success/10 text-success",
      };

    case "Spiritual":
      return {
        icon: "🕊️",
        iconBg: "bg-secondary/10 text-secondary",
        badge: "border-secondary/20 bg-secondary/10 text-secondary",
      };

    case "Skills":
      return {
        icon: "🎯",
        iconBg: "bg-info/10 text-info",
        badge: "border-info/20 bg-info/10 text-info",
      };

    case "Personal":
      return {
        icon: "🌿",
        iconBg: "bg-primary/10 text-primary",
        badge: "border-primary/20 bg-primary/10 text-primary",
      };

    default:
      return {
        icon: "✨",
        iconBg: "bg-base-200 text-base-content/60",
        badge: "border-base-300 bg-base-200 text-base-content/60",
      };
  }
};

const formatType = (type) => {
  switch (type) {
    case "boolean":
      return "Done";

    case "count":
    case "numeric":
      return "Count";

    case "duration":
      return "Duration";

    case "rating":
      return "Rating";

    default:
      return type;
  }
};

const formatFrequency = (frequency) => {
  switch (frequency) {
    case "daily":
      return "Daily";

    case "weekly":
      return "Weekly";

    case "monthly":
      return "Monthly";

    case "custom":
      return "Custom";

    default:
      return frequency;
  }
};

const getCustomScheduleText = (habit) => {
  const scheduledDays = Array.isArray(habit.scheduledDays)
    ? habit.scheduledDays
    : [];

  const scheduledDates = Array.isArray(habit.scheduledDates)
    ? habit.scheduledDates
    : [];

  const dayLabels = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  };

  const days = scheduledDays
    .map((day) => dayLabels[day?.toLowerCase()])
    .filter(Boolean);

  const dates = scheduledDates
    .map(Number)
    .filter((date) => Number.isInteger(date) && date >= 1 && date <= 31)
    .sort((a, b) => a - b)
    .map(formatOrdinal);

  if (days.length > 0 && dates.length > 0) {
    return `${days.join(" · ")} · ${dates.join(" · ")} of each month`;
  }

  if (days.length > 0) {
    return days.join(" · ");
  }

  if (dates.length > 0) {
    return `${dates.join(" · ")} of each month`;
  }

  return "";
};

const formatOrdinal = (number) => {
  const value = Number(number);

  if (value % 100 >= 11 && value % 100 <= 13) {
    return `${value}th`;
  }

  switch (value % 10) {
    case 1:
      return `${value}st`;

    case 2:
      return `${value}nd`;

    case 3:
      return `${value}rd`;

    default:
      return `${value}th`;
  }
};

const StreakIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-3.5 w-3.5"
    aria-hidden="true"
  >
    <path d="M13.2 2.5c.2 3.1-1.1 4.7-2.5 6.1-.9.9-1.7 1.8-1.7 3.2 0 1.1.6 2 1.5 2.5-.1-1.7.7-2.8 1.8-3.8.5 1.6 2.7 2.7 2.7 5.2 0 1.3-.6 2.5-1.6 3.3 2.8-.6 4.8-3 4.8-6 0-3.6-2.5-6.7-5-10.5Z" />
    <path d="M8.2 14.2c-1.2 1.1-2 2.7-2 4.2 0 2.2 1.8 4 4 4-1.3-.9-2-2.2-2-3.7 0-1.7.8-3.1 0-4.5Z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-3.5 w-3.5"
  >
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
  </svg>
);

const ArchiveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7.5h18M5 7.5l1 12h12l1-12M9 11.5h6M9 4h6l1 3.5H8L9 4z"
    />
  </svg>
);

const RestoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12a9 9 0 1 0 3-6.7"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4v5h5" />
  </svg>
);

export default HabitCard;
