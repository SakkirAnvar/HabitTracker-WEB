import { useEffect } from "react";

const AlertMessage = ({
  type = "success",
  message,
  duration = 3000,
  onClose,
}) => {
  const isSuccess = type === "success";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      className={`
        flex
        items-center
        gap-3
        rounded-xl
        border
        px-4
        py-3
        text-sm
        font-medium
        ${
          isSuccess
            ? "border-success/20 bg-success/10 text-success"
            : "border-error/20 bg-error/10 text-error"
        }
      `}
    >
      {isSuccess ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-5 w-5 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-5 w-5 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
          />
        </svg>
      )}

      <span>{message}</span>
    </div>
  );
};

export default AlertMessage;
