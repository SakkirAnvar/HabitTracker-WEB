import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { user, initialized } = useSelector((state) => state.user);

  // Wait until checkAuth() finishes
  if (!initialized) {
    return null;
  }

  // Already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
