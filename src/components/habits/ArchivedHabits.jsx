
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchArchivedHabits,
  toggleHabitStatus,
} from "../../redux/habitSlice";

import HabitList from "./HabitList";
import Pagination from "../../layout/Pagination";
import { HabitShimmer } from "../../layout/Shimmer";
import AlertMessage from "../../layout/AlertMessage";

const ITEMS_PER_PAGE = 6;

const ArchivedHabits = () => {
  const dispatch = useDispatch();

  const {
    archivedHabits,
    archivedStatus,
    archivedError,
    archivedCurrentPage,
    archivedTotalPages,
    archivedTotalHabits,
    archivedHasNextPage,
    archivedHasPreviousPage,
  } = useSelector((state) => state.habit);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // =========================
  // FETCH ARCHIVED HABITS
  // =========================

  useEffect(() => {
    dispatch(
      fetchArchivedHabits({
        page: archivedCurrentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  }, [dispatch, archivedCurrentPage]);

  // =========================
  // RESTORE
  // =========================

  const handleRestore = async (habit) => {
    try {
      await dispatch(toggleHabitStatus(habit._id)).unwrap();

      setMessageType("success");
      setMessage(`"${habit.habitName}" restored successfully.`);

      dispatch(
        fetchArchivedHabits({
          page: archivedCurrentPage,
          limit: ITEMS_PER_PAGE,
        }),
      );
    } catch (error) {
      setMessageType("error");
      setMessage(
        typeof error === "string"
          ? error
          : error?.message || "Failed to restore habit.",
      );
    }
  };

  const isLoading =
    archivedStatus === "loading" && archivedHabits.length === 0;

  return (
    <div className="space-y-6">
      {/* =========================
          HERO
      ========================= */}

      <section className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border-[18px] border-base-200" />

        <div className="pointer-events-none absolute bottom-[-45px] right-24 h-28 w-28 rounded-full bg-primary/5" />

        <div className="pointer-events-none absolute right-8 top-8 text-5xl text-primary/10">
          ◌
        </div>

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
           

            <div className="max-w-2xl">
              <p className="mb-1 text-sm font-semibold text-primary">
                Your archive
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
                Archived Habits
              </h1>

              <p className="mt-2 text-sm leading-6 text-base-content/60 sm:text-base">
                Keep habits you're taking a break from here. Restore them
                whenever they become part of your routine again.
              </p>
            </div>
          </div>

          {/* Back */}
          <Link
            to="/habits"
            className="btn btn-outline shrink-0 self-start sm:self-center"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Back to Habits
          </Link>
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
          LOADING
      ========================= */}

      {isLoading && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-32 animate-pulse rounded-lg bg-base-300/70" />
              <div className="h-3 w-60 animate-pulse rounded-lg bg-base-300/70" />
            </div>

            <div className="h-7 w-20 animate-pulse rounded-full bg-base-300/70" />
          </div>

          <HabitShimmer />
        </section>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {!isLoading && archivedStatus === "failed" && archivedError && (
        <AlertMessage
          type="error"
          message={archivedError}
          duration={5000}
          onClose={() => {}}
        />
      )}

      {/* =========================
          CONTENT
      ========================= */}

      {!isLoading && archivedStatus !== "failed" && (
        <section className="space-y-5">
          {/* Section heading */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-base-content">
                Your archive
              </h2>

              <p className="mt-1 text-sm text-base-content/55">
                Restore a habit when you're ready to pick it up again.
              </p>
            </div>

            {archivedTotalHabits > 0 && (
              <span className="text-sm font-medium text-base-content/45">
                {archivedTotalHabits}{" "}
                {archivedTotalHabits === 1 ? "habit" : "habits"}
              </span>
            )}
          </div>

          {/* Empty state */}
          {archivedHabits.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-base-content/40">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-7 w-7"
                >
                  <path
                    d="M4 7.5h16M6 7.5V19h12V7.5M9 7.5V5h6v2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 11v5M12 11v5M15 11v5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-base-content">
                Nothing archived
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-base-content/55">
                Habits you archive will stay here until you decide to bring
                them back into your routine.
              </p>

              <Link
                to="/habits"
                className="btn btn-primary mt-5"
              >
                View My Habits
              </Link>
            </div>
          ) : (
            <>
              {/* Archived cards */}
              <HabitList
                habits={archivedHabits}
                logs={[]}
                onArchive={handleRestore}
                isArchived={true}
              />

              {/* Pagination */}
              {archivedTotalPages > 1 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={archivedCurrentPage}
                    totalPages={archivedTotalPages}
                    hasNextPage={archivedHasNextPage}
                    hasPreviousPage={archivedHasPreviousPage}
                    onPageChange={(page) => {
                      dispatch(
                        fetchArchivedHabits({
                          page,
                          limit: ITEMS_PER_PAGE,
                        }),
                      );
                    }}
                  />
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default ArchivedHabits;
