import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchivedHabits, toggleHabitStatus } from "../../redux/habitSlice";
import HabitList from "./HabitList";
import Pagination from "../../layout/Pagination";
import { HabitShimmer } from "../../layout/Shimmer";
import AlertMessage from "../../layout/AlertMessage";

const ITEMS_PER_PAGE = 6;

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  if (!error) return fallback;

  if (typeof error === "string") {
    return error;
  }

  return (
    error?.response?.data?.message ||
    error?.payload?.message ||
    error?.payload ||
    error?.message ||
    fallback
  );
};

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
  const [dismissedError, setDismissedError] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  useEffect(() => {
    dispatch(
      fetchArchivedHabits({
        page: archivedCurrentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  }, [dispatch, archivedCurrentPage]);

  const refreshArchive = async (page) => {
    return dispatch(
      fetchArchivedHabits({
        page,
        limit: ITEMS_PER_PAGE,
      }),
    ).unwrap();
  };

  const handleRestore = async (habit) => {
    if (!habit?._id || restoringId) return;

    setDismissedError(false);
    setRestoringId(habit._id);

    try {
      await dispatch(toggleHabitStatus(habit._id)).unwrap();

      const remainingOnPage = archivedHabits.length - 1;

      const nextPage =
        remainingOnPage === 0 && archivedCurrentPage > 1
          ? archivedCurrentPage - 1
          : archivedCurrentPage;

      setMessageType("success");
      setMessage(`"${habit.habitName}" restored successfully.`);

      try {
        await refreshArchive(nextPage);
      } catch (refreshError) {
        setMessageType("error");
        setMessage(
          getErrorMessage(
            refreshError,
            "Habit restored, but the archive could not be refreshed.",
          ),
        );
      }
    } catch (error) {
      setMessageType("error");
      setMessage(getErrorMessage(error, "Failed to restore habit."));
    } finally {
      setRestoringId(null);
    }
  };

  const handlePageChange = async (page) => {
    if (page === archivedCurrentPage || archivedStatus === "loading") {
      return;
    }

    setDismissedError(false);

    try {
      await refreshArchive(page);
    } catch (error) {
      setMessageType("error");
      setMessage(getErrorMessage(error, "Failed to load archived habits."));
    }
  };

  const isInitialLoading =
    archivedStatus === "loading" && archivedHabits.length === 0;

  const isRefreshing =
    archivedStatus === "loading" && archivedHabits.length > 0;

  const hasArchivedError =
    archivedStatus === "failed" &&
    Boolean(archivedError) &&
    archivedError !== dismissedError;
  {
    !isInitialLoading && hasArchivedError && (
      <AlertMessage
        type="error"
        message={getErrorMessage(
          archivedError,
          "Couldn't load archived habits.",
        )}
        duration={5000}
        onClose={() => setDismissedError(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-5 sm:p-7 lg:p-8">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border-[16px] border-primary/10" />

        <div className="pointer-events-none absolute -bottom-10 right-24 h-24 w-24 rounded-full bg-secondary/10" />

        <div className="pointer-events-none absolute right-7 top-7 text-4xl text-primary/10">
          ✦
        </div>

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Your Archive
              </span>
            </div>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              Archived Habits
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
              Keep your progress safe and return to your habits when you’re
              ready.
            </p>
          </div>

          {/* Back */}
          <Link
            to="/habits"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-4 text-sm font-semibold text-base-content/70 shadow-sm transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
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

      {message && (
        <AlertMessage
          type={messageType}
          message={message}
          duration={3000}
          onClose={() => setMessage("")}
        />
      )}

      {isInitialLoading && (
        <section className="space-y-5">
          <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
            <div className="space-y-2">
              <div className="h-5 w-36 animate-pulse rounded-lg bg-base-300/70" />
              <div className="h-3 w-64 animate-pulse rounded-lg bg-base-300/70" />
            </div>
          </div>

          <HabitShimmer />
        </section>
      )}

      {!isInitialLoading && hasArchivedError && (
        <AlertMessage
          type="error"
          message={getErrorMessage(
            archivedError,
            "Couldn't load archived habits.",
          )}
          duration={5000}
          onClose={() => {
            setDismissedError(archivedError);
          }}
        />
      )}

      {!isInitialLoading && archivedStatus !== "failed" && (
        <section className="space-y-5">
          {/* Section heading */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-base-content">
                  Archived habits
                </h2>

                {archivedTotalHabits > 0 && (
                  <span className="rounded-full bg-base-200 px-2.5 py-1 text-xs font-semibold text-base-content/50">
                    {archivedTotalHabits}
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-base-content/55">
                Restore a habit when you’re ready to bring it back into your
                routine.
              </p>
            </div>
          </div>

          {isRefreshing && (
            <div className="flex items-center gap-2 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
              <span className="loading loading-spinner loading-xs" />
              Updating your archive...
            </div>
          )}

          {archivedHabits.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-base-content/40">
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

                  <path d="M9 11v5M12 11v5M15 11v5" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-base-content">
                Your archive is empty
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/55">
                Habits you archive will stay here until you decide to bring them
                back into your routine.
              </p>

              <Link to="/habits" className="btn btn-primary mt-6">
                View My Habits
              </Link>
            </div>
          ) : (
            <>
              <HabitList
                habits={archivedHabits}
                logs={[]}
                onArchive={handleRestore}
                isArchived={true}
              />

              {archivedTotalPages > 1 && (
                <div className="flex flex-col items-center gap-3 border-t border-base-300 pt-5 sm:flex-row sm:justify-between">
                  <p className="text-xs text-base-content/45">
                    Page{" "}
                    <span className="font-semibold text-base-content/65">
                      {archivedCurrentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-base-content/65">
                      {archivedTotalPages}
                    </span>
                  </p>

                  <Pagination
                    currentPage={archivedCurrentPage}
                    totalPages={archivedTotalPages}
                    hasNextPage={archivedHasNextPage}
                    hasPreviousPage={archivedHasPreviousPage}
                    onPageChange={handlePageChange}
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
