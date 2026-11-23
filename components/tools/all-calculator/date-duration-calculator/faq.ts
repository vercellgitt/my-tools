export interface FaqItem {
  question: string;
  answer: string;
}

export const dateDurationFaqs: FaqItem[] = [
  {
    question: "How does a Date Duration Calculator compute years, months, weeks, and days?",
    answer:
      "A Date Duration Calculator breaks down the interval between a start date and an end date into calendar components so you can read both exact calendar years and months alongside total running days and weeks. First, it advances complete calendar years, then complete calendar months without overrunning month lengths, and finally counts the remaining days. In parallel, it reports total days, complete weeks, and—when date-and-time mode is active—exact hours, minutes, and seconds between your start and end timestamps.",
  },
  {
    question: "What is the difference between including and excluding the end date?",
    answer:
      "When measuring elapsed time between two points, subtracting start from end gives the day difference—for instance, from Monday to Wednesday is two days of elapsed span. However, when scheduling bookings, rentals, shifts, or project windows, people often count the end date itself as an active day, which adds one day to the inclusive count. Toggle the end-date option in this Date Duration Calculator depending on whether your workflow counts inclusive calendar days or strict elapsed intervals.",
  },
  {
    question: "How are business days and weekend days calculated across date ranges?",
    answer:
      "Business days typically refer to Monday through Friday, whereas Saturdays and Sundays are counted as weekend days. This Date Duration Calculator steps through each calendar day across your selected range—respecting end-date inclusion—and tallies weekdays separately from weekend days. That makes it straightforward to estimate working days for sprints, deliveries, or billing cycles, while still keeping leap-year calendar days accurate.",
  },
];