import type { Metadata } from "next";
import StaticPage from "@/components/layout/StaticPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the privacy policy for Liebess.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <StaticPage title="Privacy Policy">
      <p>
        This Privacy Policy explains general information about
        privacy when using Liebess.
      </p>

      <h2>Information You Provide</h2>
      <p>
        Information you enter into a tool may be processed by that
        tool to provide its result. Do not enter sensitive personal
        information unless necessary.
      </p>

      <h2>Cookies and Analytics</h2>
      <p>
        Liebess may use cookies, analytics, or advertising services
        if these features are enabled. Such services may process
        information according to their own privacy policies.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        External services integrated into the website may collect
        information under their respective policies.
      </p>

      <h2>Data Security</h2>
      <p>
        We aim to use appropriate measures to protect information
        associated with the website.
      </p>

      <h2>Policy Updates</h2>
      <p>
        This policy may be updated as the website and its services
        change.
      </p>
    </StaticPage>
  );
}