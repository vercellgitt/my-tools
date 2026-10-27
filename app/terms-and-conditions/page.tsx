import type { Metadata } from "next";
import StaticPage from "@/components/layout/StaticPage";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read the terms and conditions for using Liebess.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <StaticPage title="Terms and Conditions">
      <p>
        By using Liebess, you agree to use the website responsibly
        and in accordance with applicable laws.
      </p>

      <h2>Use of Tools</h2>
      <p>
        The tools are provided for general informational and
        practical purposes. You are responsible for verifying
        results before relying on them.
      </p>

      <h2>No Professional Advice</h2>
      <p>
        Unless explicitly stated otherwise, the tools do not provide
        professional medical, legal, financial, or other regulated
        advice.
      </p>

      <h2>Availability</h2>
      <p>
        We may modify, suspend, or discontinue tools or website
        features when necessary.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        Website content and design may be protected by applicable
        intellectual property laws.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        These terms may be updated from time to time. Continued use
        of the website after changes are published constitutes use
        under the updated terms, subject to applicable law.
      </p>
    </StaticPage>
  );
}