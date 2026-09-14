import { useState } from "react";

const faqs = [
  {
    question: "How do I create a habit?",
    answer:
      "Go to the Habits page and click Create Habit. Enter the habit name, category, type, frequency, and target if required, then save it.",
  },
  {
    question: "How is my habit progress calculated?",
    answer:
      "Boolean habits are completed when you mark them as done. Numeric and duration habits are calculated based on the value you record compared with the target.",
  },
  {
    question: "How are streaks calculated?",
    answer:
      "A streak increases when you consistently complete a scheduled habit. Missing a scheduled day can break the current streak, while your longest streak is preserved.",
  },
  {
    question: "Can I edit or delete a habit?",
    answer:
      "Yes. Open the Habits page and use the actions available on the habit card to edit or delete the habit.",
  },
  {
    question: "How do goals work?",
    answer:
      "Create a goal with a target and deadline, then attach relevant habits to it. A goal can contain multiple habits that contribute toward your overall progress.",
  },
  {
    question: "What is the Journal used for?",
    answer:
      "The Journal lets you record your mood, energy, daily reflections, improvements, and priorities for tomorrow.",
  },
  {
    question: "Why is my analytics data not showing?",
    answer:
      "Analytics are based on your habits and recorded daily progress. If you have not created or completed any scheduled habits yet, some analytics may appear empty or show zero progress.",
  },
  {
    question: "How can I change my password?",
    answer:
      "Open Settings and use the Change Password section. Enter your current password and choose a new password.",
  },
];

const HelpAndSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter((faq) => {
    const query = search.toLowerCase().trim();

    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );
  });

  const toggleFaq = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* ================= HEADER ================= */}

      <section className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
          ?
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
          How can we help?
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
          Find answers to common questions about Aven and your personal growth
          journey.
        </p>

        {/* Search */}

        <div className="mx-auto mt-7 max-w-xl">
          <label className="input flex w-full items-center gap-3 border-base-300 bg-base-100 shadow-sm focus-within:border-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-base-content/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search for help..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIndex(null);
              }}
              className="grow"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setOpenIndex(null);
                }}
                className="btn btn-circle btn-ghost btn-xs text-base-content/50 hover:bg-base-200 hover:text-base-content"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </label>
        </div>
      </section>

      {/* ================= QUICK HELP ================= */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-base-content">
            Quick Help
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            Start with the area you need help with.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Getting Started */}

          <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
              🌱
            </div>

            <h2 className="mt-4 font-semibold text-base-content">
              Getting Started
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-base-content/60">
              Create your first habit and start building your daily routine.
            </p>
          </div>

          {/* Track Progress */}

          <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-xl">
              📊
            </div>

            <h2 className="mt-4 font-semibold text-base-content">
              Track Progress
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-base-content/60">
              Use analytics and streaks to understand your consistency.
            </p>
          </div>

          {/* Reach Goals */}

          <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-xl">
              🎯
            </div>

            <h2 className="mt-4 font-semibold text-base-content">
              Reach Goals
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-base-content/60">
              Connect habits to goals and keep moving forward.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-base-content">
            Frequently Asked Questions
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            Quick answers to common questions.
          </p>
        </div>

        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border bg-base-100 shadow-sm transition-all ${
                    isOpen ? "border-primary/30 shadow-md" : "border-base-300"
                  }`}
                >
                  {/* Question */}

                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-base-200/50 sm:px-6"
                    aria-expanded={isOpen}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                          isOpen
                            ? "bg-primary text-primary-content"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        ?
                      </span>

                      <span className="font-medium text-base-content">
                        {faq.question}
                      </span>
                    </div>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/60 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ↓
                    </span>
                  </button>

                  {/* Answer */}

                  {isOpen && (
                    <div className="border-t border-base-300 px-5 pb-5 pt-4 sm:px-6">
                      <p className="pl-11 text-sm leading-6 text-base-content/60">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 text-2xl">
                🔎
              </div>

              <h3 className="mt-4 font-semibold text-base-content">
                No results found
              </h3>

              <p className="mt-1 text-sm text-base-content/60">
                Try searching with a different keyword.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="btn btn-sm btn-ghost mt-4"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= CONTACT SUPPORT ================= */}

      <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl">
              💬
            </div>

            <div>
              <h2 className="text-xl font-bold text-base-content">
                Still need help?
              </h2>

              <p className="mt-1 max-w-lg text-sm leading-6 text-base-content/60">
                If you couldn't find what you're looking for, get in touch with
                the Aven support team.
              </p>
            </div>
          </div>

          <a
            href="mailto:support@aven.app"
            className="btn btn-primary shrink-0"
          >
            Contact Support
          </a>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <div className="pb-4 text-center">
        <p className="text-xs text-base-content/40">
          Aven · Build your better days.
        </p>
      </div>
    </div>
  );
};

export default HelpAndSupport;
