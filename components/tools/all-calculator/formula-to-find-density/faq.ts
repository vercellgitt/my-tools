export interface FAQItem {
  question: string;
  answer: string;
}

export interface SlugConfig {
  defaultMode: "density" | "mass" | "volume";
  toolHeading: string;
  dropdownLabel: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1Title: string;
  introText: string;
  article: {
    title: string;
    sections: {
      heading: string;
      level: "h2" | "h3" | "h4";
      content: string;
    }[];
  };
  faqs: FAQItem[];
}

export const densityToolsConfig: Record<string, SlugConfig> = {
  // URL 1: calculating-density-formula -> Default Mode: Density
  "calculating-density-formula": {
    defaultMode: "density",
    toolHeading: "Calculating Density Formula Tool",
    dropdownLabel: "Calculating Density Formula (Solve Density: ρ = m / V)",
    metaTitle: "Calculating Density Formula Step-by-Step Density Calculator",
    metaDescription:
      "Use the calculating density formula tool to compute material density instantly. Enter mass and volume with automatic unit conversions and step-by-step math.",
    keywords: [
      "calculating density formula",
      "density calculation formula",
      "how to calculate density",
      "mass divided by volume formula",
    ],
    h1Title: "Calculating Density Formula & Step-by-Step Solver",
    introText:
      "Mastering the calculating density formula allows students, engineers, and scientists to determine how tightly matter is packed inside an object. Simply enter your mass and volume measurements above to automatically apply the standard ρ = m/V equation with full unit conversions and step-by-step mathematical breakdowns.",
    article: {
      title: "Understanding the Calculating Density Formula in Physics and Chemistry",
      sections: [
        {
          heading: "What is the Core Calculating Density Formula?",
          level: "h2",
          content:
            "The standard calculating density formula is expressed as ρ = m / V, where the Greek letter rho (ρ) represents density, m stands for total mass, and V represents total volume. This foundational equation reveals how much matter occupies a specific three-dimensional space regardless of the sample size.",
        },
        {
          heading: "Standard Units Used When Applying the Density Equation",
          level: "h2",
          content:
            "In the International System of Units (SI), density is measured in kilograms per cubic meter (kg/m³). However, in chemistry laboratories, grams per cubic centimeter (g/cm³) and grams per milliliter (g/mL) are far more common because water has a convenient reference density of 1 g/cm³.",
        },
        {
          heading: "How Temperature and Pressure Affect Density Calculations",
          level: "h3",
          content:
            "While mass remains constant regardless of environment, volume changes when materials expand under heat or compress under pressure. Therefore, applying the calculating density formula accurately for gases and liquids requires noting the ambient temperature and atmospheric pressure during measurement.",
        },
      ],
    },
    faqs: [
      {
        question: "What is the exact calculating density formula used in science?",
        answer:
          "The exact calculating density formula used across physics, chemistry, and engineering is Density equals Mass divided by Volume, written mathematically as ρ = m / V. In this equation, mass measures the total amount of matter inside a substance, while volume measures the three-dimensional space that substance occupies. When you input numbers into our calculator, it automatically converts your chosen units into standard kilograms and cubic meters before performing the division. Using the calculating density formula helps identify unknown materials, check liquid purity, and determine whether solid objects will float or sink when placed inside different fluids.",
      },
      {
        question: "How do I use the calculating density formula with different units?",
        answer:
          "Applying the calculating density formula with mixed units requires converting both measurements into compatible scales before dividing. For instance, if your mass is measured in grams and your volume is recorded in liters, dividing them directly gives grams per liter rather than standard grams per cubic centimeter. Our online tool simplifies this process by handling all unit conversions automatically in the background. You can input mass in milligrams, grams, kilograms, ounces, or pounds alongside volume in milliliters, liters, cubic centimeters, or gallons, and the calculating density formula engine immediately outputs accurate results across multiple scientific units.",
      },
      {
        question: "Why is the calculating density formula important for buoyancy?",
        answer:
          "The calculating density formula is essential for predicting buoyancy because an object floats only when its average density is lower than the density of the surrounding fluid. Pure liquid water has a reference density of approximately one gram per cubic centimeter. By applying the calculating density formula to a wooden block or metal sphere, you can immediately see if the resulting value is less than or greater than water. Engineers rely heavily on this exact calculation when designing cargo ships, submarines, hot air balloons, and offshore platforms to guarantee stability and safe flotation under varying load conditions.",
      },
      {
        question: "Can the calculating density formula work for irregular objects?",
        answer:
          "Yes, the calculating density formula works reliably for irregular objects as long as you can measure their mass and displaced volume accurately. First, weigh the irregular object on a calibrated digital scale to obtain its exact mass. Next, submerge the object completely in a graduated cylinder filled with water and record how much the water level rises; this displaced fluid equals the object's volume. Once you enter both measurements into our tool, the calculating density formula divides the recorded mass by the displaced volume, giving you the precise density of rocks, jewelry, or complex mechanical parts.",
      },
      {
        question: "What common mistakes happen when using the calculating density formula?",
        answer:
          "The most frequent mistake when using the calculating density formula is dividing volume by mass instead of dividing mass by volume, which yields specific volume rather than density. Another widespread error involves forgetting to align measurement units, such as combining kilograms with cubic centimeters without proper decimal scaling. Additionally, students sometimes confuse weight with mass or enter zero for volume, which creates a mathematical division error. Our calculator prevents these pitfalls by validating inputs in real time, displaying clear step-by-step breakdowns, and applying exact conversion factors to every calculating density formula operation.",
      },
    ],
  },

  // URL 2: formula-to-find-density -> Default Mode: Mass (Rearranged Formula)
  "formula-to-find-density": {
    defaultMode: "mass",
    toolHeading: "Formula to Find Density & Mass Solver",
    dropdownLabel: "Formula to Find Density (Solve Mass: m = ρ × V)",
    metaTitle: "Formula to Find Density – Best Free Mass & Volume Calculator",
    metaDescription:
      "Learn and apply the formula to find density, mass, or volume easily. Switch modes, convert SI and imperial units, and view clear step-by-step solutions.",
    keywords: [
      "formula to find density",
      "equation to find density",
      "find density from mass and volume",
      "density formula triangle",
    ],
    h1Title: "Formula to Find Density: Interactive Calculator & Guide",
    introText:
      "Looking for the right formula to find density or rearrange the equation to solve for mass and volume? Use our interactive calculator above—pre-configured for rearranged mass calculations from density and volume—or switch tabs anytime to compute density directly with instant SI and imperial conversions.",
    article: {
      title: "How to Use and Rearrange the Formula to Find Density",
      sections: [
        {
          heading: "The Primary Formula to Find Density Explained",
          level: "h2",
          content:
            "The universal formula to find density is Density = Mass ÷ Volume. By dividing the total mass of a sample by the space it occupies, you obtain an intensive physical property that remains constant whether you test a tiny drop or a massive block of the pure material.",
        },
        {
          heading: "Using the Density Triangle to Solve for Mass and Volume",
          level: "h2",
          content:
            "Many students memorize the formula to find density using the DMV triangle, where Mass sits at the top while Density and Volume sit at the bottom. Covering Density reveals Mass ÷ Volume, covering Mass reveals Density × Volume, and covering Volume reveals Mass ÷ Density.",
        },
        {
          heading: "Practical Examples of Finding Density in Everyday Life",
          level: "h3",
          content:
            "From testing gold purity in jewelry shops to checking antifreeze concentration in car radiators, the formula to find density plays a vital role outside classrooms. Even geologists use density ratios to distinguish valuable mineral ores from ordinary crustal rock.",
        },
      ],
    },
    faqs: [
      {
        question: "What is the simplest formula to find density of any substance?",
        answer:
          "The simplest formula to find density of any solid, liquid, or gas is dividing its total mass by its total volume, expressed as D = M / V. To use this formula effectively, you only need two basic measurements: how heavy the matter is on a balance scale and how much three-dimensional space it fills. Once you enter those two figures into our calculator, it executes the formula to find density automatically and presents the answer in grams per cubic centimeter, kilograms per cubic meter, and pounds per cubic foot for complete clarity.",
      },
      {
        question: "How do you rearrange the formula to find density for mass or volume?",
        answer:
          "You can easily rearrange the formula to find density using basic algebra depending on which variable is missing from your problem. If you already know the density and volume of an object, multiply them together using Mass = Density × Volume to find total weight. Conversely, if you know the mass and density, divide them using Volume = Mass ÷ Density to determine how much space the material takes up. Our calculator includes dedicated tabs at the top so you can switch between the formula to find density, mass, or volume with one click.",
      },
      {
        question: "How does the formula to find density help identify pure metals?",
        answer:
          "Every pure metal possesses a unique, unchanging atomic structure that gives it a specific standard density value. For example, pure gold has a density of 19.32 grams per cubic centimeter, whereas silver is 10.49 and copper is 8.96. By measuring a coin or bar and applying the formula to find density, jewelers and metallurgists can immediately verify authenticity without damaging the item. If the result from the formula to find density deviates significantly from the known standard value, it indicates that the metal is an alloy, hollow inside, or counterfeit.",
      },
      {
        question: "What units are best when applying the formula to find density?",
        answer:
          "The best units to use when applying the formula to find density depend on whether you are working in a chemistry lab, physics class, or industrial setting. Chemists typically prefer grams per cubic centimeter (g/cm³) for solids and grams per milliliter (g/mL) for liquids because the resulting numbers are small and easy to read. Physicists and civil engineers usually choose the official SI unit of kilograms per cubic meter (kg/m³). Our calculator supports all major metric and imperial units simultaneously whenever you run the formula to find density.",
      },
      {
        question: "Does cutting an object in half change the formula to find density?",
        answer:
          "Cutting a uniform object in half does not change the formula to find density or the final density value itself. Because density is an intensive physical property, reducing the size of a homogeneous sample cuts both its mass and its volume in exact proportion. When you plug the smaller mass and smaller volume into the formula to find density, the two halves cancel out and yield the exact same ratio as the original whole piece. This makes the formula to find density reliable whether you test a tiny pebble or a giant boulder.",
      },
    ],
  },

  // URL 3: volume-density-mass-calculator -> Default Mode: Volume
  "volume-density-mass-calculator": {
    defaultMode: "volume",
    toolHeading: "Volume, Density & Mass Calculator",
    dropdownLabel: "Volume Density Mass Calculator (Solve Volume: V = m / ρ)",
    metaTitle: "Volume Density Mass Calculator Solve Any Variable Instantly",
    metaDescription:
      "All-in-one volume density mass calculator. Compute volume from mass and density, find mass from volume, or calculate density with multi-unit conversion.",
    keywords: [
      "volume density mass calculator",
      "mass volume density calculator",
      "calculate volume from mass and density",
      "density mass volume solver",
    ],
    h1Title: "Volume Density Mass Calculator with Instant Unit Conversion",
    introText:
      "Our 3-in-1 volume density mass calculator lets you solve for any missing variable in the classic physical relationship ρ = m / V. Whether you need to find the volume of a liquid from its mass and density, determine shipping weight from dimensions, or verify material density, get instant answers with custom decimal precision.",
    article: {
      title: "Complete Guide to the Volume, Density, and Mass Relationship",
      sections: [
        {
          heading: "How Volume, Density, and Mass Interact Mathematically",
          level: "h2",
          content:
            "Volume, density, and mass form an interconnected trio in physical science. Knowing any two values allows our volume density mass calculator to compute the third immediately: Volume equals Mass divided by Density, Mass equals Density multiplied by Volume, and Density equals Mass divided by Volume.",
        },
        {
          heading: "Calculating Volume from Mass and Density in Logistics and Labs",
          level: "h2",
          content:
            "In chemical manufacturing and freight logistics, raw materials are often purchased by weight but stored in tanks of fixed capacity. Using a volume density mass calculator helps operators determine exactly how many liters or cubic meters a specific tonnage of liquid or powder will occupy.",
        },
        {
          heading: "Choosing Decimal Precision and Multi-Unit Outputs",
          level: "h3",
          content:
            "Different disciplines require different rounding standards. A construction estimator might only need two decimal places in cubic feet, whereas a pharmaceutical researcher needs six decimal places in milliliters. Adjust the decimal precision selector above to tailor every output to your exact workflow.",
        },
      ],
    },
    faqs: [
      {
        question: "How does this volume density mass calculator work for all three variables?",
        answer:
          "This volume density mass calculator uses the fundamental physical equation ρ = m / V and dynamically rearranges it based on the mode you select. When you choose Calculate Volume, the tool divides your entered mass by the material density. When you select Calculate Mass, it multiplies density by volume. When you pick Calculate Density, it divides mass by volume. Every calculation automatically converts inputs across metric and imperial scales—such as kilograms, pounds, liters, gallons, and cubic meters—so this volume density mass calculator saves time and eliminates manual conversion errors.",
      },
      {
        question: "How do I find volume using the volume density mass calculator?",
        answer:
          "To find volume using our volume density mass calculator, ensure the Calculate Volume tab is active, then enter the known mass of your substance and its standard density. For example, if you have 500 grams of olive oil with a density of 0.92 grams per cubic centimeter, enter those two values and select their respective units. The volume density mass calculator instantly divides mass by density to show the exact volume in cubic meters, liters, milliliters, cubic feet, and gallons, complete with a step-by-step mathematical explanation.",
      },
      {
        question: "Why should I use a volume density mass calculator instead of manual math?",
        answer:
          "Using an automated volume density mass calculator eliminates tedious unit conversion mistakes that frequently happen during manual calculations. Converting between imperial units like pounds per cubic foot and metric units like grams per milliliter requires multiplying or dividing by complex decimals such as 16.0185 or 0.0283168. One misplaced decimal point can ruin an engineering estimate or chemistry lab report. Our volume density mass calculator handles all standard SI and imperial conversions internally, displays multiple unit equivalents simultaneously, and lets you customize decimal precision up to fifteen places.",
      },
      {
        question: "Can this volume density mass calculator help with shipping and freight?",
        answer:
          "Yes, logistics managers and freight planners frequently rely on a volume density mass calculator to estimate cargo weight and container capacity. When shipping bulk liquids, grains, or industrial metals, knowing the material density lets you calculate total shipping mass from container volume, or determine required tank volume from total cargo weight. By switching between tons, pounds, cubic feet, and gallons inside our volume density mass calculator, you can verify transport limits, prevent overloading, and optimize storage space accurately before dispatching shipments.",
      },
      {
        question: "Does the volume density mass calculator store my previous calculations?",
        answer:
          "Yes, the volume density mass calculator includes a built-in calculation history panel that automatically saves your five most recent results directly in your browser's local storage. Each entry stays available for twenty-four hours so you can compare different materials, review past measurements, or copy results without re-entering numbers. Your data never leaves your device, ensuring complete privacy while you work. Whenever you want a fresh start, simply click the Clear History button in our volume density mass calculator to wipe the saved list.",
      },
    ],
  },
};