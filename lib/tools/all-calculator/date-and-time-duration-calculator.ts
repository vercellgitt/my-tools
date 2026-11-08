import { dateAndTimeToolsConfig } from "@/components/tools/all-calculator/date-and-time-duration-calculator/faq";

const loadDateAndTimeTool = () =>
  import("@/components/tools/all-calculator/date-and-time-duration-calculator/date-and-time-duration-calculator");

const createDateAndTimeTool = (
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
  load: loadDateAndTimeTool,
});

export const dateAndTimeDurationCalculatorTools = {
  "date-and-time-duration-calculator": createDateAndTimeTool(
    "date-and-time-duration-calculator",
    dateAndTimeToolsConfig["date-and-time-duration-calculator"].metaTitle,
    dateAndTimeToolsConfig["date-and-time-duration-calculator"].metaDescription,
    dateAndTimeToolsConfig["date-and-time-duration-calculator"].keywords
  ),

  "date-and-time-calculator-duration": createDateAndTimeTool(
    "date-and-time-calculator-duration",
    dateAndTimeToolsConfig["date-and-time-calculator-duration"].metaTitle,
    dateAndTimeToolsConfig["date-and-time-calculator-duration"].metaDescription,
    dateAndTimeToolsConfig["date-and-time-calculator-duration"].keywords
  ),

  "date-difference-calculator": createDateAndTimeTool(
    "date-difference-calculator",
    dateAndTimeToolsConfig["date-difference-calculator"].metaTitle,
    dateAndTimeToolsConfig["date-difference-calculator"].metaDescription,
    dateAndTimeToolsConfig["date-difference-calculator"].keywords
  ),

  "calculate-the-date-between-two-dates": createDateAndTimeTool(
    "calculate-the-date-between-two-dates",
    dateAndTimeToolsConfig["calculate-the-date-between-two-dates"].metaTitle,
    dateAndTimeToolsConfig["calculate-the-date-between-two-dates"].metaDescription,
    dateAndTimeToolsConfig["calculate-the-date-between-two-dates"].keywords
  ),

  "date-and-time-calculator-between-two-dates": createDateAndTimeTool(
    "date-and-time-calculator-between-two-dates",
    dateAndTimeToolsConfig["date-and-time-calculator-between-two-dates"].metaTitle,
    dateAndTimeToolsConfig["date-and-time-calculator-between-two-dates"].metaDescription,
    dateAndTimeToolsConfig["date-and-time-calculator-between-two-dates"].keywords
  ),
};

export type DateAndTimeDurationCalculatorSlug = keyof typeof dateAndTimeDurationCalculatorTools;