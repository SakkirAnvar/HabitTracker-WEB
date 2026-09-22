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
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* =====================================================
            LEFT — BRAND PANEL
        ===================================================== */}

        <section className="relative hidden overflow-hidden bg-base-200 lg:flex">
          {/* Decorative background */}
          <div className="absolute inset-0">
            <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

            <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between px-12 py-10 xl:px-16">
            {/* Logo */}

            <Link
              to="/"
              className="inline-flex w-fit transition-opacity hover:opacity-80"
            >
              <img
                src={AVEN_LOGO}
                alt="Aven"
                className="h-auto w-32 object-contain"
              />
            </Link>

            {/* Main content */}

            <div className="max-w-xl">
              {/* Small label */}

              <div className="mb-7 inline-flex items-center rounded-full border border-base-content/10 bg-base-100/60 px-4 py-2 text-xs font-medium text-base-content/70 backdrop-blur-sm">
                A calmer, more intentional you
              </div>

              <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight xl:text-6xl">
                Small habits.
                <br />

                <span className="text-primary">
                  A better tomorrow.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-base-content/60 xl:text-lg">
                Aven helps you build positive habits, stay consistent,
                and create a life you're proud of.
              </p>

              {/* Benefits */}

              <div className="mt-10 space-y-6">
                <Feature
                  icon={<CheckIcon />}
                  title="Build habits"
                  description="Create routines that fit your lifestyle."
                />

                <Feature
                  icon={<ChartIcon />}
                  title="Track progress"
                  description="See your growth, day by day."
                />

                <Feature
                  icon={<HeartIcon />}
                  title="Feel better"
                  description="A more focused, balanced you."
                />
              </div>
            </div>

            {/* Quote */}

            <div>
              <p className="text-sm italic text-base-content/60">
                "Discipline today. A better tomorrow."
              </p>

              <p className="mt-2 text-xs text-base-content/40">
                — Aven
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT — LOGIN
        ===================================================== */}

        <section className="relative flex min-h-screen flex-col bg-base-100">
          {/* Theme */}

          <div className="flex justify-end px-6 py-6 sm:px-10">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-base-content/70 transition hover:bg-base-200 hover:text-base-content"
            >
              <SunIcon />

              <span>Light</span>

              <ChevronDownIcon />
            </button>
          </div>

          {/* Main */}

          <div className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
            <div className="w-full max-w-[500px]">
              {/* Mobile logo */}

              <div className="mb-10 flex justify-center lg:hidden">
                <Link to="/">
                  <img
                    src={AVEN_LOGO}
                    alt="Aven"
                    className="h-auto w-32 object-contain"
                  />
                </Link>
              </div>

              {/* Login card */}

              <div className="rounded-2xl border border-base-300 bg-base-100 p-7 shadow-sm sm:p-10">
                {/* Heading */}

                <div className="mb-8">
                  <h2 className="text-3xl font-semibold tracking-tight">
                    {isLoginForm
                      ? "Welcome back"
                      : "Create your account"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-base-content/60 sm:text-base">
                    {isLoginForm
                      ? "Log in to continue your journey with Aven."
                      : "Start building better habits with Aven."}
                  </p>
                </div>

                {/* Form */}

                <form
                  onSubmit={
                    isLoginForm ? handleLogin : handleSignup
                  }
                  className="space-y-5"
                >
                  {/* Name */}

                  {!isLoginForm && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          First name
                        </label>

                        <input
                          type="text"
                          value={firstName}
                          placeholder="John"
                          required
                          autoComplete="given-name"
                          onChange={(e) =>
                            setFirstName(e.target.value)
                          }
                          className="input h-12 w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Last name
                        </label>

                        <input
                          type="text"
                          value={lastName}
                          placeholder="Doe"
                          required
                          autoComplete="family-name"
                          onChange={(e) =>
                            setLastName(e.target.value)
                          }
                          className="input h-12 w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email address
                    </label>

                    <div className="relative">
                      <MailIcon />

                      <input
                        type="email"
                        value={emailId}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        onChange={(e) =>
                          setEmailId(e.target.value)
                        }
                        className="input h-12 w-full border-base-300 bg-base-100 pl-11 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {/* Password */}

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Password
                      </label>

                      {isLoginForm && (
                        <Link
                          to="/forgot-password"
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      )}
                    </div>

                    <div className="relative">
                      <LockIcon />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder="Enter your password"
                        required
                        autoComplete={
                          isLoginForm
                            ? "current-password"
                            : "new-password"
                        }
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        className="input h-12 w-full border-base-300 bg-base-100 pl-11 pr-11 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-base-content/40 transition hover:bg-base-200 hover:text-base-content"
                      >
                        {showPassword ? (
                          <EyeOffIcon />
                        ) : (
                          <EyeIcon />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error */}

                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error"
                    >
                      {error}
                    </div>
                  )}

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn h-12 w-full rounded-xl border-0 bg-primary text-sm font-semibold text-primary-content shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
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
                        {isLoginForm
                          ? "Log in"
                          : "Create account"}

                        <ArrowRightIcon />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-base-300" />

                  <span className="text-xs font-medium text-base-content/40">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-base-300" />
                </div>

                {/* Google */}

                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-base-300 bg-base-100 text-sm font-medium transition hover:bg-base-200"
                >
                  <GoogleIcon />

                  Continue with Google
                </button>

                {/* Apple */}

                <button
                  type="button"
                  className="mt-3 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-base-300 bg-base-100 text-sm font-medium transition hover:bg-base-200"
                >
                  <AppleIcon />

                  Continue with Apple
                </button>

                {/* Account switch */}

                <p className="mt-8 text-center text-sm text-base-content/50">
                  {isLoginForm
                    ? "Don't have an account?"
                    : "Already have an account?"}

                  <button
                    type="button"
                    onClick={toggleForm}
                    className="ml-1.5 font-semibold text-primary hover:underline"
                  >
                    {isLoginForm
                      ? "Create one"
                      : "Log in"}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="flex items-center justify-between px-6 py-6 text-xs text-base-content/40 sm:px-10">
            <div className="flex gap-5">
              <button className="hover:text-base-content">
                Terms
              </button>

              <button className="hover:text-base-content">
                Privacy
              </button>

              <button className="hover:text-base-content">
                Help
              </button>
            </div>

            <span>Aven © 2026</span>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ============================================================
   Feature
============================================================ */

const Feature = ({ icon, title, description }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-base-100 text-primary shadow-sm">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-0.5 text-sm text-base-content/55">
          {description}
        </p>
      </div>
    </div>
  );
};

/* ============================================================
   Icons
============================================================ */

const MailIcon = () => (
  <svg
    className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = () => (
  <svg
    className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="h-5 w-5"
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
    className="h-5 w-5"
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

const CheckIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const ChartIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 20V10" />
    <path d="M12 20V4" />
    <path d="M19 20v-7" />
  </svg>
);

const HeartIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.8 8.6c0 5.5-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.6A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z" />
  </svg>
);

const SunIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const GoogleIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
  >
    <path
      fill="#4285F4"
      d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.92-4.18 2.92-7.42Z"
    />

    <path
      fill="#34A853"
      d="M12 21.65c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.65Z"
    />

    <path
      fill="#FBBC05"
      d="M6.53 13.73A5.85 5.85 0 0 1 6.22 12c0-.6.1-1.19.31-1.73V7.74H3.28A9.66 9.66 0 0 0 2.25 12c0 1.55.37 3.02 1.03 4.26l3.25-2.53Z"
    />

    <path
      fill="#EA4335"
      d="M12 6.24c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.3 14.63 2.35 12 2.35a9.74 9.74 0 0 0-8.72 5.39l3.25 2.53C7.3 7.96 9.46 6.24 12 6.24Z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16.7 12.8c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.2-.9-1.6 0-3.1.9-3.9 2.3-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.3 3 2.2 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.1-1.1 2.9-2.2.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.4ZM14.2 5.5c.7-.9 1.2-2.1 1.1-3.3-1.1 0-2.4.7-3.1 1.5-.7.8-1.2 2-1.1 3.1 1.2.1 2.4-.5 3.1-1.3Z" />
  </svg>
);

export default Login;