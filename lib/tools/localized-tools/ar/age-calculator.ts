
import { arabicAgeCalculatorFaqs } from
  "@/components/localized-tools/ar/age-calculator/faq";

export const arabicAgeCalculator = {
  title: "حاسبة العمر",

  description:
    "استخدم حاسبة العمر المجانية لمعرفة عمرك بدقة بالسنوات والأشهر والأيام والساعات والدقائق والثواني، واحسب عمرك في أي تاريخ واكتشف موعد عيد ميلادك القادم.",

  isFree: true,

  seoConfig: {
    metaTitle:
      "حاسبة العمر – احسب عمرك بدقة بالسنوات والأشهر والأيام",

    metaDescription:
      "استخدم حاسبة العمر المجانية لمعرفة عمرك بدقة بالسنوات والأشهر والأيام والساعات والدقائق والثواني، واحسب عمرك في أي تاريخ واكتشف موعد عيد ميلادك القادم.",

    keywords: [
      "حاسبة العمر",
      "حساب العمر",
      "حساب عمري",
      "كم عمري",
      "حاسبة العمر بالهجري",
      "حاسبة العمر ميلادي",
      "حاسبة العمر هجري",
      "حساب العمر بالسنوات والأشهر والأيام",
      "حساب تاريخ الميلاد",
      "العمر بالأيام",
      "Age Calculator",
      "Calculate Age",
    ],

    h1Title: "حاسبة العمر – احسب عمرك بالسنوات والأشهر والأيام",

    faqs: arabicAgeCalculatorFaqs,
  },

  load: () =>
    import(
      "@/components/localized-tools/ar/age-calculator"
    ),
};
