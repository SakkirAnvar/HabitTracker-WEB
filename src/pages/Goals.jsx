import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchGoals, removeGoal } from "../redux/goalSlice";

import { fetchHabits } from "../redux/habitSlice";

import GoalForm from "../components/goals/GoalForm";
import GoalCard from "../components/goals/GoalCard";
import GoalProgress from "../components/goals/GoalProgress";

const Goals = () => {
  const dispatch = useDispatch();

  const { goals, status, error } = useSelector((store) => store.goal);

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [viewingGoal, setViewingGoal] = useState(null);

  useEffect(() => {
    dispatch(fetchGoals());
    dispatch(fetchHabits());
  }, [dispatch]);

  const handleCreate = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = async (goalId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?",
    );

    if (!confirmed) return;

    try {
      await dispatch(removeGoal(goalId)).unwrap();

      if (viewingGoal?._id === goalId) {
        setViewingGoal(null);
      }
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  const handleViewProgress = (goal) => {
    setViewingGoal(goal);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Goals</h1>

          <p className="mt-1 text-sm text-base-content/60">
            Set meaningful goals and track your progress.
          </p>
        </div>

        {!showForm && (
          <button onClick={handleCreate} className="btn btn-primary">
            + Create Goal
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          <span>
            {typeof error === "string"
              ? error
              : "Something went wrong while loading goals."}
          </span>
        </div>
      )}

      {/* Goal Form */}
      {showForm && (
        <GoalForm
          key={editingGoal?._id || "new"}
          goal={editingGoal}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* Detailed Progress */}
      {viewingGoal && !showForm && (
        <div className="rounded-xl border border-base-300 bg-base-100 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{viewingGoal.title}</h2>

              <p className="text-sm text-base-content/60">
                Detailed goal progress
              </p>
            </div>

            <button
              type="button"
              onClick={() => setViewingGoal(null)}
              className="btn btn-sm btn-ghost"
            >
              Close
            </button>
          </div>

          <GoalProgress goalId={viewingGoal._id} />
        </div>
      )}

      {/* Goals */}
      {!showForm && (
        <>
          {goals?.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {goals.map((goal) => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewProgress={handleViewProgress}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-base-300 bg-base-100 p-10 text-center">
              <div className="text-5xl">🎯</div>

              <h2 className="mt-4 text-xl font-semibold">No goals yet</h2>

              <p className="mt-2 text-sm text-base-content/60">
                Create your first goal and start working toward something
                meaningful.
              </p>

              <button onClick={handleCreate} className="btn btn-primary mt-5">
                Create Your First Goal
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Goals;
