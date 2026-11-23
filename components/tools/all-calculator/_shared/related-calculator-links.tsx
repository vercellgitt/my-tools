"use client";

import DOMPurify from "isomorphic-dompurify";

const calculators = [
  {
    slug: "volume-density-mass-calculator",
    title: "Volume Density Mass Calculator",
    external: "https://www.britannica.com/science/density",
    externalTitle: "Learn About Density",
  },
  {
    slug: "calculating-density-formula",
    title: "Calculating Density Formula",
    external: "https://www.nist.gov/pml/owm/si-units-mass",
    externalTitle: "NIST Measurement Reference",
  },
  {
    slug: "conception-date-calculator",
    title: "Conception Date Calculator",
    external: "https://www.nhs.uk/pregnancy/trying-for-a-baby/trying-to-get-pregnant/",
    externalTitle: "NHS Pregnancy Guidance",
  },
  {
    slug: "days-until-calculator",
    title: "Days Until Calculator",
    external: "https://www.timeanddate.com/date/dateadd.html",
    externalTitle: "Time and Date Calculator",
  },
  {
    slug: "pregnancy-due-date-calculator",
    title: "Pregnancy Due Date Calculator",
    external: "https://www.acog.org/womens-health/faqs/estimated-due-date",
    externalTitle: "ACOG Estimated Due Date Guide",
  },
  {
    slug: "cubic-feet-per-minute-calculator",
    title: "Cubic Feet Per Minute Calculator",
    external: "https://www.engineeringtoolbox.com/",
    externalTitle: "Engineering Toolbox Reference",
  },
  {
    slug: "calculate-cubic-feet",
    title: "Calculate Cubic Feet",
    external: "https://www.calculator.net/volume-calculator.html",
    externalTitle: "Volume Calculator Reference",
  },
  {
    slug: "date-duration-calculator",
    title: "Date Duration Calculator",
    external: "https://www.datecalculator.net/",
    externalTitle: "Date Calculator Reference",
  },
  {
    slug: "arabic-to-gregorian-date-converter",
    title: "Arabic to Gregorian Date Converter",
    external: "https://www.islamicfinder.org/islamic-date-converter/",
    externalTitle: "Islamic Date Converter",
  },
  {
    slug: "date-to-date-calculator",
    title: "Date to Date Calculator",
    external: "https://www.dateandtime.info/",
    externalTitle: "Date and Time Reference",
  },
  {
    slug: "date-range-calculator",
    title: "Date Range Calculator",
    external: "https://www.calendarpedia.com/",
    externalTitle: "Calendar and Date Reference",
  },
  {
    slug: "cubic-feet-to-cubic-yard",
    title: "Cubic Feet to Cubic Yard",
    external: "https://www.inchcalculator.com/convert/cubic-foot-to-cubic-yard/",
    externalTitle: "Cubic Feet Conversion Guide",
  },
  {
    slug: "body-mass-index-calculator-for-female",
    title: "Body Mass Index Calculator for Female",
    external: "https://www.womenshealth.gov/healthy-weight/weight-and-body-image",
    externalTitle: "Women's Health Weight Guide",
  },
  {
    slug: "how-to-calculate-percentage-of-difference",
    title: "How to Calculate Percentage of Difference",
    external: "https://www.mathsisfun.com/percentage-difference.html",
    externalTitle: "Percentage Difference Explanation",
  },
  {
    slug: "percent-of-difference-formula",
    title: "Percent of Difference Formula",
    external: "https://www.omnicalculator.com/math/percentage-difference",
    externalTitle: "Percentage Difference Reference",
  },
  {
    slug: "date-and-time-calculator-duration",
    title: "Date and Time Calculator Duration",
    external: "https://www.rapidtables.com/calc/time/date-calculator.html",
    externalTitle: "Date Calculator Reference",
  },
  {
    slug: "date-difference-calculator",
    title: "Date Difference Calculator",
    external: "https://www.calculatorsoup.com/calculators/time/date-day.php",
    externalTitle: "Date Difference Guide",
  },
  {
    slug: "percent-to-change-formula",
    title: "Percent to Change Formula",
    external: "https://corporatefinanceinstitute.com/resources/accounting/percentage-change/",
    externalTitle: "Percentage Change Formula Guide",
  },
  {
    slug: "date-and-time-calculator-between-two-dates",
    title: "Date and Time Calculator Between Two Dates",
    external: "https://www.time.is/",
    externalTitle: "Time and Date Information",
  },
  {
    slug: "calculate-the-date-between-two-dates",
    title: "Calculate the Date Between Two Dates",
    external: "https://www.calendardate.com/",
    externalTitle: "Calendar Date Reference",
  },
  {
    slug: "date-and-time-duration-calculator",
    title: "Date and Time Duration Calculator",
    external: "https://days.to/",
    externalTitle: "Days and Date Reference",
  },
  {
    slug: "body-mass-index-calculator-kg-cm",
    title: "Body Mass Index Calculator KG CM",
    external: "https://www.nhlbi.nih.gov/calculate-your-bmi",
    externalTitle: "NHLBI BMI Calculator",
  },
];

export default function RelatedCalculatorLinks({
  currentSlug,
}: {
  currentSlug: string;
}) {
  const current = calculators.find(
    (item) => item.slug === currentSlug
  );

  if (!current) return null;

  const internalLinks = calculators
    .filter((item) => item.slug !== currentSlug)
    .map(
      (item) =>
        `<a href="/${item.slug}">${item.title}</a>`
    )
    .join("\n");

  const html = `
    ${internalLinks}
    <a href="${current.external}" target="_blank" rel="noopener noreferrer">
      ${current.externalTitle}
    </a>
  `;

  return (
    <div className="maintenance-1">
      <p>You may also find these useful tools and guides:</p>

      <p
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(html),
        }}
      />
    </div>
  );
}