import { caseConverterConfig } from "@/components/tools/case-converter/faq";

const loadCaseConverterTool = () =>
  import("@/components/tools/case-converter/case-converter");

const createCaseConverterTool = (
  slug: string,
  title: string,
  description: string,
  keywords: string[]
) => ({
  slug,
  title,
  description,
  keywords,
  receiveSlug: true,
  load: loadCaseConverterTool,
});

export const caseConverterTools = {
  "case-converter": createCaseConverterTool(
    "case-converter",
    caseConverterConfig["case-converter"].metaTitle,
    caseConverterConfig["case-converter"].metaDescription,
    caseConverterConfig["case-converter"].keywords
  ),
  "lower-case-to-upper-case": createCaseConverterTool(
    "lower-case-to-upper-case",
    caseConverterConfig["lower-case-to-upper-case"].metaTitle,
    caseConverterConfig["lower-case-to-upper-case"].metaDescription,
    caseConverterConfig["lower-case-to-upper-case"].keywords
  ),
  "upper-case-to-lower-case-converter": createCaseConverterTool(
    "upper-case-to-lower-case-converter",
    caseConverterConfig["upper-case-to-lower-case-converter"].metaTitle,
    caseConverterConfig["upper-case-to-lower-case-converter"].metaDescription,
    caseConverterConfig["upper-case-to-lower-case-converter"].keywords
  ),
  "title-case-converter": createCaseConverterTool(
    "title-case-converter",
    caseConverterConfig["title-case-converter"].metaTitle,
    caseConverterConfig["title-case-converter"].metaDescription,
    caseConverterConfig["title-case-converter"].keywords
  ),
  "all-caps-converter": createCaseConverterTool(
    "all-caps-converter",
    caseConverterConfig["all-caps-converter"].metaTitle,
    caseConverterConfig["all-caps-converter"].metaDescription,
    caseConverterConfig["all-caps-converter"].keywords
  ),
  "text-capitalization": createCaseConverterTool(
    "text-capitalization",
    caseConverterConfig["text-capitalization"].metaTitle,
    caseConverterConfig["text-capitalization"].metaDescription,
    caseConverterConfig["text-capitalization"].keywords
  ),
  "lowercase-online": createCaseConverterTool(
    "lowercase-online",
    caseConverterConfig["lowercase-online"].metaTitle,
    caseConverterConfig["lowercase-online"].metaDescription,
    caseConverterConfig["lowercase-online"].keywords
  ),
  "uppercase-online": createCaseConverterTool(
    "uppercase-online",
    caseConverterConfig["uppercase-online"].metaTitle,
    caseConverterConfig["uppercase-online"].metaDescription,
    caseConverterConfig["uppercase-online"].keywords
  ),
  "letter-case-converter": createCaseConverterTool(
    "letter-case-converter",
    caseConverterConfig["letter-case-converter"].metaTitle,
    caseConverterConfig["letter-case-converter"].metaDescription,
    caseConverterConfig["letter-case-converter"].keywords
  ),
};

export type CaseConverterSlug = keyof typeof caseConverterTools;