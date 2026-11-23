export interface FaqItem {
  question: string;
  answer: string;
}

export const pregnancyDueDateFaqs: FaqItem[] = [
  {
    question: "How does a Pregnancy Due Date Calculator determine an estimated due date?",
    answer:
      "A Pregnancy Due Date Calculator estimates your delivery date using standard 280-day (40-week) gestational timing starting from the first day of your last menstrual period, with adjustments when you know your conception date, IVF embryo transfer date, or ultrasound measurement. Because pregnancy is measured from the start of the last period rather than fertilization alone, a typical cycle adds roughly two weeks before conception occurs. When you choose IVF mode, the calculator accounts for whether a 3-day or 5-day embryo was transferred to project the 40-week mark accurately.",
  },
  {
    question: "What are the three trimesters of pregnancy and how are they divided?",
    answer:
      "Pregnancy is traditionally divided into three trimesters spanning approximately forty weeks in total. The first trimester runs from week 1 through the end of week 13 and brings early embryonic and fetal development alongside major hormonal adjustments. The second trimester spans weeks 14 through 27 and is often marked by growing energy, visible bump changes, and feeling fetal movement. The third trimester covers week 28 through delivery around week 40 as the baby matures rapidly and prepares for birth.",
  },
  {
    question: "Why should a healthcare professional confirm my pregnancy due date?",
    answer:
      "While a Pregnancy Due Date Calculator offers helpful planning dates and milestone estimates, every pregnancy and menstrual cycle is unique. Irregular cycles, late ovulation, or differences between LMP estimates and first-trimester ultrasound measurements can shift expected timing. Only a qualified medical professional or OB/GYN can evaluate your health history, perform clinical assessments or diagnostic ultrasounds, and confirm your official due date.",
  },
];