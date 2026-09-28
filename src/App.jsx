import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLoader from "./layout/AppLoader";
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
import ArchivedHabits from "./components/habits/ArchivedHabits";
import ForgotPassword from "./pages/ForgotPassword";
import AuthTheme from "./utils/authTheme";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user.user);
  const initialized = useSelector((state) => state.user.initialized);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user?.theme) {
      applyTheme(user.theme, false);
    }
  }, [user?.theme]);

  if (!initialized) {
    return <AppLoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthTheme>
                <Login />
              </AuthTheme>
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <AuthTheme>
              <ForgotPassword />
            </AuthTheme>
          }
        />

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
          <Route path="/habits/archived" element={<ArchivedHabits />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<HelpAndSupport />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
