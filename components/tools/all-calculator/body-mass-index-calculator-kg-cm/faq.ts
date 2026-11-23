export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "How do I calculate BMI using kg and cm?",
    answer:
      "Divide your height in centimeters by 100 to get meters, square that meter value, and divide your weight in kilograms by the squared height: BMI = kg / (m × m).",
  },
  {
    question: "Who do the standard adult BMI categories apply to?",
    answer:
      "The standard categories—Underweight (<18.5), Normal weight (18.5–24.9), Overweight (25.0–29.9), and Obesity (30.0+)—apply to adults aged 20 and older, whereas children and teens require age- and sex-specific percentiles.",
  },
];