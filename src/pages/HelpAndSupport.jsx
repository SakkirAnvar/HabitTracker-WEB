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
    const query = search.toLowerCase();

    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );
  });

  const toggleFaq = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <section className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
          ?
        </div>

        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
          How can we help?
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-sm text-base-content/60 sm:text-base">
          Find answers to common questions about Aven and your personal growth
          journey.
        </p>

        {/* Search */}
        <div className="mx-auto mt-6 max-w-xl">
          <label className="input input-bordered flex w-full items-center gap-3 bg-base-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 opacity-50"
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
            />
          </label>
        </div>
      </section>

      {/* Quick Help */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">
            🌱
          </div>

          <h2 className="mt-4 font-semibold">Getting Started</h2>

          <p className="mt-1 text-sm text-base-content/60">
            Create your first habit and start building your daily routine.
          </p>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-xl">
            📊
          </div>

          <h2 className="mt-4 font-semibold">Track Progress</h2>

          <p className="mt-1 text-sm text-base-content/60">
            Use analytics and streaks to understand your consistency.
          </p>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-xl">
            🎯
          </div>

          <h2 className="mt-4 font-semibold">Reach Goals</h2>

          <p className="mt-1 text-sm text-base-content/60">
            Connect habits to goals and keep moving forward.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Frequently Asked Questions</h2>

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
                  className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-base-200/50"
                  >
                    <span className="font-medium">{faq.question}</span>

                    <span
                      className={`text-lg transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-base-300 px-5 pb-5 pt-4">
                      <p className="text-sm leading-6 text-base-content/60">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-base-300 bg-base-100 p-10 text-center">
              <div className="text-3xl">🔎</div>

              <h3 className="mt-3 font-semibold">No results found</h3>

              <p className="mt-1 text-sm text-base-content/60">
                Try searching with a different keyword.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">
              💬
            </div>

            <h2 className="mt-4 text-xl font-bold">Still need help?</h2>

            <p className="mt-1 max-w-lg text-sm text-base-content/60">
              If you couldn't find what you're looking for, get in touch with
              the Aven support team.
            </p>
          </div>

          <a href="mailto:support@aven.app" className="btn btn-primary">
            Contact Support
          </a>
        </div>
      </section>

      {/* Footer note */}
      <div className="pb-4 text-center">
        <p className="text-xs text-base-content/40">
          Aven · Build your better days.
        </p>
      </div>
    </div>
  );
};

export default HelpAndSupport;
