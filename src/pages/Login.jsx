import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../layout/AlertMessage";
import { clearError, login, signup } from "../redux/userSlice";
import { AVEN_LIGHT_LOGO } from "../utils/constants";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.user);

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = status === "loading";

  const handleLogin = async (e) => {
    e.preventDefault();

    dispatch(clearError());

    try {
      await dispatch(login({ emailId, password })).unwrap();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    dispatch(clearError());

    try {
      await dispatch(
        signup({
          firstName,
          lastName,
          emailId,
          password,
        }),
      ).unwrap();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleForm = () => {
    dispatch(clearError());

    setIsLoginForm((prev) => !prev);
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-base-200/50 text-base-content">
      <div className="relative min-h-screen overflow-hidden">
        {/* Soft background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/[0.045]" />
          <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-primary/[0.045]" />
          <div className="absolute right-[34%] top-[18%] h-24 w-24 rotate-12 rounded-[2rem] bg-primary/[0.025]" />
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
          <Link
            to="/"
            className="inline-flex transition-opacity hover:opacity-80"
          >
            <img
              src={AVEN_LIGHT_LOGO}
              alt="Aven - Build your better days"
              className="h-auto w-32 object-contain sm:w-36"
            />
          </Link>

          <div className="hidden items-center gap-2 text-sm text-base-content/50 sm:flex">
            <span>
              {isLoginForm ? "New to Aven?" : "Already have an account?"}
            </span>

            <button
              type="button"
              onClick={toggleForm}
              className="font-semibold text-primary transition hover:text-primary/80"
            >
              {isLoginForm ? "Create account" : "Log in"}
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="relative z-10 flex min-h-[calc(100vh-96px)] items-center justify-center px-5 pb-12 pt-4 sm:px-8">
          <div className="grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Brand message */}
            <section className="hidden lg:block">
              <div className="max-w-md">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Build your better days
                </div>

                <h1 className="text-5xl font-bold leading-[1.05] tracking-tight xl:text-6xl">
                  Small steps.
                  <br />
                  <span className="text-primary">Big changes.</span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-base-content/55 xl:text-lg">
                  Build better habits, stay consistent, and make meaningful
                  progress every day.
                </p>

                <div className="mt-9 flex gap-3">
                  <Highlight value="Habits" label="Build routines" />
                  <Highlight value="Goals" label="Stay focused" />
                  <Highlight value="Growth" label="Track progress" />
                </div>

                <div className="mt-10 border-l-2 border-primary/20 pl-4">
                  <p className="text-sm font-medium text-base-content/60">
                    "Small improvements, repeated every day."
                  </p>

                  <p className="mt-1 text-xs text-base-content/40">
                    Your journey starts here.
                  </p>
                </div>
              </div>
            </section>

            {/* Auth area */}
            <section className="flex justify-center">
              <div className="w-full max-w-[440px]">
                {/* Card */}
                <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
                  {/* Icon */}
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {isLoginForm ? <LoginIcon /> : <UserPlusIcon />}
                  </div>

                  {/* Heading */}
                  <div className="mb-7">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {isLoginForm
                        ? "Welcome back"
                        : "Create your Aven account"}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-base-content/55 sm:text-base">
                      {isLoginForm
                        ? "Log in to continue building your better days."
                        : "Start building better habits, one day at a time."}
                    </p>
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={isLoginForm ? handleLogin : handleSignup}
                    className="space-y-5"
                  >
                    {/* Names */}
                    {!isLoginForm && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="first-name"
                            className="mb-2 block text-sm font-semibold"
                          >
                            First name
                          </label>

                          <input
                            id="first-name"
                            type="text"
                            value={firstName}
                            placeholder="John"
                            required
                            autoComplete="given-name"
                            onChange={(e) => setFirstName(e.target.value)}
                            className="input h-12 w-full rounded-xl border-base-300 bg-base-100 px-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="last-name"
                            className="mb-2 block text-sm font-semibold"
                          >
                            Last name
                          </label>

                          <input
                            id="last-name"
                            type="text"
                            value={lastName}
                            placeholder="Doe"
                            required
                            autoComplete="family-name"
                            onChange={(e) => setLastName(e.target.value)}
                            className="input h-12 w-full rounded-xl border-base-300 bg-base-100 px-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Email address
                      </label>

                      <div className="relative">
                        <MailIcon />

                        <input
                          id="email"
                          type="email"
                          value={emailId}
                          placeholder="you@example.com"
                          required
                          autoComplete="email"
                          onChange={(e) => setEmailId(e.target.value)}
                          className="input h-12 w-full rounded-xl border-base-300 bg-base-100 pl-11 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="text-sm font-semibold"
                        >
                          Password
                        </label>

                        {isLoginForm && (
                          <Link
                            to="/forgot-password"
                            className="text-sm font-semibold text-primary transition hover:text-primary/80"
                          >
                            Forgot password?
                          </Link>
                        )}
                      </div>

                      <div className="relative">
                        <LockIcon />

                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          placeholder={
                            isLoginForm
                              ? "Enter your password"
                              : "Create a password"
                          }
                          required
                          autoComplete={
                            isLoginForm ? "current-password" : "new-password"
                          }
                          onChange={(e) => setPassword(e.target.value)}
                          className="input h-12 w-full rounded-xl border-base-300 bg-base-100 pl-11 pr-12 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                        />

                        <button
                          type="button"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-base-content/35 transition hover:bg-base-200 hover:text-base-content"
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>

                      {!isLoginForm && (
                        <p className="mt-2 text-xs text-base-content/40">
                          Use at least 8 characters for a stronger password.
                        </p>
                      )}
                    </div>

                    {/* Error */}
                    {error && (
                      <AlertMessage
                        type="error"
                        message={error}
                        onClose={() => dispatch(clearError())}
                      />
                    )}
                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn h-12 w-full rounded-xl border-0 bg-primary text-sm font-semibold text-primary-content shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm" />
                          {isLoginForm
                            ? "Logging in..."
                            : "Creating account..."}
                        </>
                      ) : (
                        <>
                          {isLoginForm ? "Log in" : "Create account"}
                          <ArrowRightIcon />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Mobile switch */}
                  <div className="mt-7 border-t border-base-300 pt-6 sm:hidden">
                    <p className="text-center text-sm text-base-content/50">
                      {isLoginForm
                        ? "Don't have an account?"
                        : "Already have an account?"}

                      <button
                        type="button"
                        onClick={toggleForm}
                        className="ml-1.5 font-semibold text-primary transition hover:text-primary/80"
                      >
                        {isLoginForm ? "Create one" : "Log in"}
                      </button>
                    </p>
                  </div>
                </div>

                {/* Security */}
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-base-content/40">
                  <ShieldIcon />
                  <span>Your information is securely protected.</span>
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-center gap-5 text-xs text-base-content/35">
                  <span>Aven © {new Date().getFullYear()}</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

const Highlight = ({ value, label }) => {
  return (
    <div className="rounded-2xl border border-base-300/70 bg-base-100/70 px-4 py-4">
      <p className="text-sm font-semibold text-primary">{value}</p>

      <p className="mt-1 text-xs leading-5 text-base-content/45">{label}</p>
    </div>
  );
};

const LoginIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="m10 17 5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
);

const UserPlusIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M19 8v6" />
    <path d="M22 11h-6" />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-base-content/50"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-base-content/50"
    aria-hidden="true"
  >
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="h-4.5 w-4.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    className="h-4.5 w-4.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="m3 3 18 18" />
    <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17.8 17.8 0 0 1-3.2 3.8" />
    <path d="M6.3 6.3C3.8 8.1 2.5 12 2.5 12s3.5 6 9.5 6c1.4 0 2.6-.3 3.7-.8" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M12 3 20 6v5c0 5-3.4 8.8-8 10-4.6-1.2-8-5-8-10V6l8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default Login;
