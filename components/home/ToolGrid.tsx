import Link from "next/link";
import { getTool } from "@/lib/tools";
import "./ToolGrid.css";

const popularTools = [
{
name: "Age Calculator",
description: "Calculate your exact age in years, months, and days.",
slug: "age-calculator",
category: "Everyday",
},
{
name: "BMI Calculator",
description: "Calculate your body mass index.",
slug: "bmi-calculator",
category: "Health",
},
{
name: "EMI Calculator",
description: "Estimate your monthly loan payments.",
slug: "emi-calculator",
category: "Finance",
},
{
name: "Mortgage Calculator",
description: "Estimate mortgage payments and costs.",
slug: "mortgage-calculator",
category: "Finance",
},
{
name: "Percentage Calculator",
description: "Calculate percentages quickly and easily.",
slug: "percentage-calculator",
category: "Math",
},
{
name: "Image To Pdf",
description: "Convert Your Images Jpg Png Webp To PDF .",
slug: "image-to-pdf",
category: "Everyday",
},
{
name: "Time Calculator",
description: "Add or subtract hours and minutes.",
slug: "time-calculator",
category: "Everyday",
},
{
name: "Word Counter",
description: "Count words, characters, and sentences.",
slug: "word-counter",
category: "Text",
},
{
name: "Case Converter",
description: "Convert text between different letter cases.",
slug: "case-converter",
category: "Text",
},
{
name: "Password Generator",
description: "Generate a strong random password.",
slug: "password-generator",
category: "Security",
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