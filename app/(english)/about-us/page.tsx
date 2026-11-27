import type { Metadata } from "next";
import StaticPage from "@/components/layout/StaticPage";

export const metadata: Metadata = {
  title: "About Us | Liebess",
  description:
    "Learn about Liebess, our mission, and our collection of free online tools, including calculators, PDF tools, converters, and other useful digital resources.",
  alternates: {
    canonical: "/about-us",
  },
};

export default function AboutUsPage() {
  return (
    <StaticPage title="About Us">
      <p>
        Welcome to Liebess, an online platform dedicated to making
        everyday digital tasks simpler, faster, and more convenient.
        We provide a growing collection of practical online tools
        designed to help people solve common problems without
        unnecessary complexity.
      </p>

      <p>
        Whether you need to perform a calculation, convert a file,
        process text, explore financial information, or access other
        useful digital resources, Liebess aims to provide simple
        and accessible solutions in one place.
      </p>

      <h2>Our Mission</h2>

      <p>
        Our mission is to make useful online tools accessible to
        everyone through a simple, reliable, and user-friendly
        platform. We believe everyday digital tasks should be easy
        to complete, regardless of a user's technical experience.
      </p>

      <p>
        We focus on creating tools that are straightforward to use,
        easy to understand, and designed around practical user needs.
      </p>

      <h2>What We Offer</h2>

      <p>
        Liebess provides different categories of online tools to
        support a variety of everyday activities. Our collection
        includes:
      </p>

      <h3>PDF and Document Tools</h3>

      <p>
        Tools designed to help users work with PDF files and
        documents, including file conversion, document processing,
        and other useful file-related operations.
      </p>

      <h3>Calculators and Health Tools</h3>

      <p>
        A collection of calculators for everyday mathematical,
        personal, and health-related calculations. These may include
        age, body mass index, water intake, and other calculation
        tools intended for general informational purposes.
      </p>

      <h3>Financial Calculators</h3>

      <p>
        Practical financial calculators that help users estimate
        values, understand calculations, and explore different
        financial scenarios, including taxes, discounts, percentages,
        and other everyday financial calculations.
      </p>

      <h3>Converters and Text Tools</h3>

      <p>
        Useful tools for converting different formats, processing
        text, counting words, and completing other common digital
        tasks.
      </p>

      <h3>Prayer Time and Other Useful Tools</h3>

      <p>
        We also aim to provide helpful tools for everyday needs,
        including prayer time information and other practical
        digital resources.
      </p>

      <h2>Our Approach to Quality</h2>

      <p>
        We aim to make our tools easy to understand and convenient
        to use. We continuously work to improve functionality,
        usability, accessibility, and the overall experience of
        our website.
      </p>

      <p>
        We also aim to provide clear information about how our
        tools work, their intended purposes, and any limitations
        that users should understand before relying on their results.
      </p>

      <h2>Free and Accessible Tools</h2>

      <p>
        Our goal is to make useful digital resources accessible
        through a straightforward website. We want users to find
        the tools they need without unnecessary steps or complicated
        processes.
      </p>

      <h2>Our Commitment to Users</h2>

      <p>
        We value our visitors and their experience. We are committed
        to improving our platform, maintaining useful resources,
        and making our website easier to navigate as our collection
        continues to grow.
      </p>

      <h2>Get in Touch</h2>

      <p>
        We welcome questions, feedback, suggestions, and ideas for
        new tools. If you would like to contact us regarding Liebess
        or any of our online tools, please visit our Contact Us page.
      </p>
    </StaticPage>
  );
}