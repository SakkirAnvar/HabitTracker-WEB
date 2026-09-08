import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearError, login, signup } from "../redux/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.user);

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex">
      {/* ================= LEFT SECTION ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#EEF5FA]">
        {/* Decorative background circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/70" />

        <div className="absolute top-40 -right-32 w-96 h-96 rounded-full bg-[#DDF3F1]/70" />

        <div className="absolute bottom-[-180px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#DCE8FB]/60" />

        <div className="relative z-10 w-full px-16 py-10 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#9ADFCB] flex items-center justify-center text-2xl">
              ✓
            </div>

            <span className="text-3xl font-bold text-[#172554]">Habitly</span>
          </div>

          {/* Main content */}
          <div className="mt-24 max-w-lg">
            <h1 className="text-5xl font-bold leading-tight text-[#172554]">
              Small Steps
              <br />
              <span className="text-[#243DB8]">Big Changes</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-[#64748B]">
              Build better habits. A healthier, happier you is just one habit
              away.
            </p>

            {/* Features */}
            <div className="mt-12 space-y-7">
              {/* Feature 1 */}
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#DDF5ED] flex items-center justify-center text-xl text-[#159570]">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-[#172554]">
                    Track your habits
                  </h3>

                  <p className="text-[#64748B]">Stay consistent, every day.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#DFE9FF] flex items-center justify-center text-xl text-[#243DB8]">
                  ▥
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-[#172554]">
                    See your progress
                  </h3>

                  <p className="text-[#64748B]">Visualize your growth.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#EAE4FC] flex items-center justify-center text-xl text-[#7357C8]">
                  ★
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-[#172554]">
                    Achieve your goals
                  </h3>

                  <p className="text-[#64748B]">Be the best version of you.</p>
                </div>
              </div>
            </div>

            {/* Bottom quote */}
            <div className="mt-16">
              <p className="text-3xl italic font-medium text-[#243DB8]">
                Better Habits
                <br />
                Brighter You
              </p>

              <div className="mt-2 w-28 h-1 rounded-full bg-[#6BCDB0]" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Top navigation */}
        <div className="flex justify-end items-center gap-2 px-6 sm:px-10 py-7 text-sm sm:text-base">
          <span className="text-[#64748B]">
            {!isLoginForm ? "Already have an account?" : "New here?"}
          </span>

          <Link
            onClick={() => setIsLoginForm((prev) => !prev)}
            className="font-semibold text-[#243DB8] hover:underline"
          >
            {!isLoginForm ? "Login " : "Create an account"}
          </Link>
        </div>

        {/* Login container */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-10 pb-10">
          <div className="w-full max-w-xl">
            {/* Login Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#EEF0F3] px-7 py-10 sm:px-12 sm:py-12">
              {/* Heading */}
              <div className="text-center mb-9">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#172554]">
                  {!isLoginForm ? "Create Your Account" : "Welcome Back"}
                </h2>

                <p className="mt-3 text-[#64748B]">
                  {!isLoginForm
                    ? "Join Habitly and start building a better you"
                    : "Log in to continue your habit journey."}
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={!isLoginForm ? handleSignup : handleLogin}
                className="space-y-5"
              >
                {!isLoginForm && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium text-[#172554]">
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
                        className="input input-bordered w-full h-13 bg-white border-[#D9DEE7] text-[#172554] focus:outline-none focus:border-[#243DB8] focus:ring-1 focus:ring-[#243DB8]"
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-medium text-[#172554]">
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
                        className="input input-bordered w-full h-13 bg-white border-[#D9DEE7] text-[#172554] focus:outline-none focus:border-[#243DB8] focus:ring-1 focus:ring-[#243DB8]"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium text-[#172554]">
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
                    className="input input-bordered w-full h-14 bg-white border-[#D9DEE7] text-[#172554] focus:outline-none focus:border-[#243DB8] focus:ring-1 focus:ring-[#243DB8]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium text-[#172554]">
                      Password
                    </span>
                  </label>

                  <input
                    type="password"
                    value={password}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full h-14 bg-white border-[#D9DEE7] text-[#172554] focus:outline-none focus:border-[#243DB8] focus:ring-1 focus:ring-[#243DB8]"
                  />

                  {isLoginForm && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        className="text-sm font-medium text-[#243DB8] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}

                {/* Login button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn w-full h-14 border-none bg-[#243DB8] hover:bg-[#1D35A3] text-white text-base font-semibold rounded-xl"
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

              {/* Divider */}
              <div className="flex items-center gap-4 my-7">
                <div className="h-px flex-1 bg-[#E5E7EB]" />

                <span className="text-sm text-[#94A3B8]">OR</span>

                <div className="h-px flex-1 bg-[#E5E7EB]" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="btn btn-outline w-full h-13 bg-white border-[#D9DEE7] hover:bg-[#F8FAFC] text-[#172554] rounded-xl"
              >
                <span className="text-lg font-bold">G</span>
                Continue with Google
              </button>

              {/* Apple */}
              <button
                type="button"
                className="btn btn-outline w-full h-13 mt-3 bg-white border-[#D9DEE7] hover:bg-[#F8FAFC] text-[#172554] rounded-xl"
              >
                <span className="text-lg">●</span>
                Continue with Apple
              </button>

              {/* Signup */}
              <p className="text-center text-sm mt-8 text-[#64748B]">
                {!isLoginForm
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <Link
                  onClick={() => setIsLoginForm((prev) => !prev)}
                  className="ml-2 font-semibold text-[#243DB8] hover:underline"
                >
                  {!isLoginForm ? "Login" : "Create an account"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
