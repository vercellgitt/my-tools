import { ageCalculator } from "./all-calculator/age-calculator";
import { imageToPdf } from "./image-pdf/image-to-pdf";
import { pdfToImage } from "./image-pdf/pdf-to-image";
import { internationalSpeedTest } from "./international-speed-test";
import { wordCountOnlineWordCounter } from "./word-count-online-word-counter";
import { dailyWaterIntakeCalculator } from "./daily-water-intake-calculator";
import { maintenanceCalorieCalculator } from "./all-calculator/maintenance-calorie-calculator";
import { prayerTimeForInMuslim } from "./prayer-time-for-in-muslim";
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
  "international-speed-test": internationalSpeedTest,
  "word-count-online-word-counter": wordCountOnlineWordCounter,
  "daily-water-intake-calculator": dailyWaterIntakeCalculator,
  "maintenance-calorie-calculator": maintenanceCalorieCalculator,
  "prayer-time-for-muslim-namaz-time-in": prayerTimeForInMuslim,
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
