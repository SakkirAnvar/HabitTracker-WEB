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

  // =========================
  // Handlers
  // =========================

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

  // =========================
  // Loading
  // =========================

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />

          <p className="text-sm text-base-content/60">Loading your goals...</p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>

          <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Goals
          </h1>

          <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
            Set meaningful goals and turn your intentions into consistent
            progress.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleCreate}
            className="btn btn-primary shrink-0"
          >
            <span className="text-lg leading-none">+</span>
            Create Goal
          </button>
        )}
      </section>

      {/* ================= ERROR ================= */}

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.5 13A2 2 0 004.52 20h14.96a2 2 0 001.73-3.14l-7.5-13a2 2 0 00-3.46 0z"
            />
          </svg>

          <span>
            {typeof error === "string"
              ? error
              : "Something went wrong while loading goals."}
          </span>
        </div>
      )}

      {/* ================= GOAL FORM ================= */}

      {showForm && (
        <GoalForm
          key={editingGoal?._id || "new"}
          goal={editingGoal}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* ================= DETAILED PROGRESS ================= */}

      {viewingGoal && !showForm && (
        <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          {/* Progress Header */}

          <div className="flex flex-col gap-3 border-b border-base-300 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  🎯
                </span>

                <h2 className="truncate text-lg font-semibold text-base-content">
                  {viewingGoal.title}
                </h2>
              </div>

              <p className="mt-1 pl-10 text-sm text-base-content/60">
                Detailed goal progress
              </p>
            </div>

            <button
              type="button"
              onClick={() => setViewingGoal(null)}
              className="btn btn-sm btn-ghost self-start sm:self-auto"
            >
              Close
            </button>
          </div>

          {/* Progress Content */}

          <div className="p-5">
            <GoalProgress goalId={viewingGoal._id} />
          </div>
        </section>
      )}

      {/* ================= GOALS LIST ================= */}

      {!showForm && (
        <section>
          {goals?.length > 0 ? (
            <>
              {/* Section heading */}

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-base-content">
                    Your Goals
                  </h2>

                  <p className="mt-0.5 text-sm text-base-content/60">
                    Keep moving forward, one milestone at a time.
                  </p>
                </div>

                <span className="badge badge-ghost">
                  {goals.length} {goals.length === 1 ? "goal" : "goals"}
                </span>
              </div>

              {/* Goal cards */}

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
            </>
          ) : (
            /* ================= EMPTY STATE ================= */

            <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                🎯
              </div>

              <h2 className="mt-5 text-xl font-semibold text-base-content">
                No goals yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
                Create your first goal and start working toward something
                meaningful.
              </p>

              <button
                type="button"
                onClick={handleCreate}
                className="btn btn-primary mt-6"
              >
                Create Your First Goal
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Goals;
