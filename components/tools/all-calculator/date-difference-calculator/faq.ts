export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "How does the Date Difference Calculator count weekdays and weekends?",
    answer:
      "It checks the day of the week for each calendar day in the selected span, grouping Monday through Friday as weekdays and Saturday and Sunday as weekend days.",
  },
  {
    question: "What does the 'Include end date in count' option do?",
    answer:
      "It adds one day to the span so that both the starting date and the ending date are counted inclusively, which is helpful for bookings, schedules, and multi-day events.",
  },
];