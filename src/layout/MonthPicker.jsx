import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PICKER_WIDTH = 304;
const VIEWPORT_PADDING = 12;
const GAP = 8;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const FULL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthPicker = ({
  value,
  onChange,
  maxMonth,
  placeholder = "Select month",
  isOpen = false,
  onOpen,
  onClose,
  align = "right",
  buttonClassName = "",
}) => {
  const buttonRef = useRef(null);
  const pickerRef = useRef(null);

  const [displayYear, setDisplayYear] = useState(() => {
    if (value) return Number(value.slice(0, 4));
    if (maxMonth) return Number(maxMonth.slice(0, 4));
    return new Date().getFullYear();
  });

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const selectedYear = value ? Number(value.slice(0, 4)) : null;
  const selectedMonth = value ? Number(value.slice(5, 7)) : null;

  const maxYear = maxMonth ? Number(maxMonth.slice(0, 4)) : null;
  const maxMonthNumber = maxMonth ? Number(maxMonth.slice(5, 7)) : null;

  const getPickerYear = () => {
    if (value) return Number(value.slice(0, 4));
    if (maxMonth) return Number(maxMonth.slice(0, 4));
    return new Date().getFullYear();
  };

  const formatValue = () => {
    if (!value) return placeholder;

    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(5, 7));

    if (!year || !month || month < 1 || month > 12) {
      return placeholder;
    }

    return `${FULL_MONTHS[month - 1]} ${year}`;
  };

  const updatePosition = () => {
    const button = buttonRef.current;

    if (!button) return;

    const rect = button.getBoundingClientRect();

    let left = align === "right" ? rect.right - PICKER_WIDTH : rect.left;

    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(left, window.innerWidth - PICKER_WIDTH - VIEWPORT_PADDING),
    );

    const pickerHeight = 300;
    let top = rect.bottom + GAP;

    if (top + pickerHeight > window.innerHeight - VIEWPORT_PADDING) {
      top = Math.max(VIEWPORT_PADDING, rect.top - pickerHeight - GAP);
    }

    setPosition({
      top,
      left,
    });
  };

  useEffect(() => {
  if (!isOpen) return;

  updatePosition();

  const handleResize = () => updatePosition();

  const handleScroll = () => {
    onClose?.();
  };

  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleScroll, true);

  return () => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("scroll", handleScroll, true);
  };
}, [isOpen, align, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      const button = buttonRef.current;
      const picker = pickerRef.current;

      if (button?.contains(event.target) || picker?.contains(event.target)) {
        return;
      }

      onClose?.();
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const handleToggle = () => {
    if (isOpen) {
      onClose?.();
      return;
    }

    setDisplayYear(getPickerYear());
    updatePosition();
    onOpen?.();
  };

  const isMonthDisabled = (monthIndex) => {
    if (!maxMonth) return false;

    const month = monthIndex + 1;

    if (displayYear > maxYear) return true;

    return displayYear === maxYear && month > maxMonthNumber;
  };

  const handleMonthSelect = (monthIndex) => {
    if (isMonthDisabled(monthIndex)) return;

    const month = String(monthIndex + 1).padStart(2, "0");

    onChange?.(`${displayYear}-${month}`);
    onClose?.();
  };

  const goToPreviousYear = () => {
    setDisplayYear((previousYear) => previousYear - 1);
  };

  const goToNextYear = () => {
    if (maxYear !== null && displayYear >= maxYear) {
      return;
    }

    setDisplayYear((previousYear) => previousYear + 1);
  };

  const goToCurrentMonth = () => {
    const today = new Date();

    const currentMonth = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}`;

    if (maxMonth && currentMonth > maxMonth) {
      return;
    }

    setDisplayYear(today.getFullYear());
    onChange?.(currentMonth);
    onClose?.();
  };

  const isSelected = (monthIndex) =>
    selectedYear === displayYear && selectedMonth === monthIndex + 1;

  const isCurrentMonth = (monthIndex) => {
    const today = new Date();

    return (
      today.getFullYear() === displayYear && today.getMonth() === monthIndex
    );
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-label={value ? `Select month: ${formatValue()}` : "Select month"}
        className={`
          group flex h-11 w-[200px] items-center gap-3
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
          <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-base-content/40">
            Month
          </span>

          <span
            className={`block truncate text-xs font-semibold leading-5 ${
              value ? "text-base-content" : "text-base-content/45"
            }`}
          >
            {formatValue()}
          </span>
        </span>

        <svg
          className={`h-4 w-4 shrink-0 text-base-content/35 transition-transform duration-200 group-hover:text-base-content/55 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 1.04l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={pickerRef}
            className="fixed z-[10] w-[288px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-3.5 shadow-xl sm:w-[296px]"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-content/40">
                  Select month
                </p>

                <p className="mt-0.5 text-base font-semibold text-base-content">
                  {displayYear}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={goToPreviousYear}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-base-content/50 transition hover:bg-base-200 hover:text-base-content"
                  aria-label="Previous year"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 15.77a.75.75 0 01-1.06.02l-5-4.75a.75.75 0 010-1.08l5-4.75a.75.75 0 111.04 1.08L8.31 10.5l4.48 4.21a.75.75 0 010 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={goToNextYear}
                  disabled={maxYear !== null && displayYear >= maxYear}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-base-content/50 transition hover:bg-base-200 hover:text-base-content disabled:cursor-not-allowed disabled:opacity-25"
                  aria-label="Next year"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L10.586 10 7.293 14.707Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Months */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {MONTHS.map((month, index) => {
                const disabled = isMonthDisabled(index);
                const selected = isSelected(index);
                const current = isCurrentMonth(index);

                return (
                  <button
                    key={month}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleMonthSelect(index)}
                    className={[
                      "relative h-10 rounded-xl text-[13px] font-medium transition-all",
                      selected
                        ? "bg-primary font-semibold text-primary-content shadow-sm"
                        : current
                          ? "border border-primary/25 bg-primary/5 text-primary"
                          : "text-base-content/70 hover:bg-base-200 hover:text-base-content",
                      disabled ? "cursor-not-allowed opacity-25" : "",
                    ].join(" ")}
                  >
                    {month}

                    {current && !selected && (
                      <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-base-300 pt-3">
              <p className="text-[10px] text-base-content/40">
                {value ? formatValue() : "No month selected"}
              </p>

              <button
                type="button"
                onClick={goToCurrentMonth}
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary/10"
              >
                Current month
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default MonthPicker;
