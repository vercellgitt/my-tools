
import { deAgeCalculatorFaqs } from "@/components/localized-tools/de/age-calculator/faq";

export const deAgeCalculator = {
  slug: "altersrechner",
  title: "Altersrechner",
  description: "Mit dem Altersrechner kannst du dein Alter in Jahren, Monaten, Tagen, Stunden, Minuten und Sekunden berechnen. Finde heraus, wie alt du bist und wann dein nächster Geburtstag ist.",
  isFree: true,
  seoConfig: {
    metaTitle: "Altersrechner – Wie alt bin ich? Alter berechnen Beste 1",
    metaDescription: "Mit dem Altersrechner kannst du dein Alter genau berechnen. Finde heraus, wie alt du bist – in Jahren, Monaten und Tagen. Kostenlos online.",
    keywords: [
      "Altersrechner",
      "alte rechner",
      "Alter berechnen",
      "Wie alt bin ich",
      "Berechnung Alter",
      "Wie alt bin ich Rechner",
      "Alter in Jahren Monaten Tagen",
      "Geburtsdatum Rechner"
    ],
    h1Title: "Altersrechner – Wie alt bin ich? Alter genau berechnen",
    faqs: deAgeCalculatorFaqs,
  },
  load: () => import("@/components/localized-tools/de/age-calculator"),
};
