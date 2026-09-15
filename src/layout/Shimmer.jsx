const Shimmer = ({ className = "" }) => {
  return (
    <div className={`animate-pulse rounded-lg bg-base-300/70 ${className}`} />
  );
};

/* =========================
   GENERIC CARD SHIMMER
========================= */

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

/* =========================
   PAGE HEADER SHIMMER
========================= */

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

/* =========================
   HABIT SHIMMER
========================= */

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

/* =========================
   GOAL SHIMMER
========================= */

export const GoalShimmer = () => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Shimmer className="h-5 w-3/5" />
              <Shimmer className="h-4 w-4/5" />
            </div>

            <Shimmer className="h-8 w-8 rounded-lg" />
          </div>

          <div className="mt-5">
            <div className="flex justify-between">
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-4 w-12" />
            </div>

            <Shimmer className="mt-3 h-2 w-full rounded-full" />

            <div className="mt-4 flex justify-between">
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-4 w-20" />
            </div>
          </div>

          <div className="mt-5 border-t border-base-300 pt-4">
            <Shimmer className="h-4 w-32" />
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
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <Shimmer className="h-5 w-2/5" />
            <Shimmer className="h-4 w-24" />
          </div>

          <Shimmer className="mt-4 h-4 w-full" />
          <Shimmer className="mt-2 h-4 w-11/12" />
          <Shimmer className="mt-2 h-4 w-3/5" />

          <div className="mt-5 flex gap-2">
            <Shimmer className="h-6 w-16 rounded-full" />
            <Shimmer className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================
   ANALYTICS SHIMMER
========================= */

export const AnalyticsShimmer = () => {
  return (
    <div className="space-y-5">
      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
          >
            <Shimmer className="h-4 w-24" />
            <Shimmer className="mt-3 h-8 w-20" />
            <Shimmer className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Main chart */}

      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <Shimmer className="h-5 w-40" />
        <Shimmer className="mt-2 h-4 w-64" />

        <div className="mt-6 flex h-64 items-end gap-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <Shimmer
              key={index}
              className="flex-1 rounded-t-lg rounded-b-none"
              style={{
                height: `${30 + ((index * 17) % 60)}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Secondary charts */}

      <div className="grid gap-5 lg:grid-cols-2">
        <CardShimmer rows={4} />
        <CardShimmer rows={4} />
      </div>
    </div>
  );
};

/* =========================
   DASHBOARD SHIMMER
========================= */

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

export default Shimmer;
