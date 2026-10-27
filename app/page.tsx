import type { Metadata } from "next";
import ToolGrid from "@/components/home/ToolGrid";

export const metadata: Metadata = {
  title: "Free Online Tools and Calculators",
  description:
    "Explore free online calculators, converters, and useful tools at Liebess.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main>
      <section className="container" style={{ paddingTop: 48 }}>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(30px, 5vw, 44px)",
            lineHeight: 1.2,
          }}
        >
          Free Online Tools
        </h1>

        <p style={{ color: "#6b7280", maxWidth: 600 }}>
          Useful online calculators and tools for everyday tasks.
        </p>
      </section>

      <ToolGrid />
    </main>
  );
}