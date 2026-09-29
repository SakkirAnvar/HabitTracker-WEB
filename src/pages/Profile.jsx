import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ProfileShimmer } from "../layout/Shimmer";
import { updateProfile } from "../redux/userSlice";
import AlertMessage from "../layout/AlertMessage";
import { VITE_API_URL } from "../utils/constants";

const Profile = () => {
  const dispatch = useDispatch();

  const { user, status } = useSelector((store) => store.user);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const getProfilePhotoUrl = (photo) => {
    if (!photo) {
      return "/default-avatar.png";
    }

    if (photo.startsWith("http")) {
      return photo;
    }

    return `${VITE_API_URL}${photo}`;
  };

  const currentFirstName = firstName ?? user?.firstName ?? "";
  const currentLastName = lastName ?? user?.lastName ?? "";

  const currentPhoto = photoPreview || getProfilePhotoUrl(user?.profilePhoto);

  if (!user) {
    if (status === "loading") {
      return <ProfileShimmer />;
    }

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
          👤
        </div>

        <p className="font-medium text-base-content">Unable to load profile.</p>

        <p className="text-sm text-base-content/40">
          User information is not available.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setFormError("");

    const trimmedFirstName = currentFirstName.trim();
    const trimmedLastName = currentLastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      setFormError("First name and last name are required.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("firstName", trimmedFirstName);
      formData.append("lastName", trimmedLastName);

      if (selectedPhoto) {
        formData.append("profilePhoto", selectedPhoto);
      }

      await dispatch(updateProfile(formData)).unwrap();

      setSuccessMessage("Profile updated successfully.");
      setSelectedPhoto(null);

      // Keep local values in sync with the submitted values.
      setFirstName(trimmedFirstName);
      setLastName(trimmedLastName);
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to update profile.",
      );
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setFormError("Only JPG, PNG and WebP images are allowed.");
      setSuccessMessage("");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError("Profile photo must be smaller than 2MB.");
      setSuccessMessage("");
      return;
    }

    setFormError("");
    setSuccessMessage("");

    setSelectedPhoto(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const isUpdating = status === "loading";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 px-6 py-7 sm:px-8 sm:py-8">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border-[18px] border-primary/10" />

        <div className="pointer-events-none absolute bottom-[-45px] right-24 h-32 w-32 rounded-full bg-secondary/10" />

        <div className="pointer-events-none absolute right-8 top-8 text-5xl text-primary/10">
          ✦
        </div>

        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Your Profile
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            Profile
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
            Manage your personal information and account details.
          </p>
        </div>
      </section>
      {successMessage && (
        <AlertMessage
          type="success"
          message={successMessage}
          duration={3000}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {formError && (
        <AlertMessage
          type="error"
          message={formError}
          duration={4000}
          onClose={() => setFormError("")}
        />
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
        <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          {/* Header */}

          <div className="border-b border-base-300 px-6 py-5">
            <h2 className="text-xl font-semibold tracking-tight text-base-content">
              Personal information
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              Update your profile photo and personal details.
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Avatar */}

              <div className="relative shrink-0">
                <div className="h-24 w-24 overflow-hidden rounded-full border border-base-300 bg-base-200 ring-4 ring-base-200/50 sm:h-28 sm:w-28">
                  <img
                    src={currentPhoto}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      if (e.currentTarget.src.includes("default-avatar")) {
                        return;
                      }

                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                </div>

                {/* Camera */}

                <label
                  htmlFor="profile-photo"
                  className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-base-100 bg-primary text-primary-content shadow-sm transition hover:bg-primary/90"
                  title="Change profile photo"
                >
                  <CameraIcon />
                </label>

                <input
                  id="profile-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Identity */}

              <div className="min-w-0">
                <h3 className="text-xl font-semibold text-base-content">
                  {currentFirstName || currentLastName
                    ? `${currentFirstName} ${currentLastName}`.trim()
                    : "Your name"}
                </h3>

                <p className="mt-1 truncate text-sm text-base-content/60">
                  {user.emailId}
                </p>

                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Active
                </div>
              </div>
            </div>

            {/* Divider */}

            <div className="my-6 h-px bg-base-300" />

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Names */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-base-content">
                    First name
                  </label>

                  <input
                    type="text"
                    value={currentFirstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input h-12 w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                    placeholder="First name"
                    autoComplete="given-name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-base-content">
                    Last name
                  </label>

                  <input
                    type="text"
                    value={currentLastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input h-12 w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                    placeholder="Last name"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Save */}

              <div className="flex justify-end border-t border-base-300 pt-5">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn h-11 min-w-40 rounded-xl border-0 bg-primary px-6 text-sm font-semibold text-primary-content shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
                >
                  {isUpdating ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          {/* Header */}
          <div className="border-b border-base-300 px-6 py-5">
            <h2 className="text-xl font-semibold tracking-tight text-base-content">
              Account overview
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              Your account details and security.
            </p>
          </div>

          {/* Account details */}
          <div className="flex flex-1 flex-col px-6">
            {/* Email */}
            <div className="flex items-start gap-4 border-b border-base-300 py-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MailIcon />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-base-content">
                    Email address
                  </p>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-2.5 py-1 text-[11px] font-medium text-base-content/55">
                    <LockIcon className="h-3 w-3" />
                    Not editable
                  </span>
                </div>

                <p className="mt-1 truncate text-sm text-base-content/65">
                  {user?.emailId || "—"}
                </p>
              </div>
            </div>

            {/* Member since */}
            <div className="flex items-center gap-4 border-b border-base-300 py-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CalendarIcon />
              </div>

              <div>
                <p className="text-sm font-semibold text-base-content">
                  Member since
                </p>

                <p className="mt-1 text-sm text-base-content/60">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>

            {/* Security */}
            <Link to="/settings" className="group flex items-center gap-4 py-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                <ShieldIcon />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-base-content">
                  Security & password
                </p>

                <p className="mt-1 text-sm leading-5 text-base-content/60">
                  Manage your password and security settings.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="hidden sm:inline">Manage</span>
                <ChevronRightIcon className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>

          {/* Footer */}
          <div className="border-t border-base-300 px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-base-content/50">
              <ShieldIcon className="h-4 w-4 shrink-0 text-primary/70" />

              <span>
                Your account information is private and securely stored.
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 7.5h3l1.5-2h7l1.5 2h3A1.5 1.5 0 0 1 21.5 9v9A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V9A1.5 1.5 0 0 1 4 7.5Z"
    />
    <circle cx="12" cy="13.5" r="3.25" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <rect width="18" height="14" x="3" y="5" rx="2" />

    <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9 6 9-6" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 2v4M8 2v4M3 10h18"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3 20 6v5.5c0 4.8-3.2 8.4-8 9.5-4.8-1.1-8-4.7-8-9.5V6l8-3Z"
    />

    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-5 w-5 shrink-0 text-base-content/40 transition group-hover:translate-x-0.5 group-hover:text-base-content"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5"
  >
    <rect width="14" height="11" x="5" y="10" rx="2" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10V7a4 4 0 0 1 8 0v3"
    />
  </svg>
);

export default Profile;
