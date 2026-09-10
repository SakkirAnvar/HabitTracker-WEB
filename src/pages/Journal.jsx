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

  /* ================= FETCH TODAY'S REVIEW ================= */

  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchReviewByDate(selectedDate));
    }
  }, [dispatch, selectedDate]);

  /* ================= FETCH REVIEW HISTORY ================= */

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  /* ================= DATE CHANGE ================= */

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setShowForm(false);
  };

  /* ================= REVIEW SUCCESS ================= */

  const handleReviewSuccess = () => {
    setShowForm(false);

    dispatch(fetchReviewByDate(selectedDate));
    dispatch(fetchReviews());
  };

  /* ================= REVIEW CANCEL ================= */

  const handleCancel = () => {
    setShowForm(false);
  };

  /* ================= EDIT ================= */

  const handleEdit = () => {
    setShowForm(true);
  };

  /* ================= NO REVIEW ================= */

  const noReview = selectedStatus === "failed" && selectedError?.status === 404;

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Journal</h1>

        <p className="mt-1 text-sm text-base-content/60">
          Reflect on your day and build better habits.
        </p>
      </div>

      {/* ================= DATE SELECTOR ================= */}

      <div className="rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Review Date</p>

            <p className="text-xs text-base-content/50">
              Choose a day to view or write your review.
            </p>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="input input-bordered"
          />
        </div>
      </div>

      {/* ================= LOADING ================= */}

      {selectedStatus === "loading" && (
        <div className="flex min-h-[250px] items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {/* ================= ERROR ================= */}

      {selectedStatus === "failed" && !noReview && (
        <div className="alert alert-error">
          <span>
            {typeof selectedError === "string"
              ? selectedError
              : selectedError?.message || "Failed to load review."}
          </span>
        </div>
      )}

      {/* ================= REVIEW ================= */}

      {selectedStatus === "succeeded" && selectedReview && !showForm && (
        <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="border-b border-base-200 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Daily Reflection</h2>

                <p className="text-sm text-base-content/50">
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

          <div className="space-y-5 p-5">
            {/* Mood + Energy */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-base-200 p-4">
                <p className="text-xs text-base-content/50">Mood</p>

                <p className="mt-1 font-semibold">
                  {selectedReview.mood || "Not recorded"}
                </p>
              </div>

              <div className="rounded-lg bg-base-200 p-4">
                <p className="text-xs text-base-content/50">Energy</p>

                <p className="mt-1 font-semibold">
                  {selectedReview.energy
                    ? `${selectedReview.energy}/10`
                    : "Not recorded"}
                </p>
              </div>
            </div>

            {/* What went well */}

            <div>
              <p className="mb-1 text-sm font-semibold">What went well?</p>

              <p className="rounded-lg bg-base-200 p-4 text-sm leading-6">
                {selectedReview.wentWell || "Nothing recorded."}
              </p>
            </div>

            {/* Improvement */}

            <div>
              <p className="mb-1 text-sm font-semibold">
                What could you improve?
              </p>

              <p className="rounded-lg bg-base-200 p-4 text-sm leading-6">
                {selectedReview.improvement}
              </p>
            </div>

            {/* Tomorrow Priority */}

            <div>
              <p className="mb-1 text-sm font-semibold">Tomorrow's Priority</p>

              <p className="rounded-lg bg-base-200 p-4 text-sm leading-6">
                {selectedReview.tomorrowPriority}
              </p>
            </div>

            {/* Notes */}

            {selectedReview.notes && (
              <div>
                <p className="mb-1 text-sm font-semibold">Additional Notes</p>

                <p className="rounded-lg bg-base-200 p-4 text-sm leading-6">
                  {selectedReview.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= CREATE REVIEW ================= */}

      {noReview && !showForm && (
        <div className="rounded-xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-sm">
          <div className="text-5xl">📝</div>

          <h2 className="mt-4 text-xl font-semibold">No review for this day</h2>

          <p className="mt-2 text-sm text-base-content/60">
            Take a few minutes to reflect on your day.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn btn-primary mt-5"
          >
            Write Review
          </button>
        </div>
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

      <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-200 p-5">
          <h2 className="text-lg font-semibold">Previous Reviews</h2>

          <p className="text-sm text-base-content/50">Your past reflections</p>
        </div>

        <div className="p-5">
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
                  className="flex w-full items-center justify-between rounded-lg border border-base-300 p-4 text-left transition hover:bg-base-200"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(review.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <p className="mt-1 text-sm text-base-content/50">
                      {review.mood || "Mood not recorded"}
                    </p>
                  </div>

                  <div className="text-right">
                    {review.energy && (
                      <p className="text-sm font-medium">
                        ⚡ {review.energy}/10
                      </p>
                    )}

                    <span className="text-xs text-primary">View</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-base-content/50">
                No previous reviews yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
