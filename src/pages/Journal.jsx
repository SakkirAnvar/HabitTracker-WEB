import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { JournalShimmer } from "../layout/Shimmer";
import { fetchReviewByDate, fetchReviews } from "../redux/reviewSlice";

import ReviewForm from "../components/reviews/ReviewForm";

const Journal = () => {
  const dispatch = useDispatch();

  const { reviews, selectedReview, selectedStatus, selectedError } =
    useSelector((store) => store.review);

  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const parseLocalDate = (dateString) => {
    return new Date(`${dateString}T00:00:00`);
  };

  const formatSelectedDate = (dateString) => {
    if (!dateString) return "-";

    return parseLocalDate(dateString).toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatReviewDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const [selectedDate, setSelectedDate] = useState(getLocalDateString());

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchReviewByDate(selectedDate));
    }
  }, [dispatch, selectedDate]);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const changeDate = (days) => {
    const current = parseLocalDate(selectedDate);

    current.setDate(current.getDate() + days);

    setSelectedDate(getLocalDateString(current));
    setShowForm(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setShowForm(false);
  };

  const goToToday = () => {
    setSelectedDate(getLocalDateString());
    setShowForm(false);
  };

  const handleReviewSuccess = () => {
    setShowForm(false);

    dispatch(fetchReviewByDate(selectedDate));
    dispatch(fetchReviews());
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleEdit = () => {
    setShowForm(true);
  };

  const noReview = selectedStatus === "failed" && selectedError?.status === 404;

  const isLoading = selectedStatus === "loading";

  const isViewMode =
    !showForm && selectedStatus === "succeeded" && Boolean(selectedReview);

  const filteredReviews = useMemo(() => {
    if (!reviews?.length) return [];

    let result = [...reviews];

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((review) => {
        const date = formatReviewDate(review.date).toLowerCase();

        const mood = (review.mood || "").toLowerCase();

        const wentWell = (review.wentWell || "").toLowerCase();

        const improvement = (review.improvement || "").toLowerCase();

        const priority = (review.tomorrowPriority || "").toLowerCase();

        const notes = (review.notes || "").toLowerCase();

        return (
          date.includes(query) ||
          mood.includes(query) ||
          wentWell.includes(query) ||
          improvement.includes(query) ||
          priority.includes(query) ||
          notes.includes(query)
        );
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [reviews, searchQuery, sortOrder]);

  const getMoodIcon = (mood) => {
    const value = mood?.toLowerCase() || "";

    if (value.includes("great")) return "😄";
    if (value.includes("good")) return "🙂";
    if (value.includes("okay")) return "😐";
    if (value.includes("low")) return "🙁";
    if (value.includes("bad")) return "😞";

    return "📝";
  };

  const getPreview = (review) => {
    const text =
      review.wentWell ||
      review.improvement ||
      review.tomorrowPriority ||
      review.notes ||
      "No reflection details available.";

    return text.length > 110 ? `${text.slice(0, 110)}...` : text;
  };

  return (
    <div className="w-full space-y-6 pb-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Journal
          </h1>

          <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
            Reflect on your day, capture your thoughts, and build better habits.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          {/* Previous */}

          <button
            type="button"
            onClick={() => changeDate(-1)}
            aria-label="Previous day"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-base-300 bg-base-100 text-base-content/55 transition hover:bg-base-200 hover:text-base-content"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Date */}

          <label className="flex h-10 items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-[128px] bg-transparent text-sm font-medium text-base-content outline-none"
            />
          </label>

          {/* Next */}

          <button
            type="button"
            onClick={() => changeDate(1)}
            aria-label="Next day"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-base-300 bg-base-100 text-base-content/55 transition hover:bg-base-200 hover:text-base-content"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Today */}

          <button
            type="button"
            onClick={goToToday}
            className="hidden h-10 rounded-xl bg-primary/5 px-4 text-xs font-semibold text-primary transition hover:bg-primary/10 sm:block"
          >
            Today
          </button>
        </div>
      </section>

      {isLoading && <JournalShimmer />}

      {selectedStatus === "failed" && !noReview && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error"
        >
          <span>⚠️</span>

          <span>
            {typeof selectedError === "string"
              ? selectedError
              : selectedError?.message || "Failed to load review."}
          </span>
        </div>
      )}

      {isViewMode && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-2 text-base-content/45">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 3v5h5"
                />
              </svg>
              Journal
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-base-content/25"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 18 6-6-6-6"
              />
            </svg>

            <span className="font-medium text-base-content/70">View Entry</span>
          </div>

          {/* ================= REVIEW CARD ================= */}

          <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            {/* Header */}

            <div className="border-b border-base-300 px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 6"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-base-content sm:text-2xl">
                      Journal Entry
                    </h2>

                    <p className="mt-1 text-sm text-base-content/50">
                      {formatSelectedDate(selectedDate)}
                    </p>
                  </div>
                </div>

                {/* Edit */}

                <button
                  type="button"
                  onClick={handleEdit}
                  className="btn btn-sm rounded-xl border border-primary/20 bg-primary/5 px-4 text-primary hover:border-primary/30 hover:bg-primary/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487a2.25 2.25 0 113.182 3.182L8.25 19.643 4 20l.357-4.25L16.862 4.487z"
                    />
                  </svg>
                  Edit Review
                </button>
              </div>
            </div>

            {/* Content */}

            <div className="space-y-4 p-5 sm:p-6">
              {/* Mood + Energy */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Mood */}

                <div className="rounded-xl border border-base-300 bg-base-200/30 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-base-content/40">
                    Mood
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-xl">
                      {getMoodIcon(selectedReview.mood)}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-base-content">
                        {selectedReview.mood || "Not recorded"}
                      </p>

                      {!selectedReview.mood && (
                        <p className="mt-0.5 text-xs text-base-content/40">
                          No mood selected.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Energy */}

                <div className="rounded-xl border border-base-300 bg-base-200/30 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-base-content/40">
                        Energy
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xl">⚡</span>

                        <span className="text-sm font-semibold text-base-content">
                          {selectedReview.energy
                            ? `${selectedReview.energy}/10`
                            : "Not recorded"}
                        </span>
                      </div>
                    </div>

                    {selectedReview.energy && (
                      <div className="w-32 sm:w-40">
                        <div className="h-2.5 overflow-hidden rounded-full bg-base-300">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${
                                Math.min(
                                  10,
                                  Math.max(
                                    0,
                                    Number(selectedReview.energy) || 0,
                                  ),
                                ) * 10
                              }%`,
                            }}
                          />
                        </div>

                        <div className="mt-1 flex justify-between text-[9px] text-base-content/35">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reflection */}

              <ReflectionViewBlock
                icon="✨"
                iconClass="bg-warning/10 text-warning"
                title="What went well?"
                value={selectedReview.wentWell}
              />

              <ReflectionViewBlock
                icon="🌱"
                iconClass="bg-success/10 text-success"
                title="What could you improve?"
                value={selectedReview.improvement}
              />

              <ReflectionViewBlock
                icon="🎯"
                iconClass="bg-error/10 text-error"
                title="Tomorrow's Priority"
                value={selectedReview.tomorrowPriority}
              />

              {selectedReview.notes && (
                <ReflectionViewBlock
                  icon="💭"
                  iconClass="bg-info/10 text-info"
                  title="Additional Notes"
                  value={selectedReview.notes}
                />
              )}
            </div>
          </section>
        </>
      )}

      {noReview && !showForm && (
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
          {/* Empty State */}

          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-base-300 bg-base-100 p-8 shadow-sm">
            <div className="max-w-lg text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/5 text-4xl">
                📖
              </div>

              <p className="mt-5 text-sm font-medium text-primary">
                {formatSelectedDate(selectedDate)}
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-base-content">
                No review for this day
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/55">
                Take a few minutes to reflect on your day, capture what
                mattered, and set yourself up for tomorrow.
              </p>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="btn btn-primary mt-6 rounded-xl px-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536M4 20l4.5-1 10.268-10.268a2.5 2.5 0 00-3.536-3.536L5 15.464 4 20z"
                  />
                </svg>
                Write Review
              </button>

              <p className="mt-5 text-xs italic text-base-content/35">
                “A better you, one reflection at a time.”
              </p>
            </div>
          </div>

          {/* Motivation */}

          <div className="relative hidden overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-6 xl:block">
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <p className="text-2xl font-bold leading-tight text-base-content">
                  Reflect today
                  <br />
                  for a brighter
                  <br />
                  tomorrow.
                </p>

                <div className="mt-5 h-px w-10 bg-primary/20" />

                <p className="mt-4 text-sm leading-6 text-base-content/55">
                  Small reflections create meaningful change.
                </p>
              </div>

              <div className="flex justify-end text-6xl opacity-60">🌿</div>
            </div>

            <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-primary/5" />

            <div className="absolute -right-10 top-16 h-32 w-32 rounded-full bg-secondary/5" />
          </div>
        </section>
      )}

      {showForm && (
        <ReviewForm
          key={selectedReview?._id || `new-${selectedDate}`}
          review={selectedReview}
          date={selectedDate}
          onSuccess={handleReviewSuccess}
          onCancel={handleCancel}
        />
      )}

      {!showForm && !isViewMode && (
        <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          {/* Header */}

          <div className="border-b border-base-300 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Title */}

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
                  📚
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-base-content">
                    Previous Reviews
                  </h2>

                  <p className="text-sm text-base-content/50">
                    Your past reflections
                  </p>
                </div>
              </div>

              {/* Search + Sort */}

              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex h-10 items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-base-content/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
                    />
                  </svg>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search entries..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-base-content/35 sm:w-48"
                  />
                </label>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="select select-sm h-10 min-h-10 rounded-xl border-base-300 bg-base-100 text-xs"
                >
                  <option value="newest">Latest first</option>

                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>
          </div>

          {/* Entries */}

          <div className="p-4 sm:p-5">
            {filteredReviews.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-base-300">
                {filteredReviews.map((review, index) => (
                  <button
                    key={review._id}
                    type="button"
                    onClick={() => {
                      setSelectedDate(
                        getLocalDateString(new Date(review.date)),
                      );

                      setShowForm(false);
                    }}
                    className={`group flex w-full items-center gap-4 p-4 text-left transition hover:bg-base-200/40 sm:p-5 ${
                      index !== 0 ? "border-t border-base-300" : ""
                    }`}
                  >
                    {/* Date */}

                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-base-200/70">
                      <span className="text-lg font-bold leading-none text-base-content">
                        {new Date(review.date).getDate()}
                      </span>

                      <span className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-base-content/40">
                        {new Date(review.date).toLocaleDateString(undefined, {
                          month: "short",
                        })}
                      </span>
                    </div>

                    {/* Mood */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base-200 text-lg">
                      {getMoodIcon(review.mood)}
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-base-content">
                          {review.mood || "Journal Entry"}
                        </p>

                        {review.energy && (
                          <span className="shrink-0 text-[10px] font-medium text-base-content/40">
                            ⚡ {review.energy}/10
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate text-xs leading-5 text-base-content/50">
                        {getPreview(review)}
                      </p>

                      <p className="mt-1 text-[10px] text-base-content/35">
                        {formatReviewDate(review.date)}
                      </p>
                    </div>

                    {/* Energy */}

                    {review.energy && (
                      <div className="hidden shrink-0 items-center gap-2 sm:flex">
                        <span className="text-sm">⚡</span>

                        <span className="text-sm font-semibold text-base-content">
                          {review.energy}/10
                        </span>
                      </div>
                    )}

                    {/* Arrow */}

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base-content/35 transition group-hover:bg-primary/5 group-hover:text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9 18 6-6-6-6"
                        />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 text-xl">
                  📝
                </div>

                <p className="mt-3 text-sm font-medium text-base-content">
                  {reviews?.length
                    ? "No matching reviews"
                    : "No previous reviews yet."}
                </p>

                <p className="mt-1 text-xs text-base-content/50">
                  {reviews?.length
                    ? "Try a different search."
                    : "Your reflections will appear here."}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="pb-2 text-center">
        <p className="text-xs text-base-content/35">
          Aven · Build your better days.
        </p>
      </div>
    </div>
  );
};

const ReflectionViewBlock = ({ icon, iconClass, title, value }) => {
  return (
    <div className="flex gap-3 rounded-xl border border-base-300 bg-base-200/20 p-4 sm:p-5">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-base-content">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-base-content/65">
          {value || "Nothing recorded."}
        </p>
      </div>
    </div>
  );
};

export default Journal;
