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
  "body-mass-index-calculator": createTool(
    "body-mass-index-calculator",
    "Body Mass Index Calculator - Calculate Your BMI Online",
    "Calculate your Body Mass Index (BMI) accurately with our free online calculator. Find body composition metrics, weight status, and healthy target ranges.",
    ["body mass index calculator"],
    "Global",
    "standard"
  ),

  "body-mass-index-calculator-bmi": createTool(
    "body-mass-index-calculator-bmi",
    "Body Mass Index Calculator BMI - Instant BMI Category Results",
    "Use our Body Mass Index Calculator BMI to check your score, category, healthy weight range, and body metric insights in real time.",
    ["body mass index calculator bmi"],
    "Global",
    "standard"
  ),

  "body-mass-index-calculator-for-female": createTool(
    "body-mass-index-calculator-for-female",
    "Body Mass Index Calculator for Female - Health & Weight Range",
    "Female body mass index calculator to track optimal health ranges, standard WHO weight thresholds, and fitness metrics for women.",
    ["body mass index calculator for female"],
    "Global",
    "standard"
  ),

  "body-mass-index-calculator-men": createTool(
    "body-mass-index-calculator-men",
    "Body Mass Index Calculator Men - Fitness & Weight Range",
    "Accurate Body Mass Index Calculator for Men. Assess body composition, health categories, and muscle mass considerations.",
    ["body mass index calculator men"],
    "Global",
    "standard"
  ),

  "body-mass-index-calculator-women": createTool(
    "body-mass-index-calculator-women",
    "Body Mass Index Calculator Women - Healthy Weight Guide",
    "Calculate women's body mass index easily. Determine standard health ranges, weight categories, and target goals.",
    ["body mass index calculator women"],
    "Global",
    "standard"
  ),

  "adult-body-mass-index-calculator": createTool(
    "adult-body-mass-index-calculator",
    "Adult Body Mass Index Calculator - Age 20+ Health Metrics",
    "Standard adult body mass index calculator for adults aged 20 and over. Monitor healthy target weights based on WHO scales.",
    ["adult body mass index calculator"],
    "Global",
    "standard"
  ),

  "body-mass-index-calculator-for-adults": createTool(
    "body-mass-index-calculator-for-adults",
    "Body Mass Index Calculator for Adults - Free Online Health Tool",
    "Online adult BMI tool supporting metric and imperial inputs to estimate healthy body mass and weight targets.",
    ["body mass index calculator for adults"],
    "Global",
    "standard"
  ),

  "men-body-mass-index-calculator": createTool(
    "men-body-mass-index-calculator",
    "Men Body Mass Index Calculator - Fast Male Health Screening",
    "Body mass index calculator built for men. Evaluate weight status, healthy targets, and body mass index ratings.",
    ["men body mass index calculator"],
    "Global",
    "standard"
  ),

  "body-mass-index-calculator-in-kg": createTool(
    "body-mass-index-calculator-in-kg",
    "Body Mass Index Calculator in KG - Metric Unit BMI",
    "Calculate your BMI using body weight in kilograms (kg) and height in centimeters or meters.",
    ["body mass index calculator in kg"],
    "Global",
    "standard"
  ),

  "body-mass-index-calculator-kg": createTool(
    "body-mass-index-calculator-kg",
    "Body Mass Index Calculator KG - Standard Metric Tool",
    "Metric body mass index calculator operating with kilograms and centimeters for accurate health screening.",
    ["body mass index calculator kg"],
    "Global",
    "standard"
  ),

  "bmi-body-mass-index-calculator-online": createTool(
    "bmi-body-mass-index-calculator-online",
    "BMI Body Mass Index Calculator Online - Free Health Assessment",
    "Instant online body mass index calculator. Evaluate healthy weight, BMI Prime, and Ponderal Index online.",
    ["bmi body mass index calculator online"],
    "Global",
    "standard"
  ),

  "formula-body-mass-index-calculator": createTool(
    "formula-body-mass-index-calculator",
    "Formula Body Mass Index Calculator - Standard BMI Equation",
    "Learn and apply the mathematical formula for calculating body mass index in metric and imperial units.",
    ["formula body mass index calculator"],
    "Global",
    "standard"
  ),

  "body-mass-index-calculator-kg-cm": createTool(
    "body-mass-index-calculator-kg-cm",
    "Body Mass Index Calculator KG CM - Direct Metric Calculations",
    "Calculate body mass index using weight in kg and height in cm. Fast, simple, and accurate metric calculation.",
    ["body mass index calculator kg cm"],
    "Global",
    "standard"
  ),

  "body-mass-index-calculator-uk": createTool(
    "body-mass-index-calculator-uk",
    "Body Mass Index Calculator UK - NHS & WHO Health Standards",
    "UK body mass index calculator supporting metric and imperial measurements for health assessment.",
    ["body mass index calculator uk"],
    "United Kingdom",
    "uk_standard"
  ),
};

export type BmiCalculatorSlug = keyof typeof allBmiCalculators;