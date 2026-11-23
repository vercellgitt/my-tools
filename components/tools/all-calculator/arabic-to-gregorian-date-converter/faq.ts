// Add this calculator's FAQ data here. Distribute primary-keyword terms naturally across relevant questions and answers.
export interface FaqItem {
  question: string;
  answer: string;
}

export const arabicToGregorianFaqs: FaqItem[] = [
  {
    question: "How does an Arabic to Gregorian Date Converter translate Hijri dates?",
    answer:
      "An Arabic to Gregorian Date Converter maps dates between the lunar Islamic Hijri calendar and the solar Gregorian calendar. Because a lunar Hijri year consists of twelve lunar months averaging roughly 354 or 355 days—about ten to eleven days shorter than a Gregorian solar year—Hijri dates shift earlier through the Gregorian seasons over time. This converter uses standard arithmetic calendar conversion formulas to transform a Hijri year, month, and day into its corresponding Gregorian date, while also supporting reverse conversion from a Gregorian date back to Hijri.",
  },
  {
    question: "Why can actual Hijri dates vary by a day or two depending on moon sighting?",
    answer:
      "In real-world observance, the start of each Hijri month—especially significant months like Ramadan, Shawwal, and Dhu al-Hijjah—can depend on local crescent moon sighting or regional astronomical and administrative conventions. Because tabular or algorithmic conversions follow mathematical rules rather than live local sighting reports, the actual observed date in a given city or country may differ by one day. That is why any Arabic to Gregorian Date Converter should be treated as a reliable reference rather than a sole religious or official sighting authority.",
  },
  {
    question: "What are the twelve months of the Hijri calendar?",
    answer:
      "The Islamic Hijri calendar comprises twelve lunar months in a fixed sequence: Muharram, Safar, Rabi al-Awwal, Rabi al-Thani, Jumada al-Awwal, Jumada al-Thani, Rajab, Sha'ban, Ramadan, Shawwal, Dhu al-Qi'dah, and Dhu al-Hijjah. Odd-numbered months traditionally have thirty days and even-numbered months have twenty-nine days in tabular reckoning, with an extra day added to Dhu al-Hijjah in leap years of the thirty-year cycle. Both English transliterations and Arabic month names are displayed for clarity.",
  },
];