const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  className = "",
}) => {
  // Don't render pagination when there is only one page
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (!hasPreviousPage) return;

    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (!hasNextPage) return;

    onPageChange(currentPage + 1);
  };

  return (
    <div className={`mt-6 flex items-center justify-between ${className}`}>
      <p className="text-sm text-base-content/50">
        Page{" "}
        <span className="font-semibold text-base-content">{currentPage}</span>{" "}
        of <span className="font-semibold text-base-content">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={!hasPreviousPage}
          className="btn btn-sm btn-ghost rounded-xl"
        >
          ← Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!hasNextPage}
          className="btn btn-sm btn-primary rounded-xl"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
