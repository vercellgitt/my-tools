export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "How does Calculate the Date Between Two Dates find the midpoint?",
    answer:
      "It computes the total elapsed span between the earlier and later date, finds the exact halfway point in time (50%), and shows the midpoint date, weekday, distance from each endpoint, and 25% and 75% milestones.",
  },
  {
    question: "What happens if I enter the second date earlier than the first date?",
    answer:
      "The calculator automatically orders the two dates chronologically from earlier to later and notifies you so you still get the exact midpoint date.",
  },
];