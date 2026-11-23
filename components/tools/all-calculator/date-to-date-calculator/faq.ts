export interface FaqItem {
  question: string;
  answer: string;
}

export const dateToDateFaqs: FaqItem[] = [
  {
    question: "How does a Date to Date Calculator handle leap years and timezone shifts?",
    answer:
      "A Date to Date Calculator that builds local calendar dates from explicit year, month, and day values avoids daylight-saving or UTC midnight drift that can occasionally turn a full day into 23 or 25 hours. By counting calendar days between local dates, February 29 in a leap year is included naturally whenever it sits between your first and second dates. Whether you are comparing past dates, looking ahead to future milestones, or swapping start and end dates, local calendar arithmetic keeps total days and full years or months consistent.",
  },
  {
    question: "What is the difference between total days, weekdays, and business days?",
    answer:
      "Total days counts every calendar day across your selected span, while complete weeks divides those days into seven-day blocks plus any remaining days. Weekdays and business days both refer to Monday through Friday, whereas weekend days count Saturdays and Sundays. Depending on whether you choose to include the start date or end date, the boundary counts adjust by one day. This Date to Date Calculator shows all of these figures side by side so you can plan schedules, notice periods, or project timelines clearly.",
  },
  {
    question: "When should I use the Swap Dates or Today shortcut controls?",
    answer:
      "The Today shortcut sets a date field immediately to your current local date, which is helpful when checking how many days remain until a future deadline or how long ago a past event started. If you enter two dates in reverse order—such as placing a later date in the first box—the Swap Dates button puts them in chronological order with one click, though the calculator also handles reverse order gracefully without errors.",
  },
];