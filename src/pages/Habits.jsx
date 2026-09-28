import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../layout/Pagination";
import DeleteModal from "../layout/DeleteModal";
import AlertMessage from "../layout/AlertMessage";
import { HabitShimmer } from "../layout/Shimmer";
import HabitForm from "../components/habits/HabitForm";
import HabitCard from "../components/habits/HabitCard";
import {
  fetchHabits,
  fetchTodayHabits,
  toggleHabitStatus,
  removeHabit,
} from "../redux/habitSlice";

const ITEMS_PER_PAGE = 6;

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const Habits = () => {
  const dispatch = useDispatch();

  const {
    habits,
    todayHabits,
    status,
    todayStatus,
    error,
    todayError,
    currentPage,
    totalPages,
    totalHabits,
    hasNextPage,
    hasPreviousPage,
    todayCurrentPage,
    todayTotalPages,
    todayHasNextPage,
    todayHasPreviousPage,
    todaySummary,
  } = useSelector((store) => store.habit);

  const [activeView, setActiveView] = useState("today");
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const today = getLocalDateString();

  const todayExpected = Number(todaySummary?.expected) || 0;
  const todayCompleted = Number(todaySummary?.completed) || 0;
  const todayRemaining = Number(todaySummary?.remaining) || 0;
  const todayPercentage = Number(todaySummary?.percentage) || 0;

  const progressMessage =
    todayExpected === 0
      ? "Nothing scheduled for today."
      : todayPercentage === 100
        ? "You're all done for today. Nice work."
        : todayPercentage === 0
          ? "Start with one small win."
          : `${todayRemaining} ${
              todayRemaining === 1 ? "habit" : "habits"
            } left for today.`;

  const refreshToday = () => {
    dispatch(
      fetchTodayHabits({
        date: today,
        page: todayCurrentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  };

  const refreshCurrentHabits = () => {
    dispatch(
      fetchHabits({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  };

  const refreshAllHabitData = () => {
    refreshToday();
    refreshCurrentHabits();
  };

  useEffect(() => {
    dispatch(
      fetchTodayHabits({
        date: today,
        page: todayCurrentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  }, [dispatch, today, todayCurrentPage]);

  useEffect(() => {
    dispatch(
      fetchHabits({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  }, [dispatch, currentPage]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const clearAlert = () => {
    setAlert({ type: "", message: "" });
  };

  const handleCreate = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingHabit(null);
    refreshAllHabitData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleDelete = (habit) => {
    setHabitToDelete(habit);
  };

  const handleConfirmDelete = async () => {
    if (!habitToDelete) return;

    setDeleteLoading(true);

    try {
      await dispatch(removeHabit(habitToDelete._id)).unwrap();

      const shouldGoBack = habits.length === 1 && currentPage > 1;

      setHabitToDelete(null);
      showAlert("success", "Habit deleted successfully.");

      // Refresh Today
      refreshToday();

      // Refresh All Habits
      dispatch(
        fetchHabits({
          page: shouldGoBack ? currentPage - 1 : currentPage,
          limit: ITEMS_PER_PAGE,
        }),
      );
    } catch (err) {
      showAlert(
        "error",
        typeof err === "string"
          ? err
          : err?.message || "Failed to delete habit.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleArchive = async (habit) => {
    try {
      await dispatch(toggleHabitStatus(habit._id)).unwrap();

      showAlert("success", `"${habit.habitName}" archived.`);

      const shouldGoBack = habits.length === 1 && currentPage > 1;

      refreshToday();

      dispatch(
        fetchHabits({
          page: shouldGoBack ? currentPage - 1 : currentPage,
          limit: ITEMS_PER_PAGE,
        }),
      );
    } catch (err) {
      showAlert(
        "error",
        typeof err === "string"
          ? err
          : err?.message || "Failed to archive habit.",
      );
    }
  };

  const handleTodayPageChange = (page) => {
    setActiveView("today");

    if (page === todayCurrentPage) return;

    dispatch(
      fetchTodayHabits({
        date: today,
        page,
        limit: ITEMS_PER_PAGE,
      }),
    );
  };

  const handlePageChange = (page) => {
    setActiveView("all");

    if (page === currentPage) return;
    dispatch(
      fetchHabits({
        page,
        limit: ITEMS_PER_PAGE,
      }),
    );
  };

  const isTodayLoading = todayStatus === "loading";
  const isAllLoading = status === "loading";

  if (showForm) {
    return (
      <div className="w-full space-y-5 pb-8">
        {alert.message && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            duration={3000}
            onClose={clearAlert}
          />
        )}

        <HabitForm
          habit={editingHabit}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-5 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border-[16px] border-primary/10" />
        <div className="pointer-events-none absolute -bottom-10 right-24 h-24 w-24 rounded-full bg-secondary/10" />
        <div className="pointer-events-none absolute right-7 top-7 text-4xl text-primary/10">
          ✦
        </div>

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Your Routine
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              Build better days, one habit at a time.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
              Stay consistent with what matters today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/habits/archived"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-4 text-sm font-semibold text-base-content/70 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              <ArchiveIcon />
              Archived
            </Link>

            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-content shadow-sm transition hover:bg-primary/90"
            >
              <PlusIcon />
              Add Habit
            </button>
          </div>
        </div>
      </section>
      {alert.message && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          duration={3000}
          onClose={clearAlert}
        />
      )}
      <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/75">
              Today
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-base-content">
                {todayCompleted} / {todayExpected}
              </h2>

              <span className="text-sm font-medium text-base-content/40">
                completed
              </span>
            </div>

            <p className="mt-1 text-sm text-base-content/55">
              {progressMessage}
            </p>
          </div>

          <div className="w-full sm:max-w-xs">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold">
              <span className="text-base-content/40">Daily progress</span>
              <span className="text-primary">{todayPercentage}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-base-200">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${todayPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-base-content">
            {activeView === "today" ? "Your day" : "Your habits"}
          </h2>

          <p className="mt-1 text-sm text-base-content/50">
            {activeView === "today"
              ? "Focus on what is scheduled for today."
              : "Manage your routine and keep everything in one place."}
          </p>
        </div>

        <div className="inline-flex w-full rounded-xl border border-base-300 bg-base-200/60 p-1 sm:w-auto">
          <button
            type="button"
            aria-pressed={activeView === "today"}
            onClick={() => setActiveView("today")}
            className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition sm:flex-none ${
              activeView === "today"
                ? "bg-base-100 text-primary shadow-sm"
                : "text-base-content/50 hover:text-base-content"
            }`}
          >
            Today
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] ${
                activeView === "today"
                  ? "bg-primary/10 text-primary"
                  : "bg-base-300/70 text-base-content/45"
              }`}
            >
              {todayExpected}
            </span>
          </button>

          <button
            type="button"
            aria-pressed={activeView === "all"}
            onClick={() => setActiveView("all")}
            className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition sm:flex-none ${
              activeView === "all"
                ? "bg-base-100 text-primary shadow-sm"
                : "text-base-content/50 hover:text-base-content"
            }`}
          >
            All Habits
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] ${
                activeView === "all"
                  ? "bg-primary/10 text-primary"
                  : "bg-base-300/70 text-base-content/45"
              }`}
            >
              {totalHabits}
            </span>
          </button>
        </div>
      </div>

      {activeView === "today" && (
        <section>
          {todayError ? (
            <div className="rounded-2xl border border-error/20 bg-error/5 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-error">
                    Couldn't load today's habits
                  </p>
                  <p className="mt-1 text-sm text-base-content/55">
                    {todayError}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={refreshToday}
                  className="btn btn-sm btn-outline rounded-xl border-error/30 text-error hover:bg-error/10"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : isTodayLoading && todayHabits.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <HabitTodaySkeleton />
              <HabitTodaySkeleton />
              <HabitTodaySkeleton />
              <HabitTodaySkeleton />
            </div>
          ) : todayHabits.length === 0 ? (
            <TodayEmptyState onCreate={handleCreate} />
          ) : (
            <div
              className={isTodayLoading ? "opacity-70 transition-opacity" : ""}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {todayHabits.map((habit) => (
                  <HabitCard
                    key={`${habit._id}-${habit.todayLog?._id || "today"}`}
                    habit={habit}
                    existingLog={habit.todayLog}
                    onProgressSuccess={refreshToday}
                  />
                ))}
              </div>

              {(todayHasNextPage ||
                todayHasPreviousPage ||
                todayTotalPages > 1) && (
                <div className="mt-6">
                  <Pagination
                    currentPage={todayCurrentPage}
                    totalPages={todayTotalPages}
                    hasNextPage={todayHasNextPage}
                    hasPreviousPage={todayHasPreviousPage}
                    onPageChange={handleTodayPageChange}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {activeView === "all" && (
        <section>
          {error ? (
            <div className="rounded-2xl border border-error/20 bg-error/5 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-error">
                    Couldn't load your habits
                  </p>
                  <p className="mt-1 text-sm text-base-content/55">{error}</p>
                </div>

                <button
                  type="button"
                  onClick={refreshCurrentHabits}
                  className="btn btn-sm btn-outline rounded-xl border-error/30 text-error hover:bg-error/10"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : isAllLoading && habits.length === 0 ? (
            <HabitShimmer />
          ) : habits.length === 0 ? (
            <AllHabitsEmptyState onCreate={handleCreate} />
          ) : (
            <>
              <div
                className={`grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 ${
                  isAllLoading ? "opacity-60" : ""
                }`}
              >
                {habits.map((habit) => (
                  <HabitCard
                    key={habit._id}
                    habit={habit}
                    existingLog={habit.todayLog}
                    onEdit={handleEdit}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                    onProgressSuccess={refreshAllHabitData}
                  />
                ))}
              </div>

              {(hasNextPage || hasPreviousPage || totalPages > 1) && (
                <div className="mt-6">
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
          )}
        </section>
      )}

      <DeleteModal
        isOpen={Boolean(habitToDelete)}
        itemName={habitToDelete?.habitName}
        itemType="habit"
        loading={deleteLoading}
        onCancel={() => setHabitToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

const TodayEmptyState = ({ onCreate }) => {
  return (
    <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CalendarIcon />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-base-content">
        Nothing scheduled today
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/55">
        Enjoy the day or build a new habit for your routine.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="btn btn-primary btn-sm mt-5 rounded-xl px-5"
      >
        <PlusIcon />
        Add Habit
      </button>
    </div>
  );
};

const AllHabitsEmptyState = ({ onCreate }) => {
  return (
    <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <SparkleIcon />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-base-content">
        Start your routine
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/55">
        Create a few habits that make your days better, one small action at a
        time.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="btn btn-primary btn-sm mt-5 rounded-xl px-5"
      >
        <PlusIcon />
        Create your first habit
      </button>
    </div>
  );
};

const HabitTodaySkeleton = () => {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-base-300" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 animate-pulse rounded bg-base-300" />
          <div className="h-3 w-24 animate-pulse rounded bg-base-300/80" />
        </div>
      </div>
      <div className="mt-6 h-14 animate-pulse rounded-xl bg-base-200" />
      <div className="mt-3 h-3 w-48 animate-pulse rounded bg-base-300/70" />
    </div>
  );
};

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4"
  >
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

const ArchiveIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <path d="M4 7h16" strokeLinecap="round" />
    <path d="M5 7l1 13h12l1-13" strokeLinecap="round" />
    <path d="M8 7V4h8v3M9 11h6" strokeLinecap="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-6 w-6"
  >
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    <path d="M8 14h8" strokeLinecap="round" />
  </svg>
);

const SparkleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <path d="M12 2.5l1.65 6.35L20 10.5l-6.35 1.65L12 18.5l-1.65-6.35L4 10.5l6.35-1.65L12 2.5z" />

    <path d="M19 14.5l.8 2.7 2.7.8-2.7.8-.8 2.7-.8-2.7-2.7-.8 2.7-.8.8-2.7z" />
  </svg>
);

export default Habits;
