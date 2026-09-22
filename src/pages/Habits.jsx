import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchHabits,
  removeHabit,
  toggleHabitStatus,
} from "../redux/habitSlice";
import { fetchHabitLogsByDate } from "../redux/habitLogSlice";

import Pagination from "../layout/Pagination";
import DeleteModal from "../layout/DeleteModal";
import AlertMessage from "../layout/AlertMessage";
import { HabitShimmer } from "../layout/Shimmer";

import HabitList from "../components/habits/HabitList";
import HabitForm from "../components/habits/HabitForm";
import { ArchiveIcon } from "../components/goals/GoalCard";

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

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const today = getLocalDateString();

  // =========================
  // FETCH HABITS
  // =========================

  useEffect(() => {
    dispatch(
      fetchHabits({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  }, [dispatch, currentPage]);

  // =========================
  // FETCH TODAY'S LOGS
  // =========================

  useEffect(() => {
    dispatch(fetchHabitLogsByDate(today));
  }, [dispatch, today]);

  // =========================
  // TODAY STATS
  // =========================

  const completedToday = useMemo(() => {
    return logs?.filter((log) => log.completed)?.length || 0;
  }, [logs]);

  const trackedToday = useMemo(() => {
    return logs?.length || 0;
  }, [logs]);

  const topStreak = useMemo(() => {
    if (!habits?.length) return 0;

    return Math.max(...habits.map((habit) => habit.streak || 0));
  }, [habits]);

  // =========================
  // HANDLERS
  // =========================

  const handleDelete = (habit) => {
    setHabitToDelete(habit);
  };

  const confirmDelete = async () => {
    if (!habitToDelete?._id || deleteLoading) return;

    try {
      setDeleteLoading(true);

      await dispatch(removeHabit(habitToDelete._id)).unwrap();

      setHabitToDelete(null);

      dispatch(
        fetchHabits({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        }),
      );

      setMessageType("success");
      setMessage("Habit deleted successfully.");
    } catch (error) {
      setMessageType("error");
      setMessage(
        typeof error === "string"
          ? error
          : error?.message || "Failed to delete habit.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleArchive = async (habit) => {
    try {
      await dispatch(toggleHabitStatus(habit._id)).unwrap();

      setMessageType("success");
      setMessage(`"${habit.habitName}" archived successfully.`);
    } catch (error) {
      setMessageType("error");
      setMessage(
        typeof error === "string"
          ? error
          : error?.message || "Failed to archive habit.",
      );
    }
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

  const isInitialLoading = status === "loading" && habits.length === 0;

  // =========================
  // FORM VIEW
  // =========================

  if (showForm) {
    return (
      <div className="space-y-6">

        <HabitForm
          key={editingHabit?._id || "new"}
          habit={editingHabit}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* =========================
          HERO
      ========================= */}

      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border-[18px] border-primary/10" />

        <div className="pointer-events-none absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-secondary/10" />

        <div className="pointer-events-none absolute right-8 top-8 text-5xl text-primary/10">
          ✦
        </div>

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold text-primary">
              Your daily practice
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              Build better days,
              <br className="hidden sm:block" />
              one habit at a time.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
              Small actions become meaningful progress when you repeat them
              consistently. Keep your routine simple and keep moving forward.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            <Link to="/habits/archived-habits" className="btn btn-outline">
              <ArchiveIcon />
              Archived Habits
            </Link>

            <button
              type="button"
              onClick={handleAddHabit}
              className="btn btn-primary"
            >
              <span className="text-lg leading-none">+</span>
              Add Habit
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          ALERT
      ========================= */}

      {message && (
        <AlertMessage
          type={messageType}
          message={message}
          duration={3000}
          onClose={() => setMessage("")}
        />
      )}

      {/* =========================
          INITIAL LOADING
      ========================= */}

      {isInitialLoading && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-32 animate-pulse rounded-lg bg-base-300/70" />
              <div className="h-3 w-64 animate-pulse rounded-lg bg-base-300/70" />
            </div>

            <div className="h-7 w-20 animate-pulse rounded-full bg-base-300/70" />
          </div>

          <HabitShimmer />
        </section>
      )}

      {/* =========================
          OVERVIEW
      ========================= */}

      {!isInitialLoading && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Habits */}
          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path d="M8 6h12M8 12h12M8 18h12" strokeLinecap="round" />
                <path
                  d="M4 6h.01M4 12h.01M4 18h.01"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
            </div>

            <p className="mt-4 text-sm text-base-content/60">Total habits</p>

            <p className="mt-1 text-2xl font-bold text-base-content">
              {totalHabits}
            </p>
          </div>

          {/* Completed Today */}
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
                  d="M5 12.5l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="mt-4 text-sm text-base-content/60">Completed today</p>

            <p className="mt-1 text-2xl font-bold text-base-content">
              {completedToday}
            </p>
          </div>

          {/* Tracked Today */}
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
                <path
                  d="M12 8v4l2.5 2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="mt-4 text-sm text-base-content/60">Tracked today</p>

            <p className="mt-1 text-2xl font-bold text-base-content">
              {trackedToday}
            </p>
          </div>

          {/* Top Streak */}
          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  d="M12 3c1.5 3 4.5 4 4.5 7.2A4.5 4.5 0 1 1 7 8.8c0 2 1 3.4 2.4 4.6C9 10 11 7.8 12 3Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="mt-4 text-sm text-base-content/60">Top streak</p>

            <p className="mt-1 text-2xl font-bold text-base-content">
              {topStreak}
              <span className="ml-1 text-sm font-medium text-base-content/50">
                days
              </span>
            </p>
          </div>
        </section>
      )}

      {/* =========================
          HABITS
      ========================= */}

      {!isInitialLoading && (
        <section className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-base-content">
                {totalHabits > 0 ? "Your Habits" : "Start Your Routine"}
              </h2>

              {totalHabits > 0 && (
                <p className="mt-1 text-sm text-base-content/55">
                  Keep showing up. Small steps add up.
                </p>
              )}
            </div>

            {totalHabits > 0 && (
              <span className="text-sm font-medium text-base-content/45">
                {totalHabits} {totalHabits === 1 ? "habit" : "habits"}
              </span>
            )}
          </div>

          {/* Habit Cards */}
          <HabitList
            habits={habits}
            logs={logs}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onArchive={handleArchive}
            onProgressSuccess={handleProgressSuccess}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-2">
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
            </div>
          )}
        </section>
      )}

      {/* =========================
          DELETE MODAL
      ========================= */}

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
