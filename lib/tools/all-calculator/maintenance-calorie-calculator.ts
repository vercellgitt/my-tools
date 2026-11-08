export const maintenanceCalorieCalculator = {
  slug: "maintenance-calorie-calculator",
  title: "Maintenance Calorie Calculator Find My Estimated Calories",
  description: "Maintenance calorie calculator is: calculate calories for maintenance, find and figure out estimated body needs, determining what my maintenance calories are.",
  load: () =>
    import(
      "@/components/tools/all-calculator/maintenance-calorie-calculator/maintenance-calorie-calculator"
    ),
};