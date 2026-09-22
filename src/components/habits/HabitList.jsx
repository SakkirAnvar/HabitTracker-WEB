import HabitCard from "./HabitCard";

const HabitList = ({
  habits,
  logs,
  onDelete,
  onEdit,
  onArchive,
  isArchived = false,
  onProgressSuccess,
}) => {
  if (!habits || habits.length === 0) {
  return (
    <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
        {isArchived ? "📦" : "🌱"}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-base-content">
        {isArchived ? "No archived habits" : "No habits yet"}
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-base-content/60">
        {isArchived
          ? "Habits you archive will appear here."
          : "Start small and build better days, one habit at a time."}
      </p>
    </div>
  );
}

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {habits.map((habit) => {
        const habitLog = logs?.find(
          (log) => log.habitId === habit._id || log.habitId?._id === habit._id,
        );

        return (
          <HabitCard
            key={habit._id}
            habit={habit}
            existingLog={habitLog}
            onDelete={onDelete}
            onEdit={onEdit}
            onArchive={onArchive}
            isArchived={isArchived}
            onProgressSuccess={onProgressSuccess}
          />
        );
      })}
    </div>
  );
};

export default HabitList;
