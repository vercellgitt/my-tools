export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Does the Body Mass Index Calculator for Female use a different formula than for men?",
    answer:
      "No. Adult BMI uses the same formula—weight in kilograms divided by height in meters squared—and the same standard adult BMI categories for both women and men aged 20 and older.",
  },
  {
    question: "What is the healthy adult BMI range?",
    answer:
      "The standard healthy adult BMI range is 18.5 to 24.9. However, BMI is a screening tool rather than a medical diagnosis and does not directly measure body fat percentage or overall health.",
  },
  {
    question: "Can adult BMI categories be used for girls or teenagers?",
    answer:
      "No. Children and adolescents under age 20 should be evaluated using age- and sex-specific BMI percentiles rather than fixed adult cutoffs.",
  },
];