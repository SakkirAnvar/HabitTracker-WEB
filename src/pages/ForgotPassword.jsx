import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
} from "../api/authApi";

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

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const otpRefs = useRef([]);

  const currentStepIndex = steps.findIndex((item) => item.id === step);

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
  };

  // =========================
  // SEND OTP
  // =========================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      showMessage("error", "Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await sendPasswordResetOtp({
        emailId: normalizedEmail,
      });

      setEmail(normalizedEmail);
      setOtp("");

      showMessage(
        "success",
        "A verification code has been sent to your email.",
      );

      setStep("otp");
    } catch (error) {
      showMessage(
        "error",
        error?.response?.data?.message || "Failed to send verification code.",
      );
    } finally {
      setLoading(false);
    }
  };

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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      showMessage("error", "Enter the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await verifyPasswordResetOtp({
        emailId: email.trim().toLowerCase(),
        otp,
      });

      const resetToken = response?.data?.resetToken || response?.resetToken;

      if (!resetToken) {
        throw new Error("Reset session could not be created.");
      }

      sessionStorage.setItem("aven_reset_token", resetToken);

      showMessage("success", "Your email has been verified.");

      setStep("password");
    } catch (error) {
      showMessage(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Invalid verification code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = {
    length: newPassword.length >= 8,
    number: /\d/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const passwordScore = Object.values(passwordRules).filter(Boolean).length;

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
      showMessage("error", "Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("error", "Passwords do not match.");
      return;
    }

    const resetToken = sessionStorage.getItem("aven_reset_token");

    if (!resetToken) {
      showMessage(
        "error",
        "Your reset session has expired. Please start again.",
      );

      setStep("email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await resetPassword({
        resetToken,
        newPassword,
      });

      sessionStorage.removeItem("aven_reset_token");

      showMessage("success", "Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      showMessage(
        "error",
        error?.response?.data?.message || "Failed to reset your password.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDifferentEmail = () => {
    setEmail("");
    setOtp("");
    setMessage("");
    setStep("email");
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <main className="flex min-h-screen flex-col">
        {/* Top navigation */}
        <header className="flex items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 lg:hidden">
            <AvenLogo size={26} />

            <span className="text-lg font-bold">Aven</span>
          </div>

          <div className="ml-auto">
            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={loading}
              className="flex items-center gap-2 text-sm font-medium text-base-content/55 transition hover:text-base-content disabled:opacity-50"
            >
              <BackIcon />
              Back to login
            </button>
          </div>
        </header>

        {/* Main */}
        <div className="flex flex-1 items-center justify-center px-5 pb-10 pt-2 sm:px-8 lg:px-12 lg:pb-16">
          <div className="w-full max-w-xl">
            {/* Card */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
              {/* Progress */}
              <StepProgress currentStepIndex={currentStepIndex} />

              {/* Heading */}
              <div className="mt-9">
                <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
                  {step === "email" && "Forgot your password?"}

                  {step === "otp" && "Check your email"}

                  {step === "password" && "Set a new password"}
                </h1>

                <p className="mt-2 max-w-md text-sm leading-6 text-base-content/55">
                  {step === "email" &&
                    "No worries. Enter your email address and we'll send you a verification code."}

                  {step === "otp" &&
                    "We've sent a 6-digit verification code to "}

                  {step === "password" &&
                    "Choose a strong password to keep your account secure."}

                  {step === "otp" && (
                    <strong className="font-semibold text-base-content/75">
                      {email}
                    </strong>
                  )}
                </p>
              </div>

              {step === "email" && (
                <form onSubmit={handleSendOtp} className="mt-8 space-y-5">
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
                        className="h-12 w-full rounded-xl border border-base-300 bg-base-100 pl-11 pr-4 text-sm outline-none transition placeholder:text-base-content/30 focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {message && <Message type={messageType} message={message} />}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary h-12 w-full rounded-xl font-semibold"
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

                  <div className="flex items-start gap-3 rounded-xl bg-base-200/70 px-4 py-3">
                    <ShieldIcon
                      size={18}
                      className="mt-0.5 shrink-0 text-primary"
                    />

                    <p className="text-xs leading-5 text-base-content/55">
                      We'll send a 6-digit code to your email address.
                    </p>
                  </div>
                </form>
              )}

              {step === "otp" && (
                <form onSubmit={handleVerifyOtp} className="mt-8 space-y-7">
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
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        autoFocus={index === 0}
                        className="h-14 w-11 rounded-xl border border-base-300 bg-base-100 text-center text-xl font-semibold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-16 sm:w-14"
                        aria-label={`Verification digit ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-center text-xs text-base-content/50">
                    Didn't receive the code?
                    <button
                      type="button"
                      className="ml-1 font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      Resend
                    </button>
                  </div>

                  {message && <Message type={messageType} message={message} />}

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="btn btn-primary h-12 w-full rounded-xl font-semibold disabled:opacity-50"
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

                  <button
                    type="button"
                    onClick={handleDifferentEmail}
                    className="w-full text-center text-sm font-semibold text-primary hover:underline"
                  >
                    Use a different email
                  </button>
                </form>
              )}

              {step === "password" && (
                <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
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
                          className={`flex-1 rounded-full ${
                            passwordScore >= level
                              ? "bg-success"
                              : "bg-base-300"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="mt-3 space-y-2">
                      <PasswordRule valid={passwordRules.length}>
                        At least 8 characters
                      </PasswordRule>

                      <PasswordRule valid={passwordRules.number}>
                        Includes a number
                      </PasswordRule>

                      <PasswordRule valid={passwordRules.special}>
                        Includes a special character
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

                  {message && <Message type={messageType} message={message} />}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary h-12 w-full rounded-xl font-semibold"
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

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between px-1 text-xs text-base-content/40">
              <div className="flex gap-4">
                <span>Terms</span>
                <span>Privacy</span>
                <span>Help</span>
              </div>

              <span>Aven © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StepProgress = ({ currentStepIndex }) => {
  return (
    <div className="flex items-center">
      {steps.map((item, index) => {
        const completed = index < currentStepIndex;
        const active = index === currentStepIndex;

        return (
          <div key={item.id} className="flex flex-1 items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
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
                  index < currentStepIndex ? "bg-primary" : "bg-base-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

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
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
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
          className="h-12 w-full rounded-xl border border-base-300 bg-base-100 pl-11 pr-12 text-sm outline-none transition placeholder:text-base-content/30 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />

        <button
          type="button"
          onClick={() => setShowPassword((previous) => !previous)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-base-content/35 transition hover:bg-base-200 hover:text-base-content"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <EyeIcon visible={showPassword} size={18} />
        </button>
      </div>
    </div>
  );
};

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

      <span className={valid ? "text-success" : "text-base-content/50"}>
        {children}
      </span>
    </div>
  );
};

const Message = ({ type, message }) => {
  const success = type === "success";

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        success
          ? "border-success/20 bg-success/10 text-success"
          : "border-error/20 bg-error/10 text-error"
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {success ? <CheckIcon /> : <AlertIcon />}
      </div>

      <p className="leading-5">{message}</p>
    </div>
  );
};

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

const AvenLogo = ({ size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M27.5 4C17.2 5.1 8.8 10.4 5.2 19.2c-1 2.4-.9 5.1-.2 7.4 4.5-1.5 8.4-4.3 11.2-8.2C19.6 13.5 22.5 8.5 27.5 4Z"
        fill="currentColor"
      />

      <path
        d="M4.5 28c4.8-6.2 9.4-10.7 17.4-15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

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

const AlertIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
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
