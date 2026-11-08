const loadCalculator = () =>
  import("@/components/tools/all-calculator/body-mass-index-calculator/body-mass-index-calculator");

const createTool = (
  slug: string,
  title: string,
  description: string,
  keywords: string[],
  country: string,
  taxSystem: string
) => ({
  slug,
  title,
  description,
  keywords,
  country,
  taxSystem,
  receiveSlug: true,
  load: loadCalculator,
});

export const allBmiCalculators = {
  "body-mass-index-calculator-bmi": createTool(
    "body-mass-index-calculator-bmi",
    "Body Mass Index Calculator BMI - Instant Score Guide",
    "Use our body mass index calculator bmi to check score, category, and healthy weight range instantly. Fast and accurate health assessment tool.",
    ["body mass index calculator bmi"],
    "Global",
    "standard"
  ),

  "body-mass-index-calculator-for-female": createTool(
    "body-mass-index-calculator-for-female",
    "Body Mass Index Calculator for Female - Health Guide",
    "Try the body mass index calculator for female to track optimal health ranges, fitness metrics, and weight standards built specifically for women.",
    ["body mass index calculator for female"],
    "Global",
    "standard"
  ),

  "body-mass-index-calculator-men": createTool(
    "body-mass-index-calculator-men",
    "Body Mass Index Calculator Men - Male Health Tracker",
    "Explore the body mass index calculator men to assess body composition, muscle mass considerations, and health categories accurately today Calculator Men.",
    ["body mass index calculator men"],
    "Global",
    "standard"
  ),
};

export type BmiCalculatorSlug = keyof typeof allBmiCalculators;
