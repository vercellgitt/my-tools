import type { Metadata } from "next";

export const letterCaseConverterMetadata: Metadata = {
  keywords: [
    "letter case converter",
    "case converter",
    "letter case",
    "converter",
    "uppercase to lowercase",
    "title case converter",
    "sentence case tool",
  ],
  openGraph: {
    type: "website",
  },
};

export const letterCaseConverter = {
  slug: "letter-case-converter",
  title: "Letter Case Converter: Free Online Top 1 Text Case Tool",
  description:
    "Use this free online letter case converter to transform uppercase, lowercase, title case, sentence case, alternating, inverse, and small caps text instantly.",
  load: () =>
    import("@/components/tools/letter-case-converter/letter-case-converter"),
};