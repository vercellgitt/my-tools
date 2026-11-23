export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "What is the percent to change formula?",
    answer:
      "Percentage Change = ((New Value - Original Value) / Original Value) × 100.",
  },
  {
    question: "Why is percentage change undefined when the original value is zero?",
    answer:
      "Because the original value sits in the denominator, dividing by zero has no defined numerical result in standard arithmetic.",
  },
];