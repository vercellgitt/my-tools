import { ageCalculator } from "./all-calculator/age-calculator";
import { imageToPdf } from "./image-pdf/image-to-pdf";
import { pdfToImage } from "./image-pdf/pdf-to-image";
import { internationalSpeedTest } from "./all-etc-tools/international-speed-test";
import { wordCountOnlineWordCounter } from "./all-etc-tools/word-count-online-word-counter";
import { dailyWaterIntakeCalculator } from "./all-calculator/daily-water-intake-calculator";
import { maintenanceCalorieCalculator } from "./all-calculator/maintenance-calorie-calculator";
import { prayerTimeForInMuslim } from "./all-etc-tools/prayer-time-for-in-muslim";
import { saleDiscountTaxCalculator } from "./all-calculator/sale-discount-tax-calculator";
import { wordToPdf } from "./image-pdf/word-to-pdf";
import { whatIsMyIpAddress } from "./all-etc-tools/what-is-my-ip-no";
import { formatPngToJpg } from "./image-pdf/format-png-to-jpg";
import { photoImageResizer } from "./image-pdf/photo-image-resizer";
import { letterCaseConverter } from "./all-etc-tools/letter-case-converter";
import { bodyMassIndexCalculatorBmi } from "./all-calculator/body-mass-index-calculator-bmi";

// All Calculator 👇
import { volumeDensityMassCalculator } from "./all-calculator/volume-density-mass-calculator";
import { calculatingDensityFormula } from "./all-calculator/calculating-density-formula";
import { conceptionDateCalculator } from "./all-calculator/conception-date-calculator";
import { daysUntilCalculator } from "./all-calculator/days-until-calculator";
import { pregnancyDueDateCalculator } from "./all-calculator/pregnancy-due-date-calculator";
import { cubicFeetPerMinuteCalculator } from "./all-calculator/cubic-feet-per-minute-calculator";
import { calculateCubicFeet } from "./all-calculator/calculate-cubic-feet";
import { dateDurationCalculator } from "./all-calculator/date-duration-calculator";
import { arabicToGregorianDateConverter } from "./all-calculator/arabic-to-gregorian-date-converter";
import { dateToDateCalculator } from "./all-calculator/date-to-date-calculator";
import { dateRangeCalculator } from "./all-calculator/date-range-calculator";
import { cubicFeetToCubicYard } from "./all-calculator/cubic-feet-to-cubic-yard";
import { bodyMassIndexCalculatorForFemale } from "./all-calculator/body-mass-index-calculator-for-female";
import { howToCalculatePercentageOfDifference } from "./all-calculator/how-to-calculate-percentage-of-difference";
import { percentOfDifferenceFormula } from "./all-calculator/percent-of-difference-formula";
import { dateAndTimeCalculatorDuration } from "./all-calculator/date-and-time-calculator-duration";
import { dateDifferenceCalculator } from "./all-calculator/date-difference-calculator";
import { percentToChangeFormula } from "./all-calculator/percent-to-change-formula";
import { dateAndTimeCalculatorBetweenTwoDates } from "./all-calculator/date-and-time-calculator-between-two-dates";
import { calculateTheDateBetweenTwoDates } from "./all-calculator/calculate-the-date-between-two-dates";
import { dateAndTimeDurationCalculator } from "./all-calculator/date-and-time-duration-calculator";
import { bodyMassIndexCalculatorKgCm } from "./all-calculator/body-mass-index-calculator-kg-cm";
import { ukTaxRateCalculator } from "./all-calculator/uk-tax-rate-calculator";
import { usTaxRateCalculator } from "./all-calculator/us-tax-rate-calculator";
import { canadaTaxRateCalculator } from "./all-calculator/canada-tax-rate-calculator";
import { ontarioTaxRateCalculator } from "./all-calculator/tax-rate-calculator-ontario";
import { federalTaxRateCalculator } from "./all-calculator/tax-rate-calculator-federal";
import { australiaTaxRateCalculator } from "./all-calculator/tax-rate-calculator-australia";
import { californiaTaxRateCalculator } from "./all-calculator/tax-rate-calculator-california";
import { afterTaxPaymentCalculator } from "./all-calculator/after-tax-payment-calculator";


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
  "body-mass-index-calculator-bmi": bodyMassIndexCalculatorBmi,

  // All Calculator 👇
  "volume-density-mass-calculator": volumeDensityMassCalculator,
  "calculating-density-formula": calculatingDensityFormula,
  "conception-date-calculator": conceptionDateCalculator,
  "days-until-calculator": daysUntilCalculator,
  "pregnancy-due-date-calculator": pregnancyDueDateCalculator,
  "cubic-feet-per-minute-calculator": cubicFeetPerMinuteCalculator,
  "calculate-cubic-feet": calculateCubicFeet,
  "date-duration-calculator": dateDurationCalculator,
  "arabic-to-gregorian-date-converter": arabicToGregorianDateConverter,
  "date-to-date-calculator": dateToDateCalculator,
  "date-range-calculator": dateRangeCalculator,
  "cubic-feet-to-cubic-yard": cubicFeetToCubicYard,
  "body-mass-index-calculator-for-female": bodyMassIndexCalculatorForFemale,
  "how-to-calculate-percentage-of-difference": howToCalculatePercentageOfDifference,
  "percent-of-difference-formula": percentOfDifferenceFormula,
  "date-and-time-calculator-duration": dateAndTimeCalculatorDuration,
  "date-difference-calculator": dateDifferenceCalculator,
  "percent-to-change-formula": percentToChangeFormula,
  "date-and-time-calculator-between-two-dates": dateAndTimeCalculatorBetweenTwoDates,
  "calculate-the-date-between-two-dates": calculateTheDateBetweenTwoDates,
  "date-and-time-duration-calculator": dateAndTimeDurationCalculator,
  "body-mass-index-calculator-kg-cm": bodyMassIndexCalculatorKgCm,
  "uk-tax-rate-calculator": ukTaxRateCalculator,
  "us-tax-rate-calculator": usTaxRateCalculator,
  "canada-tax-rate-calculator": canadaTaxRateCalculator,
  "tax-rate-calculator-ontario": ontarioTaxRateCalculator,
  "tax-rate-calculator-federal": federalTaxRateCalculator,
  "tax-rate-calculator-australia": australiaTaxRateCalculator,
  "tax-rate-calculator-california": californiaTaxRateCalculator,
  "after-tax-payment-calculator": afterTaxPaymentCalculator

};

// সাইটম্যাপ বা অন্যান্য জায়গায় সহজে ব্যবহারের জন্য একটি অ্যারে এক্সপোর্ট করুন
export const tools = Object.values(toolsRegistry);

export function getTool(slug: string) {
  return toolsRegistry[slug as keyof typeof toolsRegistry];
}
