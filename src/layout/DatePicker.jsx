import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "cally";

const CALENDAR_WIDTH = 320;
const VIEWPORT_PADDING = 12;
const GAP = 8;

const DatePicker = ({
  value,
  onChange,
  min,
  max,
  placeholder = "Select date",
  isOpen = false,
  onOpen,
  onClose,
  align = "left",
  buttonClassName = "",
}) => {
  const buttonRef = useRef(null);
  const calendarRef = useRef(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const formatDate = (dateString) => {
    if (!dateString) return placeholder;

    const [year, month, day] = dateString.split("-");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const calendarWidth = Math.min(
      CALENDAR_WIDTH,
      window.innerWidth - VIEWPORT_PADDING * 2,
    );

    let left = align === "right" ? rect.right - calendarWidth : rect.left;

    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(left, window.innerWidth - calendarWidth - VIEWPORT_PADDING),
    );

    const calendarHeight = 390;

    let top = rect.bottom + GAP;

    if (top + calendarHeight > window.innerHeight - VIEWPORT_PADDING) {
      top = Math.max(VIEWPORT_PADDING, rect.top - calendarHeight - GAP);
    }

    setPosition({
      top,
      left,
    });
  };

  const handleToggle = () => {
    if (isOpen) {
      onClose?.();
      return;
    }

    updatePosition();
    onOpen?.();
  };
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      updatePosition();
    };

    const handleScroll = () => {
      onClose?.();
    };

    requestAnimationFrame(updatePosition);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    let cleanup;

    const setupListener = async () => {
      await customElements.whenDefined("calendar-date");

      const calendar = calendarRef.current;

      if (!calendar) return;

      const handleChange = (event) => {
        const selectedDate = event.target.value;

        if (!selectedDate) return;

        onChange?.(selectedDate);
        onClose?.();
      };

      calendar.addEventListener("change", handleChange);

      cleanup = () => {
        calendar.removeEventListener("change", handleChange);
      };
    };

    setupListener();

    return () => {
      cleanup?.();
    };
  }, [isOpen, onChange, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      const clickedButton = buttonRef.current?.contains(event.target);
      const clickedCalendar = calendarRef.current?.contains(event.target);

      if (!clickedButton && !clickedCalendar) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Date trigger */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`
          group flex h-11 w-full items-center gap-3
          rounded-xl border
          bg-base-100
          px-3.5
          text-left
          shadow-sm
          transition-all duration-200
          hover:border-primary/25
          hover:bg-base-100
          active:scale-[0.99]
          focus:outline-none
          focus:ring-2
          focus:ring-primary/10
          ${
            isOpen
              ? "border-primary/40 ring-2 ring-primary/10"
              : "border-base-300"
          }
          ${buttonClassName}
        `}
      >
        <span
          className={`
            flex h-7 w-7 shrink-0 items-center justify-center
            rounded-lg
            transition-colors
            ${
              isOpen || value
                ? "bg-primary/10 text-primary"
                : "bg-base-200 text-base-content/40"
            }
          `}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M8 7V3m8 4V3m-9 4h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-base-content/35">
            Date
          </span>

          <span
            className={`mt-0.5 block truncate text-xs font-semibold ${
              value ? "text-base-content" : "text-base-content/35"
            }`}
          >
            {formatDate(value)}
          </span>
        </span>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`h-4 w-4 shrink-0 text-base-content/35 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Cally popup */}
      {isOpen &&
        createPortal(
          <div
            className="fixed z-[10]"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            <div className="w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-2 shadow-2xl shadow-base-content/10">
              <calendar-date
                ref={calendarRef}
                value={value || undefined}
                min={min || undefined}
                max={max || undefined}
                page-by="single"
                show-outside-days
                className="cally w-full"
              >
                <div
                  slot="previous"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-base-content/50 transition hover:bg-base-200 hover:text-base-content"
                >
                  <svg
                    aria-label="Previous"
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </div>

                <div
                  slot="next"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-base-content/50 transition hover:bg-base-200 hover:text-base-content"
                >
                  <svg
                    aria-label="Next"
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </div>

                <calendar-month />
              </calendar-date>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default DatePicker;
