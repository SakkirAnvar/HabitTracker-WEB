const Shimmer = ({ className = "" }) => {
  return (
    <div className={`animate-pulse rounded-lg bg-base-300/70 ${className}`} />
  );
};

export const CardShimmer = ({ rows = 3, className = "" }) => {
  return (
    <div
      className={`rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm ${className}`}
    >
      <Shimmer className="mb-4 h-5 w-2/5" />

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Shimmer
            key={index}
            className={`h-4 ${index === rows - 1 ? "w-3/5" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
};

export const PageHeaderShimmer = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <Shimmer className="h-8 w-40" />
        <Shimmer className="h-4 w-64" />
      </div>

      <Shimmer className="h-10 w-28 rounded-xl" />
    </div>
  );
};

export const HabitShimmer = () => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Shimmer className="h-11 w-11 shrink-0 rounded-xl" />

            <div className="min-w-0 flex-1 space-y-2">
              <Shimmer className="h-5 w-3/5" />
              <Shimmer className="h-4 w-4/5" />
            </div>

            <Shimmer className="h-8 w-8 rounded-lg" />
          </div>

          <div className="mt-4 flex gap-2">
            <Shimmer className="h-6 w-16 rounded-full" />
            <Shimmer className="h-6 w-20 rounded-full" />
          </div>

          <div className="mt-6">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="mt-2 h-5 w-20" />

            <Shimmer className="mt-5 h-10 w-full rounded-xl" />

            <div className="mt-4 flex justify-between">
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-4 w-12" />
            </div>

            <Shimmer className="mt-3 h-1.5 w-full rounded-full" />
          </div>

          <div className="mt-5 border-t border-base-300 pt-4">
            <div className="flex justify-between">
              <Shimmer className="h-4 w-28" />
              <Shimmer className="h-4 w-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const GoalShimmer = () => {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6"
        >
          {/* ================= HEADER ================= */}

          <div className="flex items-start gap-4">
            {/* Goal icon */}

            <Shimmer className="h-12 w-12 shrink-0 rounded-xl" />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                {/* Title + description */}

                <div className="min-w-0 flex-1 space-y-2">
                  <Shimmer className="h-5 w-2/3 rounded-md" />
                  <Shimmer className="h-3.5 w-4/5 rounded-md" />
                  <Shimmer className="h-3.5 w-3/5 rounded-md" />
                </div>

                {/* Status + menu */}

                <div className="flex shrink-0 items-center gap-2">
                  <Shimmer className="h-6 w-16 rounded-full" />
                  <Shimmer className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= PROGRESS ================= */}

          <div className="mt-6">
            <div className="mb-2 flex items-end justify-between gap-3">
              <Shimmer className="h-7 w-14 rounded-md" />
              <Shimmer className="h-4 w-24 rounded-md" />
            </div>

            {/* Progress bar */}

            <Shimmer className="h-2 w-full rounded-full" />
          </div>

          {/* ================= META ================= */}

          <div className="mt-5 grid grid-cols-3 divide-x divide-base-300 border-y border-base-300 py-4">
            {/* Started */}

            <div className="pr-3 space-y-2">
              <Shimmer className="h-2.5 w-12 rounded-md" />
              <Shimmer className="h-4 w-20 rounded-md" />
            </div>

            {/* Deadline */}

            <div className="px-3 space-y-2">
              <Shimmer className="h-2.5 w-14 rounded-md" />
              <Shimmer className="h-4 w-20 rounded-md" />
            </div>

            {/* Time left */}

            <div className="pl-3 space-y-2">
              <Shimmer className="h-2.5 w-14 rounded-md" />
              <Shimmer className="h-4 w-20 rounded-md" />
            </div>
          </div>

          {/* ================= HABITS ================= */}

          <div className="mt-5">
            {/* Habits header */}

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="space-y-2">
                  <Shimmer className="h-4 w-14 rounded-md" />
                  <Shimmer className="h-3 w-28 rounded-md" />
                </div>

                <Shimmer className="h-5 w-5 rounded-full" />
              </div>

              <Shimmer className="h-7 w-24 rounded-full" />
            </div>

            {/* Attached habit chips */}

            <div className="mt-3 flex flex-wrap gap-2">
              <Shimmer className="h-7 w-24 rounded-full" />
              <Shimmer className="h-7 w-28 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================
   JOURNAL SHIMMER
========================= */

export const JournalShimmer = () => {
  return (
    <div className="w-full space-y-6 pb-8">
      {/* Page Header */}
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Shimmer className="h-8 w-32 sm:h-9" />
          <Shimmer className="h-4 w-80 max-w-full" />
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <Shimmer className="h-10 w-10 rounded-xl" />
          <Shimmer className="h-10 w-40 rounded-xl" />
          <Shimmer className="h-10 w-10 rounded-xl" />
          <Shimmer className="hidden h-10 w-16 rounded-xl sm:block" />
        </div>
      </section>

      {/* Journal Entry */}
      <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {/* Header */}
        <div className="border-b border-base-300 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shimmer className="h-11 w-11 shrink-0 rounded-xl" />

              <div className="space-y-2">
                <Shimmer className="h-6 w-40 sm:h-7" />
                <Shimmer className="h-4 w-32" />
              </div>
            </div>

            <Shimmer className="h-9 w-28 rounded-xl" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 p-5 sm:p-6">
          {/* Mood + Energy */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-base-300 bg-base-200/30 p-4">
              <Shimmer className="h-3 w-14" />

              <div className="mt-4 flex items-center gap-3">
                <Shimmer className="h-10 w-10 rounded-xl" />

                <Shimmer className="h-4 w-24" />
              </div>
            </div>

            <div className="rounded-xl border border-base-300 bg-base-200/30 p-4">
              <Shimmer className="h-3 w-14" />

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Shimmer className="h-5 w-5 rounded-md" />
                  <Shimmer className="h-4 w-14" />
                </div>

                <Shimmer className="h-2.5 w-32 rounded-full sm:w-40" />
              </div>
            </div>
          </div>

          {/* Reflection Blocks */}
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-xl border border-base-300 bg-base-200/20 p-4 sm:p-5"
            >
              <Shimmer className="h-10 w-10 shrink-0 rounded-xl" />

              <div className="min-w-0 flex-1 space-y-2">
                <Shimmer className="h-4 w-36" />
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Previous Reviews */}
      <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Shimmer className="h-10 w-10 rounded-xl" />

              <div className="space-y-2">
                <Shimmer className="h-5 w-36" />
                <Shimmer className="h-4 w-28" />
              </div>
            </div>

            <div className="flex gap-2">
              <Shimmer className="h-10 w-56 rounded-xl" />
              <Shimmer className="h-10 w-28 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Review Rows */}
        <div className="p-4 sm:p-5">
          <div className="overflow-hidden rounded-xl border border-base-300">
            {[1, 2, 3, 4].map((item, index) => (
              <div
                key={item}
                className={`flex items-center gap-4 p-4 sm:p-5 ${
                  index !== 0 ? "border-t border-base-300" : ""
                }`}
              >
                <Shimmer className="h-14 w-14 shrink-0 rounded-xl" />
                <Shimmer className="h-10 w-10 shrink-0 rounded-xl" />

                <div className="min-w-0 flex-1 space-y-2">
                  <Shimmer className="h-4 w-40" />
                  <Shimmer className="h-3 w-72 max-w-full" />
                  <Shimmer className="h-3 w-28" />
                </div>

                <Shimmer className="hidden h-4 w-14 sm:block" />
                <Shimmer className="h-8 w-8 shrink-0 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="pb-2 text-center">
        <Shimmer className="mx-auto h-3 w-40" />
      </div>
    </div>
  );
};

export const AnalyticsShimmer = () => {
  return (
    <div className="w-full space-y-7 pb-8">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-8 w-56" />
          <Shimmer className="h-4 w-80 max-w-full" />
        </div>

        <Shimmer className="h-10 w-32 rounded-xl" />
      </div>

      {/* ================= HERO ================= */}

      <div className="relative h-44 overflow-hidden rounded-3xl border border-primary/10 bg-base-100">
        <Shimmer className="absolute left-6 top-6 h-7 w-24 rounded-full" />

        <Shimmer className="absolute left-6 top-17 h-7 w-96 max-w-[70%] rounded-md" />

        <Shimmer className="absolute left-6 top-29 h-4 w-2/3 max-w-[520px]" />

        {/* Decorative shapes */}

        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-base-300/30" />

        <div className="absolute bottom-4 right-16 h-20 w-20 rounded-full bg-base-300/25" />
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <Shimmer className="h-4 w-28" />
                <Shimmer className="mt-3 h-9 w-20" />
              </div>

              <Shimmer className="h-10 w-10 rounded-xl" />
            </div>

            <Shimmer className="mt-4 h-1.5 w-full rounded-full" />
            <Shimmer className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>

      {/* ================= CATEGORY ================= */}

      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <div className="mb-5 space-y-2">
          <Shimmer className="h-5 w-40" />
          <Shimmer className="h-4 w-80 max-w-full" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-base-300 bg-base-200/30 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Shimmer className="h-10 w-10 rounded-xl" />

                  <div className="space-y-2">
                    <Shimmer className="h-4 w-20" />
                    <Shimmer className="h-3 w-28" />
                  </div>
                </div>

                <Shimmer className="h-4 w-10" />
              </div>

              <Shimmer className="mt-4 h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* ================= WEEKLY + CALENDAR ================= */}

      <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Weekly */}

        <div className="flex min-w-0">
          <div className="flex h-full w-full flex-col rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
            {/* Header */}

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Shimmer className="h-11 w-11 shrink-0 rounded-xl" />

                <div className="space-y-2">
                  <Shimmer className="h-5 w-36" />
                  <Shimmer className="h-4 w-52 max-w-[90%]" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Shimmer className="hidden h-9 w-20 sm:block" />
                <Shimmer className="h-10 w-24 rounded-xl" />
              </div>
            </div>

            {/* Chart */}

            <div className="mt-5 flex flex-1 items-center">
              <div className="relative h-[300px] w-full">
                <div className="absolute bottom-10 left-0 top-2 w-8">
                  <div className="flex h-full flex-col justify-between">
                    <Shimmer className="h-3 w-6" />
                    <Shimmer className="h-3 w-6" />
                    <Shimmer className="h-3 w-6" />
                    <Shimmer className="h-3 w-6" />
                    <Shimmer className="h-3 w-6" />
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 right-0 top-2">
                  <div className="absolute inset-0 flex items-end justify-between gap-3">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <Shimmer
                        key={index}
                        className="w-[11%] rounded-t-xl rounded-b-none"
                        style={{
                          height: `${25 + ((index * 19) % 70)}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="mt-3 border-t border-base-300 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Shimmer className="h-2.5 w-12" />
                  <Shimmer className="h-3.5 w-24" />
                </div>

                <div className="space-y-2 text-right">
                  <Shimmer className="ml-auto h-2.5 w-14" />
                  <Shimmer className="ml-auto h-3.5 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}

        <div className="flex min-w-0">
          <div className="flex h-full w-full flex-col rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-5">
            {/* Header */}

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Shimmer className="h-11 w-11 shrink-0 rounded-xl" />

                <div className="space-y-2">
                  <Shimmer className="h-5 w-44" />
                  <Shimmer className="h-4 w-48 max-w-full" />
                </div>
              </div>

              <Shimmer className="h-9 w-16 rounded-xl" />
            </div>

            {/* Monthly consistency */}

            <div className="mt-5 space-y-2">
              <Shimmer className="h-3 w-32" />

              <div className="flex items-end justify-between">
                <Shimmer className="h-8 w-14" />
                <Shimmer className="h-3 w-20" />
              </div>

              <Shimmer className="h-1.5 w-full rounded-full" />
            </div>

            {/* Legend */}

            <div className="mt-5 flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <Shimmer className="h-2.5 w-2.5 rounded-sm" />
                  <Shimmer className="h-3 w-14" />
                </div>
              ))}
            </div>

            {/* Weekdays */}

            <div className="mt-6 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 7 }).map((_, index) => (
                <Shimmer key={index} className="h-3 w-4 justify-self-center" />
              ))}
            </div>

            {/* Calendar */}

            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 30 }).map((_, index) => (
                <Shimmer
                  key={index}
                  className="aspect-square min-h-8 rounded-lg"
                />
              ))}
            </div>

            {/* Footer */}

            <div className="mt-5 grid grid-cols-3 divide-x divide-base-300 border-t border-base-300 pt-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`space-y-2 ${
                    index === 0 ? "pr-3" : index === 1 ? "px-3" : "pl-3"
                  }`}
                >
                  <Shimmer className="h-2.5 w-14" />
                  <Shimmer className="h-5 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MONTHLY ================= */}

      <div className="rounded-2xl border border-base-300 bg-base-100 px-5 pb-4 pt-5 shadow-sm sm:px-6">
        {/* Header */}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shimmer className="h-11 w-11 shrink-0 rounded-xl" />

            <div className="space-y-2">
              <Shimmer className="h-5 w-40" />
              <Shimmer className="h-4 w-60" />
            </div>
          </div>

          <div className="hidden items-center gap-4 sm:flex">
            <div className="space-y-2">
              <Shimmer className="ml-auto h-2.5 w-20" />
              <Shimmer className="ml-auto h-5 w-12" />
            </div>

            <div className="h-8 w-px bg-base-300" />

            <div className="space-y-2">
              <Shimmer className="ml-auto h-2.5 w-12" />
              <Shimmer className="ml-auto h-5 w-10" />
            </div>

            <div className="h-8 w-px bg-base-300" />

            <Shimmer className="h-9 w-24 rounded-xl" />
          </div>
        </div>

        {/* Chart */}

        <div className="mt-5 h-[285px]">
          <div className="relative h-full">
            <div className="absolute bottom-9 left-0 top-2 w-9">
              <div className="flex h-full flex-col justify-between">
                <Shimmer className="h-3 w-7" />
                <Shimmer className="h-3 w-7" />
                <Shimmer className="h-3 w-7" />
                <Shimmer className="h-3 w-7" />
                <Shimmer className="h-3 w-7" />
              </div>
            </div>

            <div className="absolute bottom-9 left-11 right-0 top-2">
              {/* Grid */}

              <div className="absolute inset-x-0 top-0 flex h-full flex-col justify-between">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-t border-dashed border-base-300/70"
                  />
                ))}
              </div>

              {/* Fake smooth line */}

              <svg
                viewBox="0 0 1000 260"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 225 C80 190 120 205 190 170 C260 135 300 180 365 145 C430 110 470 150 535 120 C600 90 650 135 710 105 C770 78 820 115 880 75 C930 50 965 78 1000 60"
                  fill="none"
                  className="stroke-base-300"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <path
                  d="M0 225 C80 190 120 205 190 170 C260 135 300 180 365 145 C430 110 470 150 535 120 C600 90 650 135 710 105 C770 78 820 115 880 75 C930 50 965 78 1000 60 L1000 260 L0 260 Z"
                  className="fill-base-300/20"
                />
              </svg>

              {/* X labels */}

              <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                {Array.from({ length: 7 }).map((_, index) => (
                  <Shimmer key={index} className="h-3 w-10" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= HABIT STREAK ================= */}

      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        {/* Header */}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shimmer className="h-11 w-11 shrink-0 rounded-xl" />

            <div className="space-y-2">
              <Shimmer className="h-5 w-32" />
              <Shimmer className="h-4 w-64 max-w-full" />
            </div>
          </div>

          <Shimmer className="h-10 w-40 rounded-xl" />
        </div>

        {/* Streak cards */}

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[0.75fr_0.75fr_1.5fr]">
          <div className="h-32 rounded-2xl bg-base-200/60">
            <div className="p-5 space-y-3">
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-9 w-20" />
              <Shimmer className="h-3 w-28" />
            </div>
          </div>

          <div className="h-32 rounded-2xl bg-base-200/60">
            <div className="p-5 space-y-3">
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-9 w-20" />
              <Shimmer className="h-3 w-28" />
            </div>
          </div>

          <div className="h-32 rounded-2xl bg-primary/5 p-5">
            <Shimmer className="h-3 w-32" />
            <Shimmer className="mt-2 h-4 w-64 max-w-full" />
            <Shimmer className="mt-5 h-2 w-full rounded-full" />
            <div className="mt-3 flex justify-between">
              <Shimmer className="h-3 w-12" />
              <Shimmer className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= CLOSING BANNER ================= */}

      <div className="relative h-28 overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="space-y-2">
          <Shimmer className="h-5 w-48" />
          <Shimmer className="h-4 w-80 max-w-full" />
        </div>

        <Shimmer className="absolute right-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-2xl" />
      </div>
    </div>
  );
};

export const DashboardShimmer = () => {
  return (
    <div className="space-y-6">
      <PageHeaderShimmer />

      {/* Summary cards */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-9 w-9 rounded-xl" />
            </div>

            <Shimmer className="mt-4 h-8 w-20" />
            <Shimmer className="mt-2 h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Main area */}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CardShimmer rows={5} />
        </div>

        <CardShimmer rows={5} />
      </div>

      {/* Bottom */}

      <div className="grid gap-5 lg:grid-cols-2">
        <CardShimmer rows={4} />
        <CardShimmer rows={4} />
      </div>
    </div>
  );
};

export const ProfileShimmer = () => {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      {/* ================= PAGE HEADER ================= */}

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Shimmer className="h-8 w-8 rounded-xl" />
          <Shimmer className="h-4 w-16" />
        </div>

        <Shimmer className="h-9 w-32 sm:h-10" />

        <Shimmer className="mt-2 h-4 w-80 max-w-full" />
      </section>

      {/* ================= PROFILE CARD ================= */}

      <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        {/* Profile Hero */}

        <div className="border-b border-base-300 bg-primary/5 px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              {/* Avatar */}

              <Shimmer className="h-24 w-24 shrink-0 rounded-full sm:h-28 sm:w-28" />

              {/* Identity */}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shimmer className="h-6 w-52 max-w-[50vw]" />
                  <Shimmer className="h-6 w-20 rounded-full" />
                </div>

                <Shimmer className="h-4 w-48" />
                <Shimmer className="h-3 w-40" />
              </div>
            </div>

            {/* Change photo */}

            <Shimmer className="h-10 w-32 rounded-xl" />
          </div>
        </div>

        {/* Personal Information */}

        <div>
          {/* Section Header */}

          <div className="px-6 pb-5 pt-7 sm:px-8">
            <div className="flex items-center gap-3">
              <Shimmer className="h-10 w-10 rounded-xl" />

              <div className="space-y-2">
                <Shimmer className="h-5 w-44" />
                <Shimmer className="h-4 w-56 max-w-[60vw]" />
              </div>
            </div>
          </div>

          <div className="mx-6 border-t border-base-300 sm:mx-8" />

          {/* Fields */}

          <div className="space-y-6 px-6 py-6 sm:px-8">
            {/* First + Last */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Shimmer className="h-4 w-20" />
                <Shimmer className="h-11 w-full rounded-xl" />
              </div>

              <div className="space-y-2">
                <Shimmer className="h-4 w-20" />
                <Shimmer className="h-11 w-full rounded-xl" />
              </div>
            </div>

            {/* Email */}

            <div className="space-y-2">
              <Shimmer className="h-4 w-28" />
              <Shimmer className="h-11 w-full rounded-xl" />
              <Shimmer className="h-3 w-60 max-w-full" />
            </div>
          </div>

          {/* Action */}

          <div className="flex justify-end border-t border-base-300 px-6 py-4 sm:px-8">
            <Shimmer className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </section>

      {/* ================= ACCOUNT INFORMATION ================= */}

      <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <Shimmer className="h-10 w-10 rounded-xl" />

          <div className="space-y-2">
            <Shimmer className="h-5 w-44" />
            <Shimmer className="h-4 w-60 max-w-full" />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-base-300">
          <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <Shimmer className="h-4 w-16" />
            <Shimmer className="h-4 w-48 max-w-full" />
          </div>

          <div className="border-t border-base-300" />

          <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-4 w-28" />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <div className="pb-2 text-center">
        <Shimmer className="mx-auto h-3 w-40" />
      </div>
    </div>
  );
};

export default Shimmer;
