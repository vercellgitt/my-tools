export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "How do I use the Cubic Feet to Cubic Yard Calculator?",
    answer:
      "Choose your conversion direction, enter a non-negative volume number, and read the converted result immediately. You can also inspect equivalent volumes in cubic inches, cubic meters, and liters or copy the result with one click.",
  },
  {
    question: "How many cubic feet are in one cubic yard?",
    answer:
      "There are 27 cubic feet in 1 cubic yard because a cube measuring 1 yard by 1 yard by 1 yard equals 3 feet × 3 feet × 3 feet.",
  },
  {
    question: "When should I convert cubic feet to cubic yards?",
    answer:
      "Suppliers of landscaping gravel, mulch, topsoil, compost, and ready-mix concrete frequently quote bulk prices per cubic yard, while project dimensions or bagged materials are often measured in cubic feet.",
  },
];