export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "What is the percent of difference formula?",
    answer:
      "The percent of difference formula is ((|A - B|) / ((A + B) / 2)) × 100, where A and B are the two values being compared.",
  },
  {
    question: "Can the percent of difference formula handle negative numbers?",
    answer:
      "Yes, as long as the average ((A + B) / 2) is not equal to zero. The absolute difference |A - B| keeps the numerator positive.",
  },
  {
    question: "Why does the calculator show a message when the average is zero?",
    answer:
      "Dividing by zero is mathematically undefined, so displaying a clear validation message avoids misleading NaN or Infinity outputs.",
  },
];