import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { applyTheme } from "./utils/theme";
import { checkAuth } from "./redux/userSlice";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";
import Habits from "./pages/Habits";
import Goals from "./pages/Goals";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import HelpAndSupport from "./pages/HelpAndSupport";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user.user);
  const initialized = useSelector((state) => state.user.initialized);

  // =========================
  // Check authentication
  // =========================

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // =========================
  // Apply user theme
  // =========================

  useEffect(() => {
    if (user?.theme) {
      applyTheme(user.theme);
    }
  }, [user?.theme]);

  // =========================
  // Initial loading
  // =========================

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 text-base-content">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />

          <p className="text-sm text-base-content/60">Loading Aven...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            Public Routes
        ========================= */}

        <Route path="/login" element={<Login />} />

        {/* =========================
            Protected Routes
        ========================= */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/habits" element={<Habits />} />

          <Route path="/goals" element={<Goals />} />

          <Route path="/journal" element={<Journal />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/help" element={<HelpAndSupport />} />

          {/* Catch-all for authenticated users */}

          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
