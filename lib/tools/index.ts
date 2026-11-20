import { ageCalculator } from "./all-calculator/age-calculator";
import { imageToPdf } from "./image-pdf/image-to-pdf";
import { pdfToImage } from "./image-pdf/pdf-to-image";
import { allBmiCalculators } from "./all-calculator/body-mass-index-calculator";
import { internationalSpeedTest } from "./international-speed-test";
import { wordCountOnlineWordCounter } from "./word-count-online-word-counter";
import { dailyWaterIntakeCalculator } from "./daily-water-intake-calculator";
import { percentFormulaTools } from "./all-calculator/percent-of-difference-formula";
import { dateAndTimeDurationCalculatorTools } from "./all-calculator/date-and-time-duration-calculator";
import { maintenanceCalorieCalculator } from "./all-calculator/maintenance-calorie-calculator";
import { cubicFeetTools } from "./all-calculator/calculate-cubic-feet";
import { dateCounterTools } from "./all-calculator/date-counter";
import { prayerTimeForInMuslim } from "./prayer-time-for-in-muslim";
import { densityCalculatorTools } from "./all-calculator/formula-to-find-density";
import { saleDiscountTaxCalculator } from "./all-calculator/sale-discount-tax-calculator";
import { wordToPdf } from "./image-pdf/word-to-pdf";
import { whatIsMyIpAddress } from "./what-is-my-ip-no";
import { formatPngToJpg } from "./image-pdf/format-png-to-jpg";
import { photoImageResizer } from "./image-pdf/photo-image-resizer";
import { letterCaseConverter } from "./letter-case-converter";

export const toolsRegistry = {
  "online-age-calculator-age-calculator-online": ageCalculator,
  "image-to-pdf": imageToPdf,
  "pdf-to-image": pdfToImage,
  ...allBmiCalculators,
  "international-speed-test": internationalSpeedTest,
  "word-count-online-word-counter": wordCountOnlineWordCounter,
  "daily-water-intake-calculator": dailyWaterIntakeCalculator,
  ...percentFormulaTools,
  ...dateAndTimeDurationCalculatorTools,
  "maintenance-calorie-calculator": maintenanceCalorieCalculator,
  ...cubicFeetTools,
  ...dateCounterTools,
  "prayer-time-for-muslim-namaz-time-in": prayerTimeForInMuslim,
  ...densityCalculatorTools,
  "sale-discount-value-calculator-with-tax-percentage": saleDiscountTaxCalculator,
  "word-to-pdf-transfer-from-conversion-word-to-pdf": wordToPdf,
  "what-is-my-ip-no": whatIsMyIpAddress,
  "format-png-to-jpg": formatPngToJpg,
  "photo-image-resizer": photoImageResizer,
  "letter-case-converter": letterCaseConverter,
};

// সাইটম্যাপ বা অন্যান্য জায়গায় সহজে ব্যবহারের জন্য একটি অ্যারে এক্সপোর্ট করুন
export const tools = Object.values(toolsRegistry);

export function getTool(slug: string) {
  return toolsRegistry[slug as keyof typeof toolsRegistry];
}
