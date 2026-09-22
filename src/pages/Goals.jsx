import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../layout/Pagination";
import DeleteModal from "../layout/DeleteModal";
import AlertMessage from "../layout/AlertMessage";
import { fetchGoals, removeGoal } from "../redux/goalSlice";
import { fetchHabits } from "../redux/habitSlice";
import GoalForm from "../components/goals/GoalForm";
import GoalCard from "../components/goals/GoalCard";
import GoalProgress from "../components/goals/GoalProgress";
import { GoalShimmer } from "../layout/Shimmer";

const ITEMS_PER_PAGE = 6;

const Goals = () => {
  const dispatch = useDispatch();

  const {
    goals,
    status,
    totalPages,
    totalGoals,
    hasNextPage,
    hasPreviousPage,
  } = useSelector((store) => store.goal);

  const [currentPage, setCurrentPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [viewingGoal, setViewingGoal] = useState(null);

  const [goalToDelete, setGoalToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    dispatch(
      fetchGoals({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  const showAlert = (type, message) => {
    setAlert({
      type,
      message,
    });
  };

  const clearAlert = () => {
    setAlert({
      type: "",
      message: "",
    });
  };

  const handleCreate = () => {
    setEditingGoal(null);
    setViewingGoal(null);
    setShowForm(true);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setViewingGoal(null);
    setShowForm(true);
  };

  const handleDelete = (goal) => {
    setGoalToDelete(goal);
  };

  const handleConfirmDelete = async () => {
    if (!goalToDelete || deleteLoading) return;

    setDeleteLoading(true);

    try {
      await dispatch(removeGoal(goalToDelete._id)).unwrap();

      const deletedGoalId = goalToDelete._id;

      setGoalToDelete(null);

      showAlert("success", "Goal deleted successfully.");

      if (viewingGoal?._id === deletedGoalId) {
        setViewingGoal(null);
      }

      if (goals.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        dispatch(
          fetchGoals({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          }),
        );
      }
    } catch (error) {
      showAlert(
        "error",
        typeof error === "string"
          ? error
          : error?.message || "Failed to delete goal.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewProgress = (goal) => {
    setViewingGoal(goal);
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingGoal(null);

    dispatch(
      fetchGoals({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handlePageChange = (page) => {
    setViewingGoal(null);
    setShowForm(false);
    setEditingGoal(null);

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const activeGoals = useMemo(() => {
    return goals?.filter((goal) => goal.status === "active").length || 0;
  }, [goals]);

  const completedGoals = useMemo(() => {
    return goals?.filter((goal) => goal.status === "completed").length || 0;
  }, [goals]);

  const averageProgress = useMemo(() => {
    if (!goals?.length) return 0;

    const total = goals.reduce((sum, goal) => {
      const target = Number(goal.target) || 0;
      const progress = Number(goal.currentProgress) || 0;

      if (!target) return sum;

      return sum + Math.min(100, Math.round((progress / target) * 100));
    }, 0);

    return Math.round(total / goals.length);
  }, [goals]);

  const isInitialLoading = status === "loading" && goals.length === 0;

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-base-300" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-base-300" />
        </section>

        <GoalShimmer />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        {alert.message && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            duration={3000}
            onClose={clearAlert}
          />
        )}

        <GoalForm
          key={editingGoal?._id || "new"}
          goal={editingGoal}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!viewingGoal && (
        <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border-[18px] border-primary/10" />

          <div className="pointer-events-none absolute bottom-[-45px] right-24 h-32 w-32 rounded-full bg-secondary/10" />

          <div className="pointer-events-none absolute right-8 top-8 text-5xl text-primary/10">
            ✦
          </div>

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold text-primary">
                Your direction
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                Turn intentions into
                <br className="hidden sm:block" /> meaningful progress.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
                Set clear goals, build habits, and keep moving forward.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="btn btn-primary shrink-0 self-start lg:self-center"
            >
              <span className="text-lg leading-none">+</span>
              Create Goal
            </button>
          </div>
        </section>
      )}

      {alert.message && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          duration={3000}
          onClose={clearAlert}
        />
      )}

      {viewingGoal && (
        <section className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/5" />

          <div className="relative z-10 border-b border-base-300 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="8.5" />
                    <path
                      d="M12 7.5v5l3 1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Goal progress
                  </p>

                  <h2 className="mt-0.5 truncate text-xl font-bold text-base-content">
                    {viewingGoal.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingGoal(null)}
                className="btn btn-sm btn-outline self-start sm:self-auto"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
                Close
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <GoalProgress goalId={viewingGoal._id} />
          </div>
        </section>
      )}

      {!viewingGoal && (
        <>
          {/* Summary */}
          {totalGoals > 0 && (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="8.5" />
                    <path
                      d="M8.5 12l2.2 2.2 4.8-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="mt-4 text-sm text-base-content/55">Total goals</p>

                <p className="mt-1 text-2xl font-bold text-base-content">
                  {totalGoals}
                </p>
              </div>

              <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M8 12h8" strokeLinecap="round" />
                  </svg>
                </div>

                <p className="mt-4 text-sm text-base-content/55">
                  Active goals
                </p>

                <p className="mt-1 text-2xl font-bold text-base-content">
                  {activeGoals}
                </p>
              </div>

              <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="mt-4 text-sm text-base-content/55">Completed</p>

                <p className="mt-1 text-2xl font-bold text-base-content">
                  {completedGoals}
                </p>
              </div>

              <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="M12 4v16M4 12h16" strokeLinecap="round" />
                  </svg>
                </div>

                <p className="mt-4 text-sm text-base-content/55">
                  Page progress
                </p>

                <p className="mt-1 text-2xl font-bold text-base-content">
                  {averageProgress}%
                </p>
              </div>
            </section>
          )}

          <section className="space-y-5">
            {goals?.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-base-content">
                      Your Goals
                    </h2>

                    <p className="mt-1 text-sm text-base-content/55">
                      Keep moving forward, one milestone at a time.
                    </p>
                  </div>

                  <span className="text-sm font-medium text-base-content/45">
                    {totalGoals} {totalGoals === 1 ? "goal" : "goals"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {goals.map((goal) => (
                    <GoalCard
                      key={goal._id}
                      goal={goal}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewProgress={handleViewProgress}
                      onHabitRemoved={showAlert}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pt-2">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      hasNextPage={hasNextPage}
                      hasPreviousPage={hasPreviousPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-7 w-7"
                  >
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M12 8v8M8 12h8" strokeLinecap="round" />
                  </svg>
                </div>

                <h2 className="mt-5 text-xl font-bold text-base-content">
                  Start with one meaningful goal
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/55">
                  Define something that matters to you, give it a clear target,
                  and turn it into consistent progress.
                </p>

                <button
                  type="button"
                  onClick={handleCreate}
                  className="btn btn-primary mt-6"
                >
                  <span className="text-lg leading-none">+</span>
                  Create Your First Goal
                </button>
              </div>
            )}
          </section>
        </>
      )}

      <DeleteModal
        isOpen={Boolean(goalToDelete)}
        itemName={goalToDelete?.title || ""}
        itemType="goal"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleteLoading) {
            setGoalToDelete(null);
          }
        }}
      />
    </div>
  );
};

export default Goals;
