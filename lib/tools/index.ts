import { ageCalculator } from "./age-calculator";
import { emiCalculator } from "./emi-calculator";
import { imageToPdf } from "./image-to-pdf";



// নতুন টুল যোগ করলে এখানে import করবে:
// import { bmiCalculator } from "./bmi-calculator";

export const toolsRegistry = {
"age-calculator": ageCalculator,
"emi-calculator": emiCalculator,
"image-to-pdf": imageToPdf,



// "bmi-calculator": bmiCalculator,
};

export function getTool(slug: string) {
return toolsRegistry[slug as keyof typeof toolsRegistry];
}