export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "How do you calculate percentage of difference between two numbers?",
    answer:
      "Subtract the two numbers, take the absolute value of that difference, divide it by the average of the two numbers, and multiply by 100.",
  },
  {
    question: "Why does percentage difference divide by the average instead of one value?",
    answer:
      "Dividing by the average treats both numbers equally without assuming one of them is the original or true reference value.",
  },
  {
    question: "What happens if both inputs are zero?",
    answer:
      "When both values are zero, their average is zero, so dividing by the average is undefined rather than producing a finite percentage.",
  },
];