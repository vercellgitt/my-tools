export interface FaqItem {
  question: string;
  answer: string;
}

export const calculatingDensityFormulaFaqs: FaqItem[] = [
  {
    question: "What is the standard calculating density formula used in physics and chemistry?",
    answer:
      "The standard calculating density formula defines density as mass divided by volume, commonly written as Density = Mass / Volume or ρ = m / V. Mass measures the amount of matter in an object, while volume measures how much three-dimensional space that matter occupies. When applying the calculating density formula, consistency of units is critical: in the International System of Units, mass is expressed in kilograms and volume in cubic meters, yielding kilograms per cubic meter. In laboratory work, grams and cubic centimeters or milliliters are frequently paired because pure water has a density close to 1 g/cm³ or 1 g/mL near room temperature.",
  },
  {
    question: "How do you convert density between metric and imperial units?",
    answer:
      "Converting density requires adjusting both the mass unit and the volume unit at the same time. For example, 1 gram per cubic centimeter equals 1,000 kilograms per cubic meter because there are 1,000 grams in a kilogram and 1,000,000 cubic centimeters in a cubic meter. Moving to imperial units, 1 pound per cubic foot equals approximately 16.0185 kilograms per cubic meter. Rather than memorizing multiple conversion multipliers, this calculating density formula tool converts your inputs to standard base units automatically and displays equivalent density values in kg/m³, g/cm³, g/mL, and lb/ft³ simultaneously.",
  },
  {
    question: "Why can two objects of the same size have completely different densities?",
    answer:
      "Two objects can share the exact same volume yet differ dramatically in density because of the atomic weight of their constituent elements and how tightly those atoms or molecules are packed. A block of lead and a block of oak wood of identical dimensions occupy the same space, but lead atoms are heavier and more closely packed, giving lead a much higher mass per unit volume. By entering each object's mass and volume into this calculating density formula calculator, you can compare material compactness quickly for engineering selection, buoyancy checks, or science coursework.",
  },
];