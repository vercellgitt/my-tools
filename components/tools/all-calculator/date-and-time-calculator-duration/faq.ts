export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "How does the Date and Time Calculator Duration handle end times earlier than start times?",
    answer:
      "If the selected end date and time occurs before the start date and time, the calculator displays a clear validation message rather than showing a negative duration.",
  },
  {
    question: "Why are calendar months not converted to fixed day counts here?",
    answer:
      "Calendar months vary from 28 to 31 days and years vary between 365 and 366 days, so calendar breakdowns follow actual dates while total hours, minutes, and seconds reflect exact elapsed time.",
  },
];