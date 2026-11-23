export const bodyMassIndexCalculatorBmi = {
  slug: "body-mass-index-calculator-bmi",
  title: "Body Mass Index Calculator BMI – Calculate Your BMI",
  description:
  "Calculate your body mass index using height and weight, check your BMI score and category, and find your healthy weight range with this free online calculator.",
  load: () =>
    import(
      "@/components/tools/all-calculator/body-mass-index-calculator-bmi/body-mass-index-calculator-bmi"
    ),
};