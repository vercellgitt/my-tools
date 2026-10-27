import type { Metadata } from "next";
import StaticPage from "@/components/layout/StaticPage";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Liebess and our online tools.",
  alternates: {
    canonical: "/about-us",
  },
};

export default function AboutUsPage() {
  return (
    <StaticPage title="About Us">
      <p>
        Liebess provides online tools designed to make everyday tasks
        simpler and more convenient.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our goal is to make useful calculators and digital tools
        accessible through a simple, user-friendly website.
      </p>

      <h2>Our Tools</h2>
      <p>
        We aim to provide practical tools for calculations, text
        processing, conversions, and other everyday needs.
      </p>

      <h2>Our Commitment</h2>
      <p>
        We strive to improve usability, accuracy, and accessibility
        as our collection of tools grows.
      </p>
    </StaticPage>
  );
}