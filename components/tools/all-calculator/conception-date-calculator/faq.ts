export interface FaqItem {
  question: string;
  answer: string;
}

export const conceptionDateFaqs: FaqItem[] = [
  {
    question: "How does a Conception Date Calculator estimate when conception happened?",
    answer:
      "A Conception Date Calculator estimates when conception likely occurred by working backward or forward from standard reproductive timing. In a typical 28-day menstrual cycle, ovulation happens roughly 14 days before the next expected period, and because sperm can survive for up to five days while an egg remains viable for about 24 hours, conception usually takes place around ovulation. When you enter your last menstrual period, expected due date, or current pregnancy weeks, this Conception Date Calculator applies cycle-length adjustments to estimate your likely conception date, fertile window, and full 40-week pregnancy timeline.",
  },
  {
    question: "Why is a calculated conception date only an estimate rather than an exact date?",
    answer:
      "Even when periods seem regular, ovulation timing can vary from cycle to cycle due to stress, travel, illness, hormonal shifts, or individual biology. Additionally, fertilization can happen on the day of ovulation or within the day immediately following it, and early ultrasound measurements provide dating ranges rather than single-day precision. For these reasons, any Conception Date Calculator provides educational estimates. A healthcare provider or OB/GYN can offer personalized guidance and confirm gestational age using clinical exams and early ultrasound imaging.",
  },
  {
    question: "How does cycle length affect the estimated fertile window and due date?",
    answer:
      "Standard pregnancy charts often assume a 28-day cycle with ovulation on day 14, but many people have shorter or longer cycles. If your cycle is 32 days instead of 28, ovulation generally occurs later in the cycle—around day 18—which shifts both your fertile window and estimated conception date later. Adjusting your average menstrual cycle length in this Conception Date Calculator accounts for that shift so your estimated ovulation window, conception date, and due date align more closely with your cycle pattern.",
  },
];