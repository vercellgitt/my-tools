import { ageCalculator } from "./all-calculator/age-calculator";
import { imageToPdf } from "./image-pdf/image-to-pdf";
import { pdfToImage } from "./image-pdf/pdf-to-image";
import { allCountryTaxCalculators } from "./all-calculator/all-country-tax-rat-calculator";
import { allBmiCalculators } from "./all-calculator/body-mass-index-calculator";
import { internationalSpeedTest } from "./international-speed-test";
import { wordCountOnlineWordCounter } from "./word-count-online-word-counter";
import { whatIsMyIpAddressTools } from "./what-is-my-ip-address";
import { changePngToJpgTools } from "./change-png-to-jpg";


export const toolsRegistry = {
  "online-age-calculator-age-calculator-online": ageCalculator,
  "image-to-pdf": imageToPdf,
  "pdf-to-image": pdfToImage,
  ...allCountryTaxCalculators,
  ...allBmiCalculators,
  "international-speed-test": internationalSpeedTest,
  "word-count-online-word-counter": wordCountOnlineWordCounter,
  ...whatIsMyIpAddressTools,
  ...changePngToJpgTools,

};

// সাইটম্যাপ বা অন্যান্য জায়গায় সহজে ব্যবহারের জন্য একটি অ্যারে এক্সপোর্ট করুন
export const tools = Object.values(toolsRegistry);

export function getTool(slug: string) {
  return toolsRegistry[slug as keyof typeof toolsRegistry];
}
