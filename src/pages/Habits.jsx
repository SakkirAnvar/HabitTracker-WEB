import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchHabits, removeHabit } from "../redux/habitSlice";
import { fetchHabitLogsByDate } from "../redux/habitLogSlice";
import Pagination from "../layout/Pagination";

import HabitList from "../components/habits/HabitList";
import HabitForm from "../components/habits/HabitForm";
import DeleteModal from "../layout/DeleteModal";

import { getLocalDateString } from "../utils/date";

const ITEMS_PER_PAGE = 6;

const Habits = () => {
  const dispatch = useDispatch();

  const {
    habits,
    status,
    currentPage,
    totalPages,
    totalHabits,
    hasNextPage,
    hasPreviousPage,
  } = useSelector((state) => state.habit);

  const { logs } = useSelector((state) => state.habitLog);

  const [editingHabit, setEditingHabit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [habitToDelete, setHabitToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const today = getLocalDateString();

  useEffect(() => {
    dispatch(
      fetchHabits({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(fetchHabitLogsByDate(today));
  }, [dispatch, today]);

  const handleDelete = (habit) => {
    setHabitToDelete(habit);
  };

  const confirmDelete = async () => {
    if (!habitToDelete?._id || deleteLoading) return;

    try {
      setDeleteLoading(true);

      await dispatch(removeHabit(habitToDelete._id)).unwrap();

      setHabitToDelete(null);

      // Refresh current page
      dispatch(
        fetchHabits({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        }),
      );
    } catch (error) {
      console.error("Failed to delete habit:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleAddHabit = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setEditingHabit(null);
    setShowForm(false);
    dispatch(
      fetchHabits({
        page: 1,
        limit: ITEMS_PER_PAGE,
      }),
    );

    dispatch(fetchHabitLogsByDate(today));
  };
  const handleCancel = () => {
    setEditingHabit(null);
    setShowForm(false);
  };

  const handleProgressSuccess = () => {
    dispatch(fetchHabitLogsByDate(today));

    dispatch(
      fetchHabits({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  };

  const isLoading = status === "loading";

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-base-content md:text-3xl">
            My Habits
          </h1>

          <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60 md:text-base">
            Build consistency, one day at a time.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleAddHabit}
            className="btn btn-primary shrink-0"
          >
            <span className="text-lg leading-none">+</span>
            Add Habit
          </button>
        )}
      </section>

      {showForm && (
        <HabitForm
          key={editingHabit?._id || "new"}
          habit={editingHabit}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      {isLoading && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary" />

            <p className="text-sm text-base-content/60">
              Loading your habits...
            </p>
          </div>
        </div>
      )}

      {!showForm && !isLoading && (
        <section>
          {totalHabits > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-base-content">
                  Your Habits
                </h2>

                <p className="mt-0.5 text-sm text-base-content/60">
                  Stay consistent and keep building better days.
                </p>
              </div>

              <span className="badge badge-ghost">
                {totalHabits} {totalHabits === 1 ? "habit" : "habits"}
              </span>
            </div>
          )}

          <HabitList
            habits={habits}
            logs={logs}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onProgressSuccess={handleProgressSuccess}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onPageChange={(page) => {
              dispatch(
                fetchHabits({
                  page,
                  limit: ITEMS_PER_PAGE,
                }),
              );
            }}
          />
        </section>
      )}

      <DeleteModal
        isOpen={Boolean(habitToDelete)}
        itemName={habitToDelete?.habitName}
        itemType="Habit"
        loading={deleteLoading}
        onCancel={() => {
          if (!deleteLoading) {
            setHabitToDelete(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Habits;
