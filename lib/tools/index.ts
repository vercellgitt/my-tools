import { ageCalculator } from "./age-calculator";
import { emiCalculator } from "./emi-calculator";
import { imageToPdf } from "./image-to-pdf";

export const toolsRegistry = {
  "age-calculator": ageCalculator,
  "emi-calculator": emiCalculator,
  "image-to-pdf": imageToPdf,
};

// সাইটম্যাপ বা অন্যান্য জায়গায় সহজে ব্যবহারের জন্য একটি অ্যারে এক্সপোর্ট করুন
export const tools = Object.values(toolsRegistry);

export function getTool(slug: string) {
  return toolsRegistry[slug as keyof typeof toolsRegistry];
}
