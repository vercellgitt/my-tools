export interface FaqItem {
  question: string;
  answer: string;
}

export const daysUntilFaqs: FaqItem[] = [
  {
    question: "How does a Days Until Calculator handle leap years and calendar months?",
    answer:
      "A reliable Days Until Calculator uses actual calendar dates rather than assuming every month has 30 days or every year has 365 days. When counting total days between a start date and a target date, it calculates exact elapsed calendar days so February 29 during a leap year is naturally included when it falls inside your chosen span. For larger units like months and weeks, total days are divided into full weeks of seven days while month counts step cleanly through calendar month boundaries. This approach keeps countdowns for birthdays, holidays, vacations, and project deadlines accurate across multi-year spans.",
  },
  {
    question: "What happens when I enter a target date that has already passed?",
    answer:
      "If you select a target date and time earlier than your starting point, this Days Until Calculator automatically detects that the date is in the past rather than leaving you confused by a negative number. It clearly flags that the event has already occurred and displays how many days, weeks, months, hours, minutes, and seconds have passed since that date. That makes the tool useful both for anticipating upcoming milestones and for checking how long ago a past anniversary, release date, or historical milestone took place.",
  },
  {
    question: "How does the live countdown work when a target time is selected?",
    answer:
      "When you provide a target time alongside your target date, the Days Until Calculator compares your starting date and time against the exact target timestamp and refreshes every second while the page is open. You can watch remaining hours, minutes, and seconds tick down in real time as an event approaches. If you leave the target time blank, the calculator compares calendar dates at midnight so you can focus cleanly on remaining days, weeks, and months until your chosen holiday, birthday, or custom event.",
  },
];