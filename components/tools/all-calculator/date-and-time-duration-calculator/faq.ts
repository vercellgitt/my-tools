// Add this calculator's FAQ data here. Distribute primary-keyword terms naturally across relevant questions and answers.
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "How does the Date and Time Duration Calculator update results?",
    answer:
      "Results update automatically whenever you change the start date, start time, end date, or end time, showing total days, hours, minutes, and seconds along with a readable breakdown.",
  },
  {
    question: "What happens if the end time is before the start time?",
    answer:
      "The calculator alerts you that the end date and time precedes the start date and time so you can adjust either input.",
  },
];