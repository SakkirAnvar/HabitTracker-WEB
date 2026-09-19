import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { JournalShimmer } from "../layout/Shimmer";
import Pagination from "../layout/Pagination";
import { fetchReviewByDate, fetchReviews } from "../redux/reviewSlice";
import ReviewForm from "../components/reviews/ReviewForm";

const ITEMS_PER_PAGE = 6;

const Journal = () => {
  const dispatch = useDispatch();

  const {
    reviews,
    selectedReview,
    selectedStatus,
    selectedError,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = useSelector((store) => store.review);

  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const parseLocalDate = (dateString) => {
    return new Date(`${dateString}T00:00:00`);
  };

  const isFutureDate = (dateString) => {
    if (!dateString) return false;

    const selected = parseLocalDate(dateString);
    const today = parseLocalDate(getLocalDateString());

    return selected > today;
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

  // const formatReviewDate = (date) => {
  //   if (!date) return "-";

  //   return new Date(date).toLocaleDateString(undefined, {
  //     weekday: "short",
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric",
  //   });
  // };

  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const isSelectedDateFuture = isFutureDate(selectedDate);

  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchReviewByDate(selectedDate));
    }
  }, [dispatch, selectedDate]);

  useEffect(() => {
    dispatch(
      fetchReviews({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        sort: sortOrder,
      }),
    );
  }, [dispatch, currentPage, searchQuery, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setSearchQuery(searchInput);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const changeDate = (days) => {
    const current = parseLocalDate(selectedDate);

    current.setDate(current.getDate() + days);

    const newDate = getLocalDateString(current);

    if (isFutureDate(newDate)) {
      return;
    }

    setSelectedDate(newDate);
    setShowForm(false);
    setEditingReview(null);
  };
  const handleDateChange = (e) => {
    const date = e.target.value;

    if (!date || isFutureDate(date)) {
      return;
    }

    setSelectedDate(date);
    setShowForm(false);
    setEditingReview(null);
  };

  const goToToday = () => {
    setSelectedDate(getLocalDateString());
    setShowForm(false);
    setEditingReview(null);
  };

  const handleReviewSuccess = () => {
    setShowForm(false);
    setEditingReview(null);

    dispatch(fetchReviewByDate(selectedDate));

    dispatch(
      fetchReviews({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        sort: sortOrder,
      }),
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const handleEdit = () => {
    if (!selectedReview) return;

    setEditingReview(selectedReview);
    setShowForm(true);
  };

  const handleWriteReview = () => {
    if (isSelectedDateFuture) return;

    setEditingReview(null);
    setShowForm(true);
  };

  const noReview = selectedStatus === "failed" && selectedError?.status === 404;

  const isLoading = selectedStatus === "loading";

  const isViewMode =
    !showForm && selectedStatus === "succeeded" && Boolean(selectedReview);

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

  const renderPreviousReviews = () => {
    return (
      <section className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/60">
              Journal history
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-base-content sm:text-2xl">
              Previous Reviews
            </h2>

            <p className="mt-1 text-sm text-base-content/50">
              Revisit your thoughts and progress over time.
            </p>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex h-10 items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 transition focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-base-content/35"
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search entries..."
                className="w-full bg-transparent text-xs outline-none placeholder:text-base-content/30 sm:w-52"
              />
            </label>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-sm h-10 min-h-10 rounded-xl border-base-300 bg-base-100 text-xs"
            >
              <option value="newest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {/* Reviews */}
        {reviews?.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review) => {
              const reviewDate = new Date(review.date);
              const isSelected =
                getLocalDateString(reviewDate) === selectedDate;

              return (
                <button
                  key={review._id}
                  type="button"
                  onClick={() => {
                    setSelectedDate(getLocalDateString(reviewDate));
                    setShowForm(false);
                    setEditingReview(null);
                  }}
                  className={`group relative w-full overflow-hidden rounded-2xl border bg-base-100 p-4 text-left shadow-sm transition-all duration-200 sm:p-5 ${
                    isSelected
                      ? "border-primary/20 bg-primary/[0.025] shadow-md"
                      : "border-base-300 hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-md"
                  }`}
                >
                  {/* Selected indicator */}
                  <div
                    className={`absolute inset-y-0 left-0 w-1 transition-all ${
                      isSelected
                        ? "bg-primary opacity-100"
                        : "bg-primary opacity-0 group-hover:opacity-50"
                    }`}
                  />

                  <div className="flex items-center gap-4 sm:gap-5">
                    {/* Date */}
                    <div
                      className={`flex h-[62px] w-[62px] shrink-0 flex-col items-center justify-center rounded-2xl ${
                        isSelected
                          ? "bg-primary text-primary-content"
                          : "bg-primary/5 text-primary"
                      }`}
                    >
                      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] opacity-70">
                        {reviewDate.toLocaleDateString(undefined, {
                          month: "short",
                        })}
                      </span>

                      <span className="mt-0.5 text-2xl font-bold leading-none">
                        {reviewDate.getDate()}
                      </span>

                      <span
                        className={`mt-1 text-[9px] font-medium ${
                          isSelected
                            ? "text-primary-content/70"
                            : "text-base-content/40"
                        }`}
                      >
                        {reviewDate.toLocaleDateString(undefined, {
                          weekday: "short",
                        })}
                      </span>
                    </div>

                    {/* Mood icon */}
                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-base-200/70 text-lg sm:flex">
                      {getMoodIcon(review.mood)}
                    </div>

                    {/* Main content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-base-content sm:text-[15px]">
                          {review.mood || "Journal Entry"}
                        </h3>

                        <span className="hidden h-1 w-1 rounded-full bg-base-content/20 sm:block" />

                        <span className="text-[11px] text-base-content/40">
                          {reviewDate.toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <p className="mt-1.5 line-clamp-1 text-sm leading-6 text-base-content/55">
                        {getPreview(review)}
                      </p>
                    </div>

                    {/* Energy */}
                    <div className="hidden items-center gap-2 md:flex">
                      <div className="flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1.5">
                        <span className="text-sm leading-none">⚡</span>

                        <span className="text-xs font-semibold text-base-content/70">
                          {review.energy ?? "—"}/10
                        </span>
                      </div>
                    </div>

                    {/* Mobile energy */}
                    <div className="flex shrink-0 items-center gap-2 md:hidden">
                      {review.energy && (
                        <span className="rounded-full bg-warning/10 px-2.5 py-1 text-[10px] font-semibold text-base-content/60">
                          ⚡ {review.energy}/10
                        </span>
                      )}
                    </div>

                    {/* Arrow */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "bg-base-200/60 text-base-content/30 group-hover:bg-primary/5 group-hover:text-primary"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
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
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-2xl">
              📝
            </div>

            <p className="mt-4 text-sm font-semibold text-base-content">
              {searchQuery.trim()
                ? "No matching reviews"
                : "No previous reviews yet."}
            </p>

            <p className="mt-1 text-xs text-base-content/45">
              {searchQuery.trim()
                ? "Try a different search."
                : "Your reflections will appear here."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-base-300 pt-4">
            <p className="hidden text-xs text-base-content/40 sm:block">
              Page{" "}
              <span className="font-semibold text-base-content/60">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-base-content/60">
                {totalPages}
              </span>
            </p>

            <div className="sm:ml-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </section>
    );
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
              max={getLocalDateString()}
              onChange={handleDateChange}
              className="w-[128px] bg-transparent text-sm font-medium text-base-content outline-none"
            />
          </label>

          {/* Next */}

          <button
            type="button"
            onClick={() => changeDate(1)}
            disabled={selectedDate >= getLocalDateString()}
            aria-label="Next day"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-base-300 bg-base-100 text-base-content/55 transition hover:bg-base-200 hover:text-base-content disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-base-100"
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
                d="M9 18l6-6-6-6"
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

      {showForm && !isSelectedDateFuture && (
        <ReviewForm
          review={editingReview}
          date={selectedDate}
          onSuccess={handleReviewSuccess}
          onCancel={handleCancel}
        />
      )}

      {isViewMode && (
        <>
          <section className="space-y-5">
            {/* Breadcrumb */}

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
                className="h-3.5 w-3.5 text-base-content/20"
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

              <span className="font-medium text-base-content/65">Entry</span>
            </div>

            <section className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
              {/* Entry menu */}
              <div className="dropdown dropdown-end absolute right-5 top-4 z-40 sm:right-7 sm:top-5 lg:right-8 lg:top-5">
                <button
                  type="button"
                  tabIndex={0}
                  aria-label="Review options"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-base-content/40 transition hover:bg-base-200 hover:text-base-content"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="5" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="19" cy="12" r="1.5" />
                  </svg>
                </button>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu z-50 mt-1 w-40 rounded-xl border border-base-300 bg-base-100 p-1.5 shadow-lg"
                >
                  <li>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="flex items-center gap-2"
                    >
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
                          d="M16.862 4.487a2.25 2.25 0 113.182 3.182L8.25 19.643 4 20l.357-4.25L16.862 4.487z"
                        />
                      </svg>
                      Edit Review
                    </button>
                  </li>
                </ul>
              </div>

              {/* Soft background atmosphere */}
              <div className="absolute inset-0">
                <div className="absolute inset-y-0 right-0 w-[58%] bg-gradient-to-l from-primary/5 via-primary/[0.025] to-transparent" />

                <div className="absolute right-24 top-8 h-24 w-24 rounded-full bg-secondary/5 blur-2xl" />
              </div>

              {/* Mountain landscape */}
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] overflow-hidden lg:block">
                <svg
                  viewBox="0 0 760 300"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="journalSky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#eef8f6" />
                      <stop offset="100%" stopColor="#dcebe7" />
                    </linearGradient>

                    <linearGradient
                      id="journalBackMountain"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#dcebe8" />
                      <stop offset="100%" stopColor="#b9d3cc" />
                    </linearGradient>

                    <linearGradient
                      id="journalMiddleMountain"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#b6d0c9" />
                      <stop offset="100%" stopColor="#789f94" />
                    </linearGradient>

                    <linearGradient
                      id="journalFrontMountain"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#72998f" />
                      <stop offset="100%" stopColor="#426f63" />
                    </linearGradient>

                    <linearGradient
                      id="journalMist"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor="#ffffff"
                        stopOpacity="0.95"
                      />
                      <stop
                        offset="45%"
                        stopColor="#ffffff"
                        stopOpacity="0.35"
                      />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient
                      id="journalFade"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop
                        offset="32%"
                        stopColor="#ffffff"
                        stopOpacity="0.65"
                      />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Sky */}
                  <rect width="760" height="300" fill="url(#journalSky)" />

                  {/* Distant mountains */}
                  <path
                    d="
          M0 205
          C80 184 115 160 174 137
          C227 116 263 82 317 93
          C359 101 382 135 422 142
          C463 150 501 119 543 100
          C595 77 634 92 680 114
          C716 132 738 143 760 149
          V300
          H0
          Z
        "
                    fill="url(#journalBackMountain)"
                    opacity="0.72"
                  />

                  {/* Main mountain */}
                  <path
                    d="
          M0 245
          C62 220 111 188 161 164
          C212 139 250 112 300 91
          C337 75 354 84 381 104
          C414 128 427 151 458 158
          C495 166 524 143 558 124
          C598 101 633 95 668 116
          C705 138 724 157 760 169
          V300
          H0
          Z
        "
                    fill="url(#journalMiddleMountain)"
                    opacity="0.78"
                  />

                  {/* Mountain highlight */}
                  <path
                    d="
          M250 118
          C276 105 301 90 321 93
          C342 97 361 119 379 135
          C357 126 340 124 325 134
          C310 143 293 158 277 168
          C284 148 270 132 250 118
          Z
        "
                    fill="#e9f4f1"
                    opacity="0.8"
                  />

                  {/* Mist */}
                  <path
                    d="
          M0 177
          C89 157 154 165 222 148
          C284 132 340 137 400 145
          C471 154 513 132 573 121
          C647 108 694 119 760 138
          V188
          C688 171 629 177 564 169
          C494 160 441 177 382 169
          C313 159 257 176 190 169
          C118 162 63 176 0 190
          Z
        "
                    fill="url(#journalMist)"
                  />

                  {/* Foreground hills */}
                  <path
                    d="
          M0 260
          C69 231 115 220 164 225
          C210 230 238 250 285 242
          C337 232 365 208 414 211
          C462 214 486 236 528 232
          C577 228 599 195 649 191
          C694 187 728 203 760 222
          V300
          H0
          Z
        "
                    fill="url(#journalFrontMountain)"
                  />

                  {/* Forest texture */}
                  <g fill="#315f54" opacity="0.3">
                    <path d="M98 247l10-28 10 28h-6l7 13H97l7-13z" />
                    <path d="M125 239l8-23 8 23h-5l6 12h-18l6-12z" />
                    <path d="M157 248l11-31 11 31h-7l8 14h-24l8-14z" />

                    <path d="M575 225l9-27 9 27h-6l7 13h-20l7-13z" />
                    <path d="M605 215l8-23 8 23h-5l6 12h-18l6-12z" />
                    <path d="M637 211l10-29 10 29h-6l7 13h-22l7-13z" />
                    <path d="M673 216l8-24 8 24h-5l6 12h-18l6-12z" />
                  </g>

                  {/* Left fade */}
                  <rect
                    x="0"
                    y="0"
                    width="390"
                    height="300"
                    fill="url(#journalFade)"
                  />

                  {/* Bottom haze */}
                  <rect
                    x="0"
                    y="248"
                    width="760"
                    height="52"
                    fill="#e1efeb"
                    opacity="0.28"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10 p-5 sm:p-7 lg:p-8">
                <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
                  {/* Left content */}
                  <div>
                    <div className="flex items-start gap-5">
                      {/* Date */}
                      <div className="flex h-[76px] w-[76px] shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/5 text-primary ring-1 ring-primary/5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/60">
                          {new Date(selectedDate).toLocaleDateString("en-IN", {
                            weekday: "short",
                          })}
                        </span>

                        <span className="mt-0.5 text-3xl font-bold leading-none">
                          {new Date(selectedDate).getDate()}
                        </span>

                        <span className="mt-1 text-[10px] font-bold uppercase tracking-wide">
                          {new Date(selectedDate).toLocaleDateString("en-IN", {
                            month: "short",
                          })}
                        </span>
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">
                          {new Date(selectedDate).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>

                        <h2 className="mt-1 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                          Journal Entry
                        </h2>

                        <p className="mt-2 max-w-xl text-sm text-base-content/55 sm:text-base">
                          A look back at your day, and a step forward to a
                          better tomorrow.
                        </p>
                      </div>
                    </div>

                    {/* Mood + Energy */}
                    <div className="mt-5 grid max-w-[585px] gap-3 sm:grid-cols-2">
                      {/* Mood */}
                      <div className="flex items-center gap-4 rounded-xl border border-base-300 bg-base-100/90 p-3.5 shadow-sm backdrop-blur-sm">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-2xl">
                          🙂
                        </div>

                        <div>
                          <p className="text-xs font-medium text-base-content/45">
                            Mood
                          </p>

                          <p className="mt-0.5 text-base font-semibold text-base-content">
                            {selectedReview?.mood || "—"}
                          </p>
                        </div>
                      </div>

                      {/* Energy */}
                      <div className="flex items-center gap-4 rounded-xl border border-base-300 bg-base-100/90 p-3.5 shadow-sm backdrop-blur-sm">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-2xl">
                          ⚡
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-base-content/45">
                                Energy
                              </p>

                              <p className="mt-0.5 text-base font-semibold text-base-content">
                                {selectedReview?.energy ?? "—"}/10
                              </p>
                            </div>

                            {selectedReview?.energy && (
                              <div className="ml-4 w-28">
                                <div className="h-2 overflow-hidden rounded-full bg-base-300">
                                  <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.max(
                                          0,
                                          Number(selectedReview.energy) * 10,
                                        ),
                                      )}%`,
                                    }}
                                  />
                                </div>

                                <div className="mt-1 flex justify-between text-[10px] text-base-content/40">
                                  <span>Low</span>
                                  <span>High</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="hidden justify-end lg:flex">
                    <div className="max-w-[250px] pt-4 pr-2 text-right">
                      <p className="text-base italic leading-7 text-base-content/55">
                        “Small reflections
                        <br />
                        create a brighter tomorrow.”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ReflectionCard
                  icon="✨"
                  iconClass="bg-warning/10 text-warning"
                  accentClass="bg-warning"
                  title="What went well?"
                  value={selectedReview.wentWell}
                  footer="Celebrate the wins, big or small."
                />

                <ReflectionCard
                  icon="🌱"
                  iconClass="bg-success/10 text-success"
                  accentClass="bg-success"
                  title="What could you improve?"
                  value={selectedReview.improvement}
                  footer="Every day is a chance to grow."
                />

                <ReflectionCard
                  icon="🎯"
                  iconClass="bg-error/10 text-error"
                  accentClass="bg-error"
                  title="Tomorrow's Priority"
                  value={selectedReview.tomorrowPriority}
                  footer="Carry one clear focus into tomorrow."
                />

                {selectedReview.notes && (
                  <ReflectionCard
                    icon="💭"
                    iconClass="bg-info/10 text-info"
                    accentClass="bg-info"
                    title="Additional Notes"
                    value={selectedReview.notes}
                    footer="Capture thoughts worth remembering."
                  />
                )}
              </div>
            </div>

            <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-6 sm:p-7">
              <div className="relative z-10 max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/60">
                  Aven reminder
                </p>

                <p className="mt-3 text-xl font-semibold leading-8 text-base-content sm:text-2xl">
                  “Small reflections create meaningful change.”
                </p>

                <p className="mt-2 text-sm text-base-content/50">
                  Keep showing up, one better day at a time.
                </p>
              </div>

              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10" />

              <div className="absolute -bottom-10 right-20 h-24 w-24 rounded-full bg-secondary/10" />
            </section>
          </section>

          {renderPreviousReviews()}
        </>
      )}

      {!showForm && noReview && (
        <>
          {/* Create / No Review */}

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
                  {isSelectedDateFuture
                    ? "No review available yet"
                    : "No review for this day"}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/55">
                  {isSelectedDateFuture
                    ? "Reviews can only be written for today or previous days."
                    : "Take a few minutes to reflect on your day, capture what mattered, and set yourself up for tomorrow."}
                </p>

                {!isSelectedDateFuture ? (
                  <button
                    type="button"
                    onClick={handleWriteReview}
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
                ) : (
                  <p className="mt-6 text-sm font-medium text-base-content/45">
                    You can write a review once this day has passed.
                  </p>
                )}

                {!isSelectedDateFuture && (
                  <p className="mt-5 text-xs italic text-base-content/35">
                    “A better you, one reflection at a time.”
                  </p>
                )}
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

          {/* Previous Reviews */}

          {renderPreviousReviews()}
        </>
      )}

      <div className="pb-2 text-center">
        <p className="text-xs text-base-content/35">
          Aven · Build your better days.
        </p>
      </div>
    </div>
  );
};
const ReflectionCard = ({
  icon,
  iconClass,
  title,
  value,
  footer,
  accentClass = "bg-primary",
}) => {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-md sm:p-6">
      {/* Accent */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${accentClass} opacity-70`}
      />

      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${iconClass}`}
            >
              {icon}
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-content/40">
                Reflection
              </p>

              <h3 className="mt-1 text-sm font-semibold text-base-content">
                {title}
              </h3>
            </div>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-base-content/15 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 18 6-6-6-6"
            />
          </svg>
        </div>

        {/* Reflection content */}
        <div className="mt-6 flex-1">
          <p className="text-[15px] leading-7 text-base-content/75">
            {value || "Nothing recorded."}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center gap-2 border-t border-base-300 pt-3">
          <span className={`h-1.5 w-1.5 rounded-full ${accentClass}`} />

          <p className="text-xs text-base-content/40">{footer}</p>
        </div>
      </div>
    </article>
  );
};

export default Journal;
