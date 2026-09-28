import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SettingsShimmer } from "../layout/Shimmer";
import { changePassword, changeTheme } from "../redux/userSlice";
import { applyTheme } from "../utils/theme";
import AlertMessage from "../layout/AlertMessage";

const Settings = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((store) => store.user);

  const [theme, setTheme] = useState(user?.theme || "system");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [themeLoading, setThemeLoading] = useState(false);

  const handleThemeChange = async (newTheme) => {
    if (themeLoading || newTheme === theme) return;
    const previousTheme = theme;

    try {
      setFormError("");
      setSuccessMessage("");
      setThemeLoading(true);
      setTheme(newTheme);
      applyTheme(newTheme);
      await dispatch(changeTheme(newTheme)).unwrap();
    } catch (err) {
      setTheme(previousTheme);
      applyTheme(previousTheme);
      setFormError(
        typeof err === "string" ? err : err?.message || "Failed to update theme.",
      );
    } finally {
      setThemeLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setFormError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormError("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 6) {
      setFormError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("New passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      setFormError("New password must be different from your current password.");
      return;
    }

    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      setSuccessMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setFormError(
        typeof err === "string" ? err : err?.message || "Failed to change password.",
      );
    }
  };

  if (!user && status === "loading") return <SettingsShimmer />;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      {/* Header kept unchanged */}
      <section>
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 px-6 py-7 sm:px-8 sm:py-8">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Personalize Aven
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              Settings
            </h1>

            <p className="mt-2 text-sm leading-6 text-base-content/55 sm:text-base">
              Manage your account, security, and Aven preferences.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-8 -top-10 opacity-20">
            <div className="relative h-36 w-36">
              <span className="absolute right-6 top-2 h-20 w-10 rotate-[30deg] rounded-full bg-secondary" />
              <span className="absolute right-12 top-14 h-24 w-12 -rotate-[38deg] rounded-full bg-primary" />
              <span className="absolute bottom-0 right-3 h-16 w-8 rotate-[52deg] rounded-full bg-secondary" />
            </div>
          </div>
        </div>
      </section>

      {(formError || error) && (
        <AlertMessage
          type="error"
          message={formError || error}
          duration={3000}
          onClose={() => setFormError("")}
        />
      )}

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        {/* Security */}
        <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="border-b border-base-300 px-5 py-5 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div>
                  <h2 className="text-lg font-semibold text-base-content">
                    Account security
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-base-content/50">
                    Update your password to keep your account protected.
                  </p>
                </div>
              </div>

              <span className="hidden rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-success sm:inline-flex">
                Secure
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-5 sm:p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <PasswordField
                  id="currentPassword"
                  label="Current password"
                  value={currentPassword}
                  onChange={(value) => {
                    setCurrentPassword(value);
                    setFormError("");
                    setSuccessMessage("");
                  }}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />

                <PasswordField
                  id="newPassword"
                  label="New password"
                  value={newPassword}
                  onChange={(value) => {
                    setNewPassword(value);
                    setFormError("");
                    setSuccessMessage("");
                  }}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  hint="Minimum 6 characters"
                />

                <div className="md:col-span-2">
                  <PasswordField
                    id="confirmPassword"
                    label="Confirm new password"
                    value={confirmPassword}
                    onChange={(value) => {
                      setConfirmPassword(value);
                      setFormError("");
                      setSuccessMessage("");
                    }}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {successMessage && (
                <div className="mt-4">
                  <AlertMessage
                    type="success"
                    message={successMessage}
                    duration={3000}
                    onClose={() => setSuccessMessage("")}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-base-300 bg-base-200/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-base-content/40">
                Changes take effect immediately.
              </p>

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn btn-primary min-h-10 rounded-xl px-5"
              >
                {status === "loading" ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Updating...
                  </>
                ) : (
                  "Change password"
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Appearance */}
        <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="border-b border-base-300 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3.5">
              <div>
                <h2 className="text-lg font-semibold text-base-content">
                  Appearance
                </h2>
                <p className="mt-1 text-sm leading-5 text-base-content/50">
                  Choose how Aven should look on your device.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="space-y-2.5">
              {[
                ["light", "Light", "Clean and bright"],
                ["dark", "Dark", "Easy on the eyes"],
                ["system", "System", "Follow your device preference"],
              ].map(([value, label, description]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleThemeChange(value)}
                  disabled={themeLoading}
                  aria-pressed={theme === value}
                  className={`w-full rounded-2xl border p-3 text-left transition-all duration-200 ${
                    theme === value
                      ? "border-primary/30 bg-primary/5 ring-1 ring-primary/10"
                      : "border-base-300 hover:border-primary/20 hover:bg-base-200/35"
                  } ${themeLoading ? "cursor-wait opacity-70" : ""}`}
                >
                  <div className="flex items-center gap-3.5">
                    <ThemePreview type={value} />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-base-content">
                        {label}
                      </p>
                      <p className="mt-0.5 text-xs text-base-content/45">
                        {description}
                      </p>
                    </div>

                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        theme === value
                          ? "border-primary bg-primary text-primary-content"
                          : "border-base-300 bg-base-100"
                      }`}
                    >
                      {theme === value && "✓"}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-base-200/45 px-3.5 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="text-xs text-base-content/45">
                Your preference is saved automatically.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const PasswordField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  hint,
}) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-semibold text-base-content">
      {label}
    </label>
    <input
      id={id}
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="input h-11 w-full rounded-xl border-base-300 bg-base-100 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
    />
    {hint && <p className="mt-2 text-[11px] text-base-content/40">{hint}</p>}
  </div>
);

const ThemePreview = ({ type }) => {
  if (type === "system") {
    return (
      <div className="flex h-12 w-16 shrink-0 overflow-hidden rounded-xl border border-base-300 bg-base-200">
        <div className="flex w-1/2 items-center justify-center bg-[#f7f9f8]">
          <div className="h-5 w-7 rounded-md bg-white shadow-sm" />
        </div>
        <div className="flex w-1/2 items-center justify-center bg-[#0d211c]">
          <div className="h-5 w-7 rounded-md bg-[#142b24]" />
        </div>
      </div>
    );
  }

  const dark = type === "dark";

  return (
    <div
      className={`h-12 w-16 shrink-0 overflow-hidden rounded-xl border ${
        dark ? "border-[#263b35] bg-[#071512]" : "border-base-300 bg-[#f7f9f8]"
      }`}
    >
      <div className="space-y-1.5 p-2">
        <div className={`h-1.5 w-8 rounded-full ${dark ? "bg-[#263b35]" : "bg-[#dce8e4]"}`} />
        <div className={`h-1.5 w-11 rounded-full ${dark ? "bg-[#263b35]" : "bg-[#dce8e4]"}`} />
        <div className="grid grid-cols-2 gap-1.5">
          <div className={`h-4 rounded-md ${dark ? "bg-[#0d211c]" : "bg-white shadow-sm"}`} />
          <div className={`h-4 rounded-md ${dark ? "bg-[#0d211c]" : "bg-white shadow-sm"}`} />
        </div>
      </div>
    </div>
  );
};


export default Settings;
