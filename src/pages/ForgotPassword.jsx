import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
} from "../api/authApi";
import { AVEN_LIGHT_LOGO } from "../utils/constants";
import AlertMessage from "../layout/AlertMessage";

const steps = [
  { id: "email", label: "Email" },
  { id: "otp", label: "Verify" },
  { id: "password", label: "Reset" },
];

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [alert, setAlert] = useState({
    visible: false,
    type: "error",
    message: "",
  });

  const otpRefs = useRef([]);

  const currentStepIndex = steps.findIndex((item) => item.id === step);

  const showAlert = (type, message) => {
    setAlert({
      visible: true,
      type,
      message,
    });
  };

  const closeAlert = () => {
    setAlert((previous) => ({
      ...previous,
      visible: false,
    }));
  };

  // =========================
  // SEND OTP
  // =========================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      showAlert("error", "Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      closeAlert();

      await sendPasswordResetOtp({
        emailId: normalizedEmail,
      });

      setEmail(normalizedEmail);
      setOtp("");

      showAlert(
        "success",
        "A verification code has been sent to your email.",
      );

      setStep("otp");
    } catch (error) {
      showAlert(
        "error",
        error?.response?.data?.message ||
          "Failed to send verification code.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================

  const handleResendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || isResending) return;

    try {
      setIsResending(true);
      closeAlert();

      await sendPasswordResetOtp({
        emailId: normalizedEmail,
      });

      // Clear the previous OTP
      setOtp("");

      showAlert(
        "success",
        "A new verification code has been sent to your email.",
      );

      // Focus first OTP field
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 0);
    } catch (error) {
      showAlert(
        "error",
        error?.response?.data?.message ||
          "Failed to resend verification code.",
      );
    } finally {
      setIsResending(false);
    }
  };

  // =========================
  // OTP
  // =========================

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const otpArray = otp.padEnd(6, "").split("");

    otpArray[index] = digit;

    const nextOtp = otpArray.join("").replace(/\s/g, "");

    setOtp(nextOtp);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    setOtp(pasted);

    const focusIndex = Math.min(pasted.length, 5);

    otpRefs.current[focusIndex]?.focus();
  };

  // =========================
  // VERIFY OTP
  // =========================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      showAlert("error", "Enter the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      closeAlert();

      const response = await verifyPasswordResetOtp({
        emailId: email.trim().toLowerCase(),
        otp,
      });

      const resetToken =
        response?.data?.resetToken || response?.resetToken;

      if (!resetToken) {
        throw new Error("Reset session could not be created.");
      }

      sessionStorage.setItem("aven_reset_token", resetToken);

      showAlert("success", "Your email has been verified.");

      setStep("password");
    } catch (error) {
      showAlert(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Invalid verification code.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PASSWORD
  // =========================

  const passwordRules = {
    length: newPassword.length >= 8,
    number: /\d/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const passwordScore =
    Object.values(passwordRules).filter(Boolean).length;

  const passwordStrength =
    passwordScore === 3
      ? "Strong"
      : passwordScore === 2
        ? "Good"
        : passwordScore === 1
          ? "Weak"
          : "";

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      showAlert("error", "Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("error", "Passwords do not match.");
      return;
    }

    const resetToken = sessionStorage.getItem("aven_reset_token");

    if (!resetToken) {
      showAlert(
        "error",
        "Your reset session has expired. Please start again.",
      );

      setStep("email");
      return;
    }

    try {
      setLoading(true);
      closeAlert();

      await resetPassword({
        resetToken,
        newPassword,
      });

      sessionStorage.removeItem("aven_reset_token");

      showAlert("success", "Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      showAlert(
        "error",
        error?.response?.data?.message ||
          "Failed to reset your password.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DIFFERENT EMAIL
  // =========================

  const handleDifferentEmail = () => {
    setEmail("");
    setOtp("");
    closeAlert();
    setStep("email");
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <main className="flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="flex h-[72px] items-center justify-between border-b border-base-300/70 bg-base-100 px-5 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="group flex items-center"
          >
            <img
              src={AVEN_LIGHT_LOGO}
              alt="Aven"
              className="
                h-auto
                w-32
                object-contain
                transition-transform
                duration-200
                group-hover:scale-[1.03]
              "
            />
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            disabled={loading || isResending}
            className="
              flex items-center gap-2
              rounded-lg
              px-2 py-1.5
              text-sm font-medium
              text-base-content/55
              transition
              hover:bg-base-200
              hover:text-primary
              disabled:opacity-50
            "
          >
            <BackIcon />
            <span>Back to login</span>
          </button>
        </header>

        {/* Main */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:py-14">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/5" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary/5" />

          <div className="relative w-full max-w-[560px]">
            {/* Main card */}
            <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
              <div className="p-6 sm:p-8 lg:p-9">
                <StepProgress currentStepIndex={currentStepIndex} />

                {/* =========================
                    EMAIL STEP
                ========================= */}

                {step === "email" && (
                  <form
                    onSubmit={handleSendOtp}
                    className="mt-8 space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="reset-email"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Email address
                      </label>

                      <div className="relative">
                        <MailIcon
                          size={18}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base-content/35"
                        />

                        <input
                          id="reset-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          autoFocus
                          required
                          className="
                            h-12 w-full rounded-xl
                            border border-base-300
                            bg-base-100
                            pl-11 pr-4
                            text-sm
                            outline-none
                            transition
                            placeholder:text-base-content/30
                            hover:border-base-content/20
                            focus:border-primary
                            focus:ring-2
                            focus:ring-primary/10
                          "
                        />
                      </div>
                    </div>

                    {alert.visible && (
                      <AlertMessage
                        type={alert.type}
                        message={alert.message}
                        duration={3000}
                        onClose={closeAlert}
                      />
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        btn btn-primary
                        h-12 w-full
                        rounded-xl
                        border-0
                        font-semibold
                        shadow-sm
                        transition
                        hover:-translate-y-px
                        hover:shadow-md
                        disabled:translate-y-0
                      "
                    >
                      {loading ? (
                        <ButtonLoading text="Sending code..." />
                      ) : (
                        <>
                          Send verification code
                          <ArrowIcon />
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2.5 pt-1 text-xs text-base-content/45">
                      <ShieldIcon
                        size={15}
                        className="shrink-0 text-primary"
                      />

                      <span>
                        We'll send a one-time 6-digit code to your
                        registered email.
                      </span>
                    </div>
                  </form>
                )}

                {/* =========================
                    OTP STEP
                ========================= */}

                {step === "otp" && (
                  <form
                    onSubmit={handleVerifyOtp}
                    className="mt-8 space-y-6"
                  >
                    {/* Email reference */}
                    <div className="flex items-center gap-3 rounded-xl bg-base-200/70 px-4 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-100 text-primary">
                        <MailIcon size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-base-content/45">
                          Verification code sent to
                        </p>

                        <p className="truncate text-sm font-semibold text-base-content">
                          {email}
                        </p>
                      </div>
                    </div>

                    {/* OTP */}
                    <div
                      className="flex justify-center gap-2 sm:gap-3"
                      onPaste={handleOtpPaste}
                    >
                      {Array.from({ length: 6 }).map((_, index) => (
                        <input
                          key={index}
                          ref={(element) => {
                            otpRefs.current[index] = element;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={otp[index] || ""}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) =>
                            handleOtpKeyDown(index, e)
                          }
                          autoFocus={index === 0}
                          aria-label={`Verification digit ${index + 1}`}
                          className="
                            h-14 w-11
                            rounded-xl
                            border border-base-300
                            bg-base-100
                            text-center
                            text-xl font-semibold
                            outline-none
                            transition
                            hover:border-base-content/20
                            focus:border-primary
                            focus:ring-2
                            focus:ring-primary/10
                            sm:h-15 sm:w-13
                          "
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-base-content/45">
                        Enter the 6-digit code
                      </span>

                      <span className="font-semibold text-primary">
                        {otp.length}/6
                      </span>
                    </div>

                    {alert.visible && (
                      <AlertMessage
                        type={alert.type}
                        message={alert.message}
                        duration={3000}
                        onClose={closeAlert}
                      />
                    )}

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="
                        btn btn-primary
                        h-12 w-full
                        rounded-xl
                        border-0
                        font-semibold
                        disabled:opacity-50
                      "
                    >
                      {loading ? (
                        <ButtonLoading text="Verifying..." />
                      ) : (
                        <>
                          Verify code
                          <ArrowIcon />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1 text-sm">
                      <span className="text-base-content/45">
                        Didn't receive the code?
                      </span>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending || loading}
                        className="
                          font-semibold
                          text-primary
                          transition
                          hover:underline
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {isResending ? "Sending..." : "Resend"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleDifferentEmail}
                      disabled={isResending}
                      className="
                        w-full
                        text-center
                        text-xs
                        font-semibold
                        text-base-content/45
                        transition
                        hover:text-primary
                        disabled:opacity-50
                      "
                    >
                      Use a different email
                    </button>
                  </form>
                )}

                {/* =========================
                    PASSWORD STEP
                ========================= */}

                {step === "password" && (
                  <form
                    onSubmit={handleResetPassword}
                    className="mt-8 space-y-5"
                  >
                    {/* Verified status */}
                    <div className="flex items-center gap-3 rounded-xl bg-success/5 px-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                        <CheckIcon />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-success">
                          Email verified
                        </p>

                        <p className="mt-0.5 text-xs text-base-content/45">
                          You can now create a new password.
                        </p>
                      </div>
                    </div>

                    <PasswordInput
                      id="new-password"
                      label="New password"
                      value={newPassword}
                      onChange={setNewPassword}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      placeholder="Enter new password"
                      autoFocus
                    />

                    {/* Password strength */}
                    <div>
                      <div className="flex h-1 gap-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 rounded-full transition-colors ${
                              passwordScore >= level
                                ? "bg-success"
                                : "bg-base-300"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                        <PasswordRule valid={passwordRules.length}>
                          8+ characters
                        </PasswordRule>

                        <PasswordRule valid={passwordRules.number}>
                          One number
                        </PasswordRule>

                        <PasswordRule valid={passwordRules.special}>
                          Special character
                        </PasswordRule>
                      </div>

                      {passwordStrength && (
                        <p
                          className={`mt-2 text-right text-xs font-semibold ${
                            passwordScore === 3
                              ? "text-success"
                              : "text-base-content/50"
                          }`}
                        >
                          {passwordStrength}
                        </p>
                      )}
                    </div>

                    <PasswordInput
                      id="confirm-password"
                      label="Confirm new password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      showPassword={showConfirmPassword}
                      setShowPassword={setShowConfirmPassword}
                      placeholder="Confirm new password"
                    />

                    {alert.visible && (
                      <AlertMessage
                        type={alert.type}
                        message={alert.message}
                        duration={3000}
                        onClose={closeAlert}
                      />
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        btn btn-primary
                        h-12 w-full
                        rounded-xl
                        border-0
                        font-semibold
                      "
                    >
                      {loading ? (
                        <ButtonLoading text="Saving password..." />
                      ) : (
                        <>
                          Reset password
                          <ArrowIcon />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-5 flex items-center justify-between px-1 text-xs text-base-content/40">
              <div className="flex gap-4">
                <span>Terms</span>
                <span>Privacy</span>
                <span>Help</span>
              </div>

              <span>Aven © {new Date().getFullYear()}</span>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

/* =========================
   STEP PROGRESS
========================= */

const StepProgress = ({ currentStepIndex }) => {
  return (
    <div className="flex items-center">
      {steps.map((item, index) => {
        const completed = index < currentStepIndex;
        const active = index === currentStepIndex;

        return (
          <div
            key={item.id}
            className="flex flex-1 items-center"
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  completed || active
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content/40"
                }`}
              >
                {completed ? "✓" : index + 1}
              </div>

              <span
                className={`hidden text-xs font-semibold sm:block ${
                  active
                    ? "text-base-content"
                    : completed
                      ? "text-primary"
                      : "text-base-content/40"
                }`}
              >
                {item.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`mx-3 h-px flex-1 ${
                  index < currentStepIndex
                    ? "bg-primary"
                    : "bg-base-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* =========================
   PASSWORD INPUT
========================= */

const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
  placeholder,
  autoFocus = false,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold"
      >
        {label}
      </label>

      <div className="relative">
        <LockIcon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base-content/35"
        />

        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          autoFocus={autoFocus}
          className="
            h-12 w-full
            rounded-xl
            border border-base-300
            bg-base-100
            pl-11 pr-12
            text-sm
            outline-none
            transition
            placeholder:text-base-content/30
            focus:border-primary
            focus:ring-2
            focus:ring-primary/10
          "
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword((previous) => !previous)
          }
          className="
            absolute right-3 top-1/2
            -translate-y-1/2
            rounded-lg
            p-1.5
            text-base-content/35
            transition
            hover:bg-base-200
            hover:text-base-content
          "
          aria-label={
            showPassword ? "Hide password" : "Show password"
          }
        >
          <EyeIcon
            visible={showPassword}
            size={18}
          />
        </button>
      </div>
    </div>
  );
};

/* =========================
   PASSWORD RULE
========================= */

const PasswordRule = ({ valid, children }) => {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          valid
            ? "bg-success/10 text-success"
            : "bg-base-200 text-base-content/20"
        }`}
      >
        <CheckIcon size={11} />
      </div>

      <span
        className={
          valid
            ? "text-success"
            : "text-base-content/50"
        }
      >
        {children}
      </span>
    </div>
  );
};

/* =========================
   BUTTON LOADING
========================= */

const ButtonLoading = ({ text }) => {
  return (
    <>
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />

        <span
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"
          style={{ animationDelay: "150ms" }}
        />

        <span
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"
          style={{ animationDelay: "300ms" }}
        />
      </span>

      {text}
    </>
  );
};

/* =========================
   ICONS
========================= */

const MailIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const ShieldIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const LockIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <path d="M12 14v2" />
  </svg>
);

const EyeIcon = ({ visible, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {visible ? (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ) : (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.6 5.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-3.2 3.8" />
        <path d="M6.2 6.3C3.6 8.2 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8" />
      </>
    )}
  </svg>
);

const CheckIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const BackIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

export default ForgotPassword;