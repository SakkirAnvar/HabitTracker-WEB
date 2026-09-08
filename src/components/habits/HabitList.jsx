import HabitCard from "./HabitCard";

const HabitList = ({ habits, onToggle, onDelete, onEdit }) => {
  if (!habits || habits.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-base-300 bg-base-100 p-10 text-center">
        <div className="text-4xl">🌱</div>

        <h3 className="mt-3 text-lg font-semibold">No habits yet</h3>

        <p className="mt-1 text-sm text-base-content/60">
          Start by creating your first habit.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {habits.map((habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default HabitList;
