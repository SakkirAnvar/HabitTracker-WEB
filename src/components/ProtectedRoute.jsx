import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user, status } = useSelector((state) => state.user);

  // ================= AUTH CHECK =================

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 text-base-content">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />

          <p className="text-sm text-base-content/60">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  // ================= NOT AUTHENTICATED =================

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ================= AUTHENTICATED =================

  return children;
};

export default ProtectedRoute;
