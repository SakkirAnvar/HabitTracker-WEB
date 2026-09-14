import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchReviewByDate, fetchReviews } from "../redux/reviewSlice";

import ReviewForm from "../components/reviews/ReviewForm";

const Journal = () => {
  const dispatch = useDispatch();

  const { reviews, selectedReview, selectedStatus, selectedError } =
    useSelector((store) => store.review);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [showForm, setShowForm] = useState(false);

  // =========================
  // Fetch selected review
  // =========================

  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchReviewByDate(selectedDate));
    }
  }, [dispatch, selectedDate]);

  // =========================
  // Fetch review history
  // =========================

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  // =========================
  // Date change
  // =========================

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setShowForm(false);
  };

  // =========================
  // Review success
  // =========================

  const handleReviewSuccess = () => {
    setShowForm(false);

    dispatch(fetchReviewByDate(selectedDate));
    dispatch(fetchReviews());
  };

  // =========================
  // Cancel
  // =========================

  const handleCancel = () => {
    setShowForm(false);
  };

  // =========================
  // Edit
  // =========================

  const handleEdit = () => {
    setShowForm(true);
  };

  // =========================
  // No review
  // =========================

  const noReview = selectedStatus === "failed" && selectedError?.status === 404;

  const isLoading = selectedStatus === "loading";

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <section>
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg">
            📝
          </span>

          <span className="text-sm font-medium text-primary">
            Daily Reflection
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
          Journal
        </h1>

        <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
          Reflect on your day, capture your thoughts, and build better habits.
        </p>
      </section>

      {/* ================= DATE SELECTOR ================= */}

      <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm">
                📅
              </span>

              <p className="font-semibold text-base-content">Review Date</p>
            </div>

            <p className="mt-1 pl-10 text-xs text-base-content/50">
              Choose a day to view or write your review.
            </p>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="input w-full border-base-300 bg-base-100 sm:w-auto"
          />
        </div>
      </section>

      {/* ================= LOADING ================= */}

      {isLoading && (
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary" />

            <p className="text-sm text-base-content/60">
              Loading your reflection...
            </p>
          </div>
        </div>
      )}

      {/* ================= ERROR ================= */}

      {selectedStatus === "failed" && !noReview && (
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
            {typeof selectedError === "string"
              ? selectedError
              : selectedError?.message || "Failed to load review."}
          </span>
        </div>
      )}

      {/* ================= EXISTING REVIEW ================= */}

      {selectedStatus === "succeeded" && selectedReview && !showForm && (
        <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          {/* Review Header */}

          <div className="border-b border-base-300 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-sm">
                    ✓
                  </span>

                  <h2 className="text-xl font-semibold text-base-content">
                    Daily Reflection
                  </h2>
                </div>

                <p className="mt-1 pl-10 text-sm text-base-content/50">
                  {new Date(selectedReview.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <button
                type="button"
                onClick={handleEdit}
                className="btn btn-sm btn-outline"
              >
                Edit Review
              </button>
            </div>
          </div>

          {/* Review Content */}

          <div className="space-y-6 p-5 sm:p-6">
            {/* Mood + Energy */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-base-300 bg-base-200/50 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">😊</span>

                  <p className="text-xs font-medium uppercase tracking-wide text-base-content/50">
                    Mood
                  </p>
                </div>

                <p className="mt-2 font-semibold text-base-content">
                  {selectedReview.mood || "Not recorded"}
                </p>
              </div>

              <div className="rounded-xl border border-base-300 bg-base-200/50 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>

                  <p className="text-xs font-medium uppercase tracking-wide text-base-content/50">
                    Energy
                  </p>
                </div>

                <p className="mt-2 font-semibold text-base-content">
                  {selectedReview.energy
                    ? `${selectedReview.energy}/10`
                    : "Not recorded"}
                </p>
              </div>
            </div>

            {/* What went well */}

            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm">✨</span>

                <p className="text-sm font-semibold text-base-content">
                  What went well?
                </p>
              </div>

              <p className="rounded-xl border border-base-300 bg-base-200/50 p-4 text-sm leading-6 text-base-content">
                {selectedReview.wentWell || "Nothing recorded."}
              </p>
            </div>

            {/* Improvement */}

            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm">🌱</span>

                <p className="text-sm font-semibold text-base-content">
                  What could you improve?
                </p>
              </div>

              <p className="rounded-xl border border-base-300 bg-base-200/50 p-4 text-sm leading-6 text-base-content">
                {selectedReview.improvement || "Nothing recorded."}
              </p>
            </div>

            {/* Tomorrow Priority */}

            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm">🎯</span>

                <p className="text-sm font-semibold text-base-content">
                  Tomorrow's Priority
                </p>
              </div>

              <p className="rounded-xl border border-base-300 bg-base-200/50 p-4 text-sm leading-6 text-base-content">
                {selectedReview.tomorrowPriority || "Nothing recorded."}
              </p>
            </div>

            {/* Notes */}

            {selectedReview.notes && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm">💭</span>

                  <p className="text-sm font-semibold text-base-content">
                    Additional Notes
                  </p>
                </div>

                <p className="rounded-xl border border-base-300 bg-base-200/50 p-4 text-sm leading-6 text-base-content">
                  {selectedReview.notes}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= CREATE REVIEW ================= */}

      {noReview && !showForm && (
        <section className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
            📝
          </div>

          <h2 className="mt-5 text-xl font-semibold text-base-content">
            No review for this day
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
            Take a few minutes to reflect on your day and capture what matters.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn btn-primary mt-6"
          >
            Write Review
          </button>
        </section>
      )}

      {/* ================= FORM ================= */}

      {showForm && (
        <ReviewForm
          key={selectedReview?._id || `new-${selectedDate}`}
          review={selectedReview}
          date={selectedDate}
          onSuccess={handleReviewSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* ================= REVIEW HISTORY ================= */}

      <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-sm">
              📚
            </span>

            <div>
              <h2 className="text-lg font-semibold text-base-content">
                Previous Reviews
              </h2>

              <p className="text-sm text-base-content/50">
                Your past reflections
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {reviews?.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((review) => (
                <button
                  key={review._id}
                  type="button"
                  onClick={() => {
                    setSelectedDate(
                      new Date(review.date).toISOString().split("T")[0],
                    );

                    setShowForm(false);
                  }}
                  className="group flex w-full items-center justify-between gap-4 rounded-xl border border-base-300 bg-base-100 p-4 text-left transition-all hover:border-primary/30 hover:bg-base-200/50"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-base-content">
                      {new Date(review.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <p className="mt-1 truncate text-sm text-base-content/50">
                      {review.mood || "Mood not recorded"}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {review.energy && (
                      <p className="text-sm font-medium text-base-content">
                        ⚡ {review.energy}/10
                      </p>
                    )}

                    <span className="text-xs font-medium text-primary transition-colors group-hover:text-primary/80">
                      View
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 text-xl">
                📝
              </div>

              <p className="mt-3 text-sm text-base-content/50">
                No previous reviews yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <div className="pb-4 text-center">
        <p className="text-xs text-base-content/40">
          Aven · Build your better days.
        </p>
      </div>
    </div>
  );
};

export default Journal;
