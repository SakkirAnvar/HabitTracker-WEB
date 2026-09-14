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

  // ================= LOADING =================

  if (progressStatus === "loading") {
    return (
      <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5">
        <div className="flex items-center justify-center gap-3 py-6">
          <span className="loading loading-spinner loading-md text-primary" />

          <span className="text-sm text-base-content/60">
            Loading progress...
          </span>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (progressError) {
    return (
      <div className="mt-4 rounded-2xl border border-error/20 bg-error/10 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-error/10">
            ⚠️
          </div>

          <div>
            <p className="text-sm font-semibold text-error">
              Unable to load progress
            </p>

            <p className="mt-1 text-xs text-error/80">
              Failed to load goal progress. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return null;
  }

  /*
   * The exact property names depend on the object returned
   * by calculateGoalProgress().
   *
   * These common fields are handled defensively.
   */

  const target = Number(progress.target ?? progress.goal?.target ?? 0);

  const currentProgress = Number(
    progress.currentProgress ?? progress.progress ?? progress.current ?? 0,
  );

  const percentage =
    target > 0 ? Math.min((currentProgress / target) * 100, 100) : 0;

  const roundedPercentage = Math.round(percentage);

  const isComplete = roundedPercentage >= 100;

  return (
    <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isComplete ? "bg-success/10" : "bg-primary/10"
            }`}
          >
            {isComplete ? "✓" : "📈"}
          </div>

          <div>
            <h3 className="font-semibold text-base-content">Goal Progress</h3>

            <p className="mt-0.5 text-xs text-base-content/50">
              Track your current progress
            </p>
          </div>
        </div>

        {/* Percentage */}

        <div className="text-right">
          <span
            className={`text-xl font-bold ${
              isComplete ? "text-success" : "text-primary"
            }`}
          >
            {roundedPercentage}%
          </span>

          <p className="text-[11px] text-base-content/45">complete</p>
        </div>
      </div>

      {/* ================= PROGRESS ================= */}

      <div className="mt-5">
        <progress
          className={`progress w-full ${
            isComplete ? "progress-success" : "progress-primary"
          }`}
          value={percentage}
          max="100"
        />
      </div>

      {/* ================= VALUES ================= */}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-base-200 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/45">
            Current
          </p>

          <p className="mt-1 text-base font-semibold text-base-content">
            {currentProgress}
          </p>
        </div>

        <div className="rounded-xl bg-base-200 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/45">
            Target
          </p>

          <p className="mt-1 text-base font-semibold text-base-content">
            {target}
          </p>
        </div>
      </div>

      {/* ================= COMPLETION MESSAGE ================= */}

      {isComplete && (
        <div className="mt-4 rounded-xl border border-success/20 bg-success/10 px-4 py-3">
          <p className="text-sm font-semibold text-success">
            🎉 Goal completed!
          </p>

          <p className="mt-0.5 text-xs text-success/80">
            Great work! You reached your target.
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;
