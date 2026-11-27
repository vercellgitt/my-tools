import { esAgeCalculatorFaqs } from "@/components/localized-tools/es/age-calculator/faq";

export const esAgeCalculator = {
  slug: "calculadora-de-edad",
  title: "Calculadora de edad",
  description: "Utiliza la calculadora de edad gratis para conocer tu edad en años, meses, días, horas, minutos y segundos. Calcula tu edad en cualquier fecha y descubre cuándo será tu próximo cumpleaños.",
  isFree: true,
  seoConfig: {
    metaTitle: "Calculadora de edad – Calcula tu edad con precisión | Age Calculator",
    metaDescription: "Utiliza la calculadora de edad gratis para conocer tu edad en años, meses, días, horas, minutos y segundos. Calcula tu edad en cualquier fecha y descubre cuándo será tu próximo cumpleaños.",
    keywords: ["calculadora de edad", "calcular edad", "cuántos años tengo", "edad en años meses días", "calcular fecha de nacimiento", "Age Calculator"],
    h1Title: "Calculadora de edad: calcula tu edad en años, meses y días",
    faqs: esAgeCalculatorFaqs,
  },
  load: () => import("@/components/localized-tools/es/age-calculator"),
};