import type { Metadata } from "next";
import StaticPage from "@/components/layout/StaticPage";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Liebess for questions and feedback.",
  alternates: {
    canonical: "/contact-us",
  },
};

export default function ContactUsPage() {
  return (
    <StaticPage title="Contact Us">
      <p>
        We welcome questions, feedback, and suggestions about Liebess
        and its online tools.
      </p>

      <h2>Questions and Feedback</h2>
      <p>
        If you experience a problem with a tool or have a suggestion
        for improvement, please use the contact details provided by
        the website owner.
      </p>

      <h2>Tool Suggestions</h2>
      <p>
        Suggestions for new calculators and useful online tools are
        welcome.
      </p>
    </StaticPage>
  );
}