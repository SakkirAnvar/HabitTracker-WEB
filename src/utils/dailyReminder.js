const DAILY_REMINDERS = [
  "Small steps become big changes.",
  "Progress, not perfection.",
  "Keep showing up for yourself.",
  "Consistency builds confidence.",
  "Focus on what you can do today.",
  "A little progress is still progress.",
  "Build habits, not pressure.",
  "You don't have to do everything today.",
  "Start small. Stay consistent.",
  "Give yourself credit for showing up.",
  "Better days are built one habit at a time.",
  "Keep going, even when progress feels slow.",
  "Your future self will thank you.",
  "Make today count.",
  "One good choice can change your day.",
  "Stay patient with your progress.",
  "Consistency matters more than intensity.",
  "Take it one step at a time.",
  "You are building something better.",
  "Show up, do your best, move forward.",
  "Small actions create lasting change.",
  "Keep your focus on the next step.",
  "A better routine starts today.",
  "Progress happens through repetition.",
  "Choose consistency over perfection.",
  "Keep building better days.",
  "Your habits shape your days.",
  "Start where you are.",
  "Keep moving forward.",
  "Make space for progress.",
];

export const getDailyReminder = () => {
  const today = new Date();

  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today - startOfYear;

  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  return DAILY_REMINDERS[dayOfYear % DAILY_REMINDERS.length];
};
