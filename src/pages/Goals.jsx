import { useEffect, useState } from "react";
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

  // =========================
  // Delete modal
  // =========================

  const [goalToDelete, setGoalToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // =========================
  // Alert message
  // =========================

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // =========================
  // Fetch goals
  // =========================

  useEffect(() => {
    dispatch(
      fetchGoals({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  }, [dispatch, currentPage]);

  // =========================
  // Fetch habits
  // =========================

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  // =========================
  // Alert
  // =========================

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

  // =========================
  // Create
  // =========================

  const handleCreate = () => {
    setEditingGoal(null);
    setShowForm(true);
    setViewingGoal(null);
  };

  // =========================
  // Edit
  // =========================

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
    setViewingGoal(null);
  };

  // =========================
  // Open delete modal
  // =========================

  const handleDelete = (goal) => {
    setGoalToDelete(goal);
  };

  // =========================
  // Confirm delete
  // =========================

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;

    setDeleteLoading(true);

    try {
      await dispatch(removeGoal(goalToDelete._id)).unwrap();

      const deletedGoalId = goalToDelete._id;

      setGoalToDelete(null);

      showAlert("success", "Goal deleted successfully.");

      if (viewingGoal?._id === deletedGoalId) {
        setViewingGoal(null);
      }

      // Current page has only one goal.
      // Move back one page after deletion.
      if (goals.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        // Refresh current page
        dispatch(
          fetchGoals({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          }),
        );
      }
    } catch (err) {
      showAlert(
        "error",
        typeof err === "string"
          ? err
          : err?.message || "Failed to delete goal.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================
  // View progress
  // =========================

  const handleViewProgress = (goal) => {
    setViewingGoal(goal);
    setShowForm(false);
  };

  // =========================
  // Form success
  // =========================

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

  // =========================
  // Cancel
  // =========================

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  // =========================
  // Page change
  // =========================

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

  // =========================
  // Initial loading
  // =========================

  const isInitialLoading = status === "loading" && goals.length === 0;

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        {/* ================= HEADER SHIMMER ================= */}

        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-24 animate-pulse rounded-lg bg-base-300" />

            <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-base-300" />
          </div>

          <div className="h-11 w-32 animate-pulse rounded-xl bg-base-300" />
        </section>

        {/* ================= GOAL SHIMMER ================= */}

        <GoalShimmer />
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <>
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

          {!showForm && !viewingGoal && (
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

        {/* ================= ALERT ================= */}

        {alert.message && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            duration={3000}
            onClose={clearAlert}
          />
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

            <div className="p-5">
              <GoalProgress goalId={viewingGoal._id} />
            </div>
          </section>
        )}

        {/* ================= GOALS LIST ================= */}

        {!showForm && !viewingGoal && (
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
                    {totalGoals} {totalGoals === 1 ? "goal" : "goals"}
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
                      onHabitRemoved={showAlert}
                    />
                  ))}
                </div>

                {/* Pagination */}

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  onPageChange={handlePageChange}
                />
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

      {/* ================= DELETE GOAL MODAL ================= */}

      <DeleteModal
        isOpen={!!goalToDelete}
        itemName={goalToDelete?.title || ""}
        itemType="goal"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setGoalToDelete(null)}
      />
    </>
  );
};

export default Goals;
