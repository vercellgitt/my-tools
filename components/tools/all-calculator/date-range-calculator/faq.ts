export interface FaqItem {
  question: string;
  answer: string;
}

export const dateRangeFaqs: FaqItem[] = [
  {
    question: "How does a Date Range Calculator break down days, weekends, and holidays?",
    answer:
      "A Date Range Calculator evaluates every day inside your chosen start-to-end boundary so you can see both calendar totals and working-day counts. It separates weekdays (Monday through Friday), Saturdays, and Sundays, then subtracts any custom holiday dates you add so business days reflect actual working days rather than raw weekdays alone. In addition, it groups the selected range month by month, giving you a clear monthly breakdown of days and working days for project schedules, billing periods, or academic calendars.",
  },
  {
    question: "Why should I customize start and end date inclusion in a date range?",
    answer:
      "Different planning contexts treat range endpoints differently. If you are booking a three-day conference from May 10 to May 12 inclusive, every one of those three dates counts as an event day. Conversely, if you measure elapsed days between two milestones, excluding one endpoint avoids double-counting boundaries. Toggling start-date or end-date inclusion in this Date Range Calculator updates total days, complete weeks, remaining days, and business days immediately.",
  },
  {
    question: "Can this Date Range Calculator handle multi-month spans and leap years accurately?",
    answer:
      "Yes, this Date Range Calculator constructs dates locally from year, month, and day components and iterates cleanly across month and year boundaries, including February 29 during leap years. Whether your range spans two weeks or eighteen months, you get complete years, complete months, total weeks, remaining days, and a per-month summary table that updates automatically as you change dates or holiday entries.",
  },
];