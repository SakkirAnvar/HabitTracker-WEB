import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProfileShimmer } from "../layout/Shimmer";
import { updateProfile } from "../redux/userSlice";
import AlertMessage from "../layout/AlertMessage";

const Profile = () => {
  const dispatch = useDispatch();

  const { user, status, error } = useSelector((store) => store.user);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const getProfilePhotoUrl = (photo) => {
    if (!photo) {
      return "/default-avatar.png";
    }

    if (photo.startsWith("http")) {
      return photo;
    }

    return `${import.meta.env.VITE_API_URL}${photo}`;
  };

  const [photoPreview, setPhotoPreview] = useState(() =>
    getProfilePhotoUrl(user?.profilePhoto),
  );

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

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

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
      <section>
        {/* Breadcrumb */}

        <div className="mb-3 flex items-center gap-2 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-base-content/35"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>

          <span className="font-medium text-base-content/45">Account</span>

          <span className="text-base-content/25">/</span>

          <span className="font-medium text-primary">Profile</span>
        </div>

        {/* Heading */}

        <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
          Profile
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-base-content/55 sm:text-base">
          Manage your personal information and profile photo.
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        <div className="relative overflow-hidden border-b border-primary/10 bg-primary/5">
          {/* Decorative circles */}

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/5" />

          <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-secondary/5" />

          <div className="relative flex flex-col gap-6 px-6 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
            {/* User */}

            <div className="flex items-center gap-5">
              {/* Avatar */}

              <div className="relative shrink-0">
                <div className="avatar">
                  <div className="w-24 rounded-full bg-base-100 p-1 ring-2 ring-primary/10 ring-offset-2 ring-offset-base-100 sm:w-28">
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                </div>

                {/* Camera */}

                <label
                  htmlFor="profilePhotoHero"
                  className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-base-100 bg-primary text-primary-content shadow-sm transition hover:bg-primary/90"
                  aria-label="Change profile photo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8a2 2 0 012-2h2l1.5-2h7L17 6h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    />

                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </label>

                <input
                  id="profilePhotoHero"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* Identity */}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight text-base-content">
                    {firstName} {lastName}
                  </h2>

                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                    Aven Member
                  </span>
                </div>

                <p className="mt-1 text-sm text-base-content/55 sm:text-base">
                  Better habits. A brighter you.
                </p>

                <p className="mt-2 text-xs text-base-content/40">
                  JPG, PNG or WebP · Maximum 2MB
                </p>
              </div>
            </div>

            {/* Photo Button */}

            <div className="shrink-0">
              <label
                htmlFor="profilePhoto"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/20 bg-base-100 px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/40 hover:bg-primary/5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487a2.25 2.25 0 113.182 3.182L8.25 19.643 4 20l.357-4.25L16.862 4.487z"
                  />
                </svg>
                Change Photo
              </label>

              <input
                id="profilePhoto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Messages */}

          {(formError || error) && (
            <div className="px-6 pt-5 sm:px-8">
              <AlertMessage
                type="error"
                message={formError || error}
                duration={3000}
                onClose={() => setFormError("")}
              />
            </div>
          )}

          {successMessage && (
            <div className="px-6 pt-5 sm:px-8">
              <AlertMessage
                type="success"
                message={successMessage}
                duration={3000}
                onClose={() => setSuccessMessage("")}
              />
            </div>
          )}

          {/* Section Header */}

          <div className="px-6 pb-5 pt-7 sm:px-8">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold text-base-content">
                  Personal Information
                </h2>

                <p className="mt-0.5 text-sm text-base-content/50">
                  Update your personal details.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}

          <div className="mx-6 border-t border-base-300 sm:mx-8" />

          {/* Fields */}

          <div className="space-y-6 px-6 py-6 sm:px-8">
            {/* Names */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  First Name
                  <span className="ml-1 text-error">*</span>
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFormError("");
                  }}
                  maxLength={50}
                  required
                  className="input h-11 w-full rounded-xl border-base-300 bg-base-100 text-sm text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  Last Name
                  <span className="ml-1 text-error">*</span>
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setFormError("");
                  }}
                  maxLength={50}
                  required
                  className="input h-11 w-full rounded-xl border-base-300 bg-base-100 text-sm text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-base-content"
              >
                Email Address
              </label>

              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/35"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>

                <input
                  id="email"
                  type="email"
                  value={user.emailId || ""}
                  disabled
                  className="input h-11 w-full rounded-xl border-base-300 bg-base-200 pl-10 text-sm text-base-content/55"
                />
              </div>

              <p className="mt-2 text-xs text-base-content/40">
                Your email address cannot be changed here.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-base-300 px-6 py-4 sm:px-8">
            <button
              type="submit"
              disabled={isUpdating}
              className="btn btn-primary min-w-32 rounded-xl px-5"
            >
              {isUpdating ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12.5l4.5 4.5L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-base-content">
              Account Information
            </h2>

            <p className="mt-0.5 text-sm text-base-content/50">
              Basic information about your Aven account.
            </p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-base-300 rounded-2xl border border-base-300">
          {/* Email */}

          <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-base-content/55">Email</span>

            <span className="break-all text-sm font-medium text-base-content">
              {user.emailId}
            </span>
          </div>

          {/* Member Since */}

          {user.createdAt && (
            <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-base-content/55">Member since</span>

              <span className="text-sm font-medium text-base-content">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="pb-2 text-center">
        <p className="text-xs text-base-content/35">
          Aven · Build your better days.
        </p>
      </div>
    </div>
  );
};

export default Profile;
