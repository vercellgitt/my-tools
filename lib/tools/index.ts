import ageCalculator from "./age-calculator";

export const tools = [
  ageCalculator,
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}