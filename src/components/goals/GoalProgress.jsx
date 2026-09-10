import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGoalProgress } from "../../redux/goalSlice";

const GoalProgress = ({ goalId }) => {
  const dispatch = useDispatch();

  const {
    progress,
    progressStatus,
    progressError,
  } = useSelector((store) => store.goals);

  useEffect(() => {
    if (goalId) {
      dispatch(fetchGoalProgress(goalId));
    }
  }, [dispatch, goalId]);

  if (progressStatus === "loading") {
    return (
      <div className="flex items-center justify-center py-6">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  if (progressError) {
    return (
      <div className="rounded-lg bg-error/10 p-4 text-sm text-error">
        Failed to load goal progress.
      </div>
    );
  }

  if (!progress) {
    return null;
  }

  /*
   * The exact property names below depend on the object returned
   * by calculateGoalProgress().
   *
   * These common fields are handled defensively.
   */
  const target = Number(
    progress.target ?? progress.goal?.target ?? 0
  );

  const currentProgress = Number(
    progress.currentProgress ??
      progress.progress ??
      progress.current ??
      0
  );

  const percentage =
    target > 0
      ? Math.min((currentProgress / target) * 100, 100)
      : 0;

  return (
    <div className="mt-4 rounded-xl border border-base-300 bg-base-200/50 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Goal Progress</h3>

          <p className="text-xs text-base-content/60">
            Track your current progress
          </p>
        </div>

        <span className="text-lg font-bold">
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress bar */}
      <progress
        className="progress progress-primary w-full"
        value={percentage}
        max="100"
      />

      {/* Values */}
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-base-content/70">
          {currentProgress}
        </span>

        <span className="text-base-content/50">
          Target: {target}
        </span>
      </div>
    </div>
  );
};

export default GoalProgress;
