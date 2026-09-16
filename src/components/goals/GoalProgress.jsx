import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchGoalProgress } from "../../redux/goalSlice";

const GoalProgress = ({ goalId }) => {
  const dispatch = useDispatch();

  const { progress, progressStatus, progressError } = useSelector(
    (store) => store.goal,
  );

  useEffect(() => {
    if (goalId) {
      dispatch(fetchGoalProgress(goalId));
    }
  }, [dispatch, goalId]);

  // =========================
  // LOADING
  // =========================

  if (progressStatus === "loading") {
    return (
      <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <div className="animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-base-300" />

              <div className="space-y-2">
                <div className="h-4 w-28 rounded bg-base-300" />
                <div className="h-3 w-48 rounded bg-base-300" />
              </div>
            </div>

            <div className="h-7 w-12 rounded bg-base-300" />
          </div>

          <div className="mt-5 h-2 w-full rounded-full bg-base-300" />

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-20 rounded-xl bg-base-300" />
            <div className="h-20 rounded-xl bg-base-300" />
            <div className="h-20 rounded-xl bg-base-300" />
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (progressError) {
    return (
      <div className="mt-4 rounded-2xl border border-error/20 bg-error/10 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error">
            !
          </div>

          <div>
            <p className="text-sm font-semibold text-error">
              Unable to load progress
            </p>

            <p className="mt-1 text-xs leading-5 text-error/75">
              {progressError}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return null;
  }

  // =========================
  // VALUES
  // =========================

  const target = Number(progress.target ?? progress.goal?.target ?? 0);

  const currentProgress = Number(
    progress.currentProgress ?? progress.progress ?? progress.current ?? 0,
  );

  const remaining = Math.max(target - currentProgress, 0);

  const percentage =
    target > 0
      ? Math.min(100, Math.round((currentProgress / target) * 100))
      : 0;

  const isComplete = percentage >= 100;

  return (
    <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isComplete
                ? "bg-success/10 text-success"
                : "bg-primary/10 text-primary"
            }`}
          >
            {isComplete ? "✓" : "📊"}
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-base-content">
              Goal Progress
            </h3>

            <p className="mt-0.5 text-xs text-base-content/50">
              Track your current progress and stay consistent.
            </p>
          </div>
        </div>

        {/* Percentage */}

        <div className="shrink-0 text-right">
          <p
            className={`text-2xl font-bold leading-none ${
              isComplete ? "text-success" : "text-primary"
            }`}
          >
            {percentage}%
          </p>

          <p className="mt-1 text-[11px] text-base-content/45">complete</p>
        </div>
      </div>

      {/* ================= PROGRESS BAR ================= */}

      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-base-300">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isComplete ? "bg-success" : "bg-primary"
            }`}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Current */}

        <div className="rounded-xl border border-base-300 bg-base-200/60 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-100 text-sm">
              ⚑
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
                Current
              </p>

              <p className="mt-1 text-lg font-bold leading-none text-base-content">
                {currentProgress}
              </p>

              <p className="mt-1 text-[11px] text-base-content/45">completed</p>
            </div>
          </div>
        </div>

        {/* Target */}

        <div className="rounded-xl border border-base-300 bg-base-200/60 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-100 text-sm">
              🎯
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
                Target
              </p>

              <p className="mt-1 text-lg font-bold leading-none text-base-content">
                {target}
              </p>

              <p className="mt-1 text-[11px] text-base-content/45">total</p>
            </div>
          </div>
        </div>

        {/* Remaining */}

        <div className="rounded-xl border border-base-300 bg-base-200/60 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-100 text-sm">
              📈
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-base-content/40">
                Remaining
              </p>

              <p className="mt-1 text-lg font-bold leading-none text-base-content">
                {remaining}
              </p>

              <p className="mt-1 text-[11px] text-base-content/45">to go</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= COMPLETED ================= */}

      {isComplete && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success text-xs font-bold text-success-content">
            ✓
          </div>

          <div>
            <p className="text-sm font-semibold text-success">Goal completed</p>

            <p className="mt-0.5 text-xs text-success/70">
              You reached your target. Great work!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;
