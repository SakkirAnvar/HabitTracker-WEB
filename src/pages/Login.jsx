import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { clearError, login, signup } from "../redux/userSlice";
import { AVEN_LOGO } from "../utils/constants";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.user);

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);

  // =========================
  // Login
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    dispatch(clearError());

    try {
      await dispatch(login({ emailId, password })).unwrap();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // Signup
  // =========================

  const handleSignup = async (e) => {
    e.preventDefault();

    dispatch(clearError());

    try {
      const result = await dispatch(
        signup({
          firstName,
          lastName,
          emailId,
          password,
        }),
      );

      if (signup.fulfilled.match(result)) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // Toggle form
  // =========================

  const toggleForm = () => {
    dispatch(clearError());
    setIsLoginForm((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-base-200 text-base-content">
      {/* =========================================================
          LEFT SECTION
      ========================================================= */}

      <div className="relative hidden overflow-hidden bg-base-100 lg:flex lg:w-1/2">
        {/* Decorative Aven shapes */}

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5" />

        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-secondary/5" />

        <div className="absolute -bottom-48 -left-32 h-[500px] w-[500px] rounded-full bg-primary/5" />

        <div className="relative z-10 flex w-full flex-col px-12 py-10 xl:px-16">
          {/* ================= LOGO ================= */}

          <Link
            to="/"
            className="inline-flex w-fit transition-opacity hover:opacity-90"
          >
            <img
              src={AVEN_LOGO}
              alt="Aven - Build your better days"
              className="w-44 h-auto object-contain"
            />
          </Link>

          {/* ================= HERO ================= */}

          <div className="mt-24 max-w-lg">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Build better days
            </p>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-base-content xl:text-6xl">
              Small Steps
              <br />
              <span className="text-primary">Big Changes</span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-base-content/60">
              Build better habits, stay consistent, and become a healthier,
              happier version of yourself.
            </p>

            {/* ================= FEATURES ================= */}

            <div className="mt-12 space-y-7">
              {/* Feature 1 */}

              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">
                  ✓
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-base-content">
                    Track your habits
                  </h3>

                  <p className="text-base-content/60">
                    Stay consistent, every day.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}

              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-xl text-secondary">
                  ▥
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-base-content">
                    See your progress
                  </h3>

                  <p className="text-base-content/60">Visualize your growth.</p>
                </div>
              </div>

              {/* Feature 3 */}

              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-xl text-primary">
                  ★
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-base-content">
                    Achieve your goals
                  </h3>

                  <p className="text-base-content/60">
                    Be the best version of you.
                  </p>
                </div>
              </div>
            </div>

            {/* ================= QUOTE ================= */}

            <div className="mt-16">
              <p className="text-3xl font-medium italic text-primary">
                Better Habits
                <br />
                Brighter You
              </p>

              <div className="mt-3 h-1 w-28 rounded-full bg-secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          RIGHT SECTION
      ========================================================= */}

      <div className="flex w-full flex-col lg:w-1/2">
        {/* ================= TOP NAVIGATION ================= */}

        <div className="flex items-center justify-end gap-2 px-6 py-7 text-sm sm:px-10 sm:text-base">
          <span className="text-base-content/60">
            {!isLoginForm ? "Already have an account?" : "New here?"}
          </span>

          <button
            type="button"
            onClick={toggleForm}
            className="font-semibold text-primary hover:underline"
          >
            {!isLoginForm ? "Login" : "Create an account"}
          </button>
        </div>

        {/* ================= FORM AREA ================= */}

        <div className="flex flex-1 items-center justify-center px-5 pb-10 sm:px-10">
          <div className="w-full max-w-xl">
            {/* ================= CARD ================= */}

            <div className="rounded-3xl border border-base-300 bg-base-100 px-7 py-10 shadow-sm sm:px-12 sm:py-12">
              {/* ================= HEADING ================= */}

              <div className="mb-9 text-center">
                <div className="mb-5 flex justify-center lg:hidden">
                  <img
                    src={AVEN_LOGO}
                    alt="Aven - Build your better days"
                    className="w-40 h-auto object-contain"
                  />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                  {!isLoginForm ? "Create Your Account" : "Welcome Back"}
                </h2>

                <p className="mt-3 text-base-content/60">
                  {!isLoginForm
                    ? "Join Aven and start building better days."
                    : "Log in to continue your habit journey."}
                </p>
              </div>

              {/* ================= FORM ================= */}

              <form
                onSubmit={!isLoginForm ? handleSignup : handleLogin}
                className="space-y-5"
              >
                {/* First + Last Name */}

                {!isLoginForm && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium text-base-content">
                          First Name
                        </span>
                      </label>

                      <input
                        type="text"
                        value={firstName}
                        placeholder="John"
                        required
                        autoComplete="given-name"
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input h-13 w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-medium text-base-content">
                          Last Name
                        </span>
                      </label>

                      <input
                        type="text"
                        value={lastName}
                        placeholder="Doe"
                        required
                        autoComplete="family-name"
                        onChange={(e) => setLastName(e.target.value)}
                        className="input h-13 w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}

                <div>
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Email address
                    </span>
                  </label>

                  <input
                    type="email"
                    value={emailId}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    onChange={(e) => setEmailId(e.target.value)}
                    className="input h-14 w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Password */}

                <div>
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Password
                    </span>
                  </label>

                  <input
                    type="password"
                    value={password}
                    placeholder="Enter your password"
                    required
                    autoComplete={
                      isLoginForm ? "current-password" : "new-password"
                    }
                    onChange={(e) => setPassword(e.target.value)}
                    className="input h-14 w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />

                  {isLoginForm && (
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>

                {/* ================= ERROR ================= */}

                {error && (
                  <div
                    role="alert"
                    className="flex items-center gap-3 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.5 13A2 2 0 004.52 20h14.96a2 2 0 001.73-3.14l-7.5-13a2 2 0 00-3.46 0z"
                      />
                    </svg>

                    <span>{error}</span>
                  </div>
                )}

                {/* ================= SUBMIT ================= */}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn h-14 w-full rounded-xl bg-primary text-base font-semibold text-primary-content shadow-sm hover:bg-primary/90 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />

                      {isLoginForm ? "Logging in..." : "Signing up..."}
                    </>
                  ) : isLoginForm ? (
                    "Log In"
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              {/* ================= DIVIDER ================= */}

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-base-300" />

                <span className="text-sm text-base-content/40">OR</span>

                <div className="h-px flex-1 bg-base-300" />
              </div>

              {/* ================= GOOGLE ================= */}

              <button
                type="button"
                className="btn h-13 w-full rounded-xl border-base-300 bg-base-100 text-base-content hover:bg-base-200"
              >
                <span className="text-lg font-bold">G</span>
                Continue with Google
              </button>

              {/* ================= APPLE ================= */}

              <button
                type="button"
                className="btn mt-3 h-13 w-full rounded-xl border-base-300 bg-base-100 text-base-content hover:bg-base-200"
              >
                <span className="text-lg">●</span>
                Continue with Apple
              </button>

              {/* ================= BOTTOM SWITCH ================= */}

              <p className="mt-8 text-center text-sm text-base-content/60">
                {!isLoginForm
                  ? "Already have an account?"
                  : "Don't have an account?"}

                <button
                  type="button"
                  onClick={toggleForm}
                  className="ml-2 font-semibold text-primary hover:underline"
                >
                  {!isLoginForm ? "Login" : "Create an account"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
