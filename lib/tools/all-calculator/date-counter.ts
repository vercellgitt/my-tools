import { dateCounterConfig } from "@/components/tools/all-calculator/date-counter/faq";

const loadDateCounterTool = () =>
  import("@/components/tools/all-calculator/date-counter/date-counter");

const createDateCounterTool = (
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
  load: loadDateCounterTool,
});

export const dateCounterTools = {
  "date-and-time-calculator": createDateCounterTool(
    "date-and-time-calculator",
    dateCounterConfig["date-and-time-calculator"].metaTitle,
    dateCounterConfig["date-and-time-calculator"].metaDescription,
    dateCounterConfig["date-and-time-calculator"].keywords
  ),
  "date-counter": createDateCounterTool(
    "date-counter",
    dateCounterConfig["date-counter"].metaTitle,
    dateCounterConfig["date-counter"].metaDescription,
    dateCounterConfig["date-counter"].keywords
  ),
  "date-duration-calculator": createDateCounterTool(
    "date-duration-calculator",
    dateCounterConfig["date-duration-calculator"].metaTitle,
    dateCounterConfig["date-duration-calculator"].metaDescription,
    dateCounterConfig["date-duration-calculator"].keywords
  ),
  "date-range-calculator": createDateCounterTool(
    "date-range-calculator",
    dateCounterConfig["date-range-calculator"].metaTitle,
    dateCounterConfig["date-range-calculator"].metaDescription,
    dateCounterConfig["date-range-calculator"].keywords
  ),
  "date-to-date-calculator": createDateCounterTool(
    "date-to-date-calculator",
    dateCounterConfig["date-to-date-calculator"].metaTitle,
    dateCounterConfig["date-to-date-calculator"].metaDescription,
    dateCounterConfig["date-to-date-calculator"].keywords
  ),
  "days-since-calculator": createDateCounterTool(
    "days-since-calculator",
    dateCounterConfig["days-since-calculator"].metaTitle,
    dateCounterConfig["days-since-calculator"].metaDescription,
    dateCounterConfig["days-since-calculator"].keywords
  ),
  "days-until-calculator": createDateCounterTool(
    "days-until-calculator",
    dateCounterConfig["days-until-calculator"].metaTitle,
    dateCounterConfig["days-until-calculator"].metaDescription,
    dateCounterConfig["days-until-calculator"].keywords
  ),
  "pregnancy-due-date-calculator": createDateCounterTool(
    "pregnancy-due-date-calculator",
    dateCounterConfig["pregnancy-due-date-calculator"].metaTitle,
    dateCounterConfig["pregnancy-due-date-calculator"].metaDescription,
    dateCounterConfig["pregnancy-due-date-calculator"].keywords
  ),
  "conception-date-calculator": createDateCounterTool(
    "conception-date-calculator",
    dateCounterConfig["conception-date-calculator"].metaTitle,
    dateCounterConfig["conception-date-calculator"].metaDescription,
    dateCounterConfig["conception-date-calculator"].keywords
  ),
  "date-and-time-countdown": createDateCounterTool(
    "date-and-time-countdown",
    dateCounterConfig["date-and-time-countdown"].metaTitle,
    dateCounterConfig["date-and-time-countdown"].metaDescription,
    dateCounterConfig["date-and-time-countdown"].keywords
  ),
  "arabic-to-gregorian-date-converter": createDateCounterTool(
    "arabic-to-gregorian-date-converter",
    dateCounterConfig["arabic-to-gregorian-date-converter"].metaTitle,
    dateCounterConfig["date-counter"].metaDescription,
    dateCounterConfig["arabic-to-gregorian-date-converter"].keywords
  ),
};

export type DateCounterSlug = keyof typeof dateCounterTools;