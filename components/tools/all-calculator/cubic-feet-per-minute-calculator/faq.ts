export interface FaqItem {
  question: string;
  answer: string;
}

export const cubicFeetPerMinuteFaqs: FaqItem[] = [
  {
    question: "How does a Cubic Feet Per Minute Calculator use room volume and ACH?",
    answer:
      "When sizing ventilation for a room, a Cubic Feet Per Minute Calculator first multiplies room length, width, and height to find room volume in cubic feet. Air changes per hour (ACH) indicates how many times the entire volume of air in that space is replaced each hour. Because CFM measures airflow per minute rather than per hour, the formula multiplies room volume by ACH and divides by sixty: CFM = (Room Volume × ACH) / 60. This gives a straightforward baseline airflow rate for exhaust fans, fresh-air makeup systems, and ventilation planning.",
  },
  {
    question: "How is CFM calculated from air velocity and duct dimensions?",
    answer:
      "In ducted HVAC systems, airflow equals air velocity multiplied by the cross-sectional area of the duct, provided both use consistent feet and minute units: CFM = Velocity (ft/min) × Area (ft²). For a round duct, cross-sectional area is π × (diameter / 2)², whereas for a rectangular duct it is width × height. If your velocity is measured in feet per second or meters per second, or your duct dimensions are in inches or centimeters, this Cubic Feet Per Minute Calculator converts all measurements into feet and minutes automatically before computing CFM.",
  },
  {
    question: "How do CFM, m³/h, L/s, and m³/s relate in airflow conversions?",
    answer:
      "International HVAC specifications often use cubic meters per hour or liters per second rather than cubic feet per minute. One cubic foot equals approximately 0.02831685 cubic meters or 28.31685 liters. Consequently, 1 CFM equals about 1.69901 m³/h, roughly 0.471947 L/s, and about 0.000471947 m³/s. Converting between these units allows engineers and technicians to read equipment datasheets across different regional standards without manual multiplication errors.",
  },
];