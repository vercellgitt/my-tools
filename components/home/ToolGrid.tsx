import Link from "next/link";
import { getTool } from "@/lib/tools";
import "./ToolGrid.css";

const popularTools = [
{
name: "Age Calculator",
description: "Calculate your exact age in years, months, and days.",
slug: "online-age-calculator-age-calculator-online",
category: "Everyday",
},
{
name: "Body Mass Index Calculator BMI",
description: "Calculate your body mass index bmi.",
slug: "body-mass-index-calculator-bmi",
category: "Health",
},
{
name: "Daily Water Intake Calculator",
description: "Use our daily water intake calculator to find your optimal fluid requirement based on age etc.",
slug: "daily-water-intake-calculator",
category: "Health",
},
{
name: "Percent Of Difference Formula",
description: "how to calculate percentage of difference, and percent of difference formula",
slug: "how-to-calculate-percentage-of-difference",
category: "tools",
},
{
name: "Pdf To Image",
description: "Extract your Pdf To Image Converter",
slug: "pdf-to-image",
category: "Utilities",
},
{
name: "Image To Pdf",
description: "Convert Your Images Jpg Png Webp To PDF .",
slug: "image-to-pdf",
category: "Utilities",
},
{
name: "Date And Time Duration Calculator",
description: "date and time duration calculator hours and minutes day wekk month years etc.",
slug: "date-and-time-duration-calculator",
category: "time",
},
{
name: "Word Counter",
description: "Count words, characters, and sentences.",
slug: "word-count-online-word-counter",
category: "Text",
},
{
name: "Maintenance Calorie Calculator Find My Estimated Calories",
description: "Maintenance calorie calculator is: calculate calories for maintenance, determining what my maintenance calories are.",
slug: "maintenance-calorie-calculator",
category: "Text",
},
{
name: "Word To PDF",
description: "Fast word to pdf transfer from conversion word to pdf online.",
slug: "word-to-pdf-transfer-from-conversion-word-to-pdf",
category: "tools",
},
{
name: "Unit Converter",
description: "Convert common units of measurement.",
slug: "unit-converter",
category: "Conversion",
},
{
name: "Currency Converter",
description: "Convert amounts between currencies.",
slug: "currency-converter",
category: "Finance",
},
{
name: "Calorie Calculator",
description: "Estimate daily calorie requirements.",
slug: "calorie-calculator",
category: "Health",
},
{
name: "Water Intake Calculator",
description: "Estimate your daily water intake.",
slug: "water-intake-calculator",
category: "Health",
},
{
name: "Gas Mileage Calculator",
description: "Calculate vehicle fuel efficiency.",
slug: "gas-mileage-calculator",
category: "Automotive",
},
{
name: "Time Card Calculator",
description: "Calculate work hours and total time.",
slug: "time-card-calculator",
category: "Work",
},
];

export default function ToolGrid() {
return (
<section
className="tool-section"
id="popular-tools"
aria-labelledby="popular-tools-heading"
>
<div className="container">
<div className="tool-section-heading">
<h2 id="popular-tools-heading">Popular Tools</h2>
<p>Simple tools to help you get things done.</p>
</div>

    <div className="tool-grid">
      {popularTools.map((item) => {
        const tool = getTool(item.slug);

        const content = (
          <>
            <span className="tool-category">{item.category}</span>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <span className="tool-card-action">
              {tool ? "Open tool →" : "Coming soon"}
            </span>
          </>
        );

        return tool ? (
          <Link
            href={`/${item.slug}`}
            className="tool-card"
            key={item.slug}
          >
            {content}
          </Link>
        ) : (
          <div
            className="tool-card tool-card-disabled"
            key={item.slug}
            aria-disabled="true"
          >
            {content}
          </div>
        );
      })}
    </div>
  </div>
</section>

);
}