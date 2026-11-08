export const dailyWaterIntakeCalculator = {
  slug: "daily-water-intake-calculator",
  title: "Daily Water Intake Calculator: Your Precise Hydration Needs",
  description: "Use our daily water intake calculator to find your optimal fluid requirement based on age, weight, gender, climate, and daily calculate activity level instantly",
  load: () =>
    import("@/components/tools/daily-water-intake-calculator/daily-water-intake-calculator"),
};