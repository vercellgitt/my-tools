export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "How does this tool calculate total elapsed seconds between two date-time values?",
    answer:
      "It converts both date and time inputs to exact epoch timestamps and computes the difference in milliseconds before converting to seconds, minutes, hours, and days.",
  },
  {
    question: "What happens if the end date and time is earlier than the start date and time?",
    answer:
      "The calculator notes that the end timestamp precedes the start timestamp and displays the positive elapsed span between the two points.",
  },
];