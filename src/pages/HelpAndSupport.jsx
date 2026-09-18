import { useEffect, useMemo, useState } from "react";
import { HelpAndSupportShimmer } from "../layout/Shimmer";

const faqs = [
  {
    category: "Habits",
    question: "How do I create a habit?",
    answer:
      "Go to the Habits page and click Create Habit. Enter the habit name, category, type, frequency, and target if required, then save it.",
  },
  {
    category: "Habits",
    question: "How is my habit progress calculated?",
    answer:
      "Boolean habits are completed when you mark them as done. Numeric and duration habits are calculated based on the value you record compared with the target.",
  },
  {
    category: "Habits",
    question: "How are streaks calculated?",
    answer:
      "A streak increases when you consistently complete a scheduled habit. Missing a scheduled day can break the current streak, while your longest streak is preserved.",
  },
  {
    category: "Habits",
    question: "Can I edit or delete a habit?",
    answer:
      "Yes. Open the Habits page and use the actions available on the habit card to edit or delete the habit.",
  },
  {
    category: "Goals",
    question: "How do goals work?",
    answer:
      "Create a goal with a target and deadline, then attach relevant habits to it. A goal can contain multiple habits that contribute toward your overall progress.",
  },
  {
    category: "Journal",
    question: "What is the Journal used for?",
    answer:
      "The Journal lets you record your mood, energy, daily reflections, improvements, and priorities for tomorrow.",
  },
  {
    category: "Analytics",
    question: "Why is my analytics data not showing?",
    answer:
      "Analytics are based on your habits and recorded daily progress. If you have not created or completed any scheduled habits yet, some analytics may appear empty or show zero progress.",
  },
  {
    category: "Account",
    question: "How can I change my password?",
    answer:
      "Open Settings and use the Change Password section. Enter your current password and choose a new password.",
  },
];

const categories = ["All", "Habits", "Goals", "Journal", "Account"];

const HelpAndSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" || faq.category === activeCategory;

      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const toggleFaq = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setOpenIndex(null);
  };

  if (isLoading) {
    return <HelpAndSupportShimmer />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7 pb-8">
      <section className="relative overflow-hidden">
        {/* Breadcrumb */}

        <div className="mb-5 flex items-center gap-2 text-sm">
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

          <span className="text-base-content/40">Help</span>

          <span className="text-base-content/20">/</span>

          <span className="font-medium text-primary">Help & Support</span>
        </div>

        {/* Hero */}

        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 px-6 py-7 sm:px-8 sm:py-8">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Help & Support
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              How can we help?
            </h1>

            <p className="mt-2 text-sm leading-6 text-base-content/55 sm:text-base">
              Find answers to common questions and get the help you need with
              Aven.
            </p>
          </div>

          {/* Decorative support elements */}

          <div className="pointer-events-none absolute -right-8 -top-10 opacity-20">
            <div className="relative h-36 w-44">
              {/* Chat bubble */}

              <span className="absolute right-16 top-3 flex h-20 w-24 items-center justify-center rounded-3xl bg-secondary">
                <span className="text-3xl text-primary-content">?</span>

                <span className="absolute bottom-[-7px] left-5 h-4 w-4 rotate-45 bg-secondary" />
              </span>

              {/* Smaller bubble */}

              <span className="absolute bottom-4 right-2 flex h-14 w-20 items-center justify-center rounded-2xl bg-primary">
                <span className="text-xl text-primary-content">•••</span>

                <span className="absolute bottom-[-5px] right-5 h-3 w-3 rotate-45 bg-primary" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SearchIcon />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-base-content">
              Find answers
            </h2>

            <p className="mt-0.5 text-sm text-base-content/50">
              Search our help center for articles, guides, and solutions.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="input flex h-12 flex-1 items-center gap-3 rounded-xl border-base-300 bg-base-100 shadow-none focus-within:border-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/10">
            <SearchIcon />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIndex(null);
              }}
              placeholder="Search for help articles..."
              className="grow text-sm"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setOpenIndex(null);
                }}
                className="text-base-content/30 transition hover:text-base-content/60"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </label>

          <button
            type="button"
            onClick={() => {
              document.getElementById("faq-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="btn btn-primary h-12 rounded-xl px-7"
          >
            Search
          </button>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight text-base-content">
            Popular Topics
          </h2>

          <p className="mt-1 text-sm text-base-content/50">
            Quick access to the most common help categories.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Getting Started */}

          <TopicCard
            icon={<BookIcon />}
            title="Getting Started"
            description="Learn the basics and set up your account."
            onClick={() => {
              setActiveCategory("All");
              setSearch("create habit");
              setOpenIndex(null);
              document
                .getElementById("faq-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Habits */}

          <TopicCard
            icon={<CheckIcon />}
            title="Habits"
            description="Create, track, and manage your habits."
            onClick={() => {
              setActiveCategory("Habits");
              setSearch("");
              setOpenIndex(null);
              document
                .getElementById("faq-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Analytics */}

          <TopicCard
            icon={<ChartIcon />}
            title="Analytics"
            description="Understand your progress and insights."
            onClick={() => {
              setActiveCategory("All");
              setSearch("analytics");
              setOpenIndex(null);
              document
                .getElementById("faq-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Account & Settings */}

          <TopicCard
            icon={<SettingsIcon />}
            title="Account & Settings"
            description="Manage your profile, preferences, and security."
            onClick={() => {
              setActiveCategory("Account");
              setSearch("");
              setOpenIndex(null);
              document
                .getElementById("faq-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>
      </section>

      <section id="faq-section">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-base-content">
              Frequently Asked Questions
            </h2>

            <p className="mt-1 text-sm text-base-content/50">
              Find quick answers to common questions.
            </p>
          </div>

          {/* Category Tabs */}

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const selected = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    selected
                      ? "bg-primary text-primary-content"
                      : "border border-base-300 bg-base-100 text-base-content/55 hover:border-primary/25 hover:text-primary"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border bg-base-100 transition ${
                    isOpen ? "border-primary/25 shadow-sm" : "border-base-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-base-200/30 sm:px-5"
                    aria-expanded={isOpen}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                          isOpen
                            ? "bg-primary text-primary-content"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        ?
                      </span>

                      <span className="text-sm font-medium text-base-content sm:text-base">
                        {faq.question}
                      </span>
                    </div>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/40 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ↓
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-base-300 px-5 pb-5 pt-4 sm:px-6">
                      <div className="flex gap-3">
                        <div className="w-9 shrink-0" />

                        <p className="text-sm leading-6 text-base-content/60">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-base-200">
                <SearchIcon />
              </div>

              <h3 className="mt-4 font-semibold text-base-content">
                No results found
              </h3>

              <p className="mt-1 text-sm text-base-content/50">
                Try searching with a different keyword.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                  setOpenIndex(null);
                }}
                className="btn btn-sm btn-ghost mt-4 rounded-xl"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
          {/* Left */}

          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ChatIcon />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-base-content">
                Still need help?
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/50">
                Can't find what you're looking for? Our support team is here to
                help.
              </p>

              <a
                href="mailto:support@aven.app"
                className="btn btn-outline btn-sm mt-4 rounded-xl border-primary/30 px-5 text-primary hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <MailIcon />
                Contact Support
              </a>
            </div>
          </div>

          {/* Divider / response time */}

          <div className="hidden h-16 w-px bg-base-300 lg:block" />

          <div className="flex items-center gap-3 lg:min-w-56">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base-200 text-base-content/55">
              <ClockIcon />
            </div>

            <div>
              <p className="text-xs font-semibold text-base-content">
                Response Time
              </p>

              <p className="mt-1 text-xs leading-5 text-base-content/45">
                We typically reply within
                <br />
                24 hours.
              </p>
            </div>
          </div>
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

const TopicCard = ({ icon, title, description, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-base-300 bg-base-100 p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-base-300 text-base-content/35 transition group-hover:border-primary/25 group-hover:text-primary">
          →
        </span>
      </div>

      <h3 className="mt-5 font-semibold text-base-content">{title}</h3>

      <p className="mt-1.5 min-h-12 text-sm leading-6 text-base-content/50">
        {description}
      </p>
    </button>
  );
};

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="11" cy="11" r="6.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m16 16 4.5 4.5" />
  </svg>
);

const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 4.5A2.5 2.5 0 017.5 2H20v17H7.5A2.5 2.5 0 005 21.5v-17z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 18.5A2.5 2.5 0 017.5 16H20"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="12" r="8.5" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.5 12 2.2 2.2 4.8-5"
    />
  </svg>
);

const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 19V10M10 19V6M15 19v-5M20 19V3"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3.5l1.1 1.8 2.1.5.5 2.1 1.8 1.1-1.8 1.1-.5 2.1-2.1.5-1.1 1.8-1.1-1.8-2.1-.5-.5-2.1-1.8-1.1 1.8-1.1.5-2.1 2.1-.5L12 3.5z"
    />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 18.5A3.5 3.5 0 013.5 15V8.5A3.5 3.5 0 017 5h10a3.5 3.5 0 013.5 3.5V15a3.5 3.5 0 01-3.5 3.5H11l-4.5 3v-3z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="12" r="8.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
  </svg>
);

export default HelpAndSupport;
