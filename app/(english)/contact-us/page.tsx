import type { Metadata } from "next";
import StaticPage from "@/components/layout/StaticPage";

export const metadata: Metadata = {
  title: "Contact Us | Liebess",
  description:
    "Contact Liebess for questions, technical support, feedback, suggestions, and inquiries about our online tools and services.",
  alternates: {
    canonical: "/contact-us",
  },
};

export default function ContactUsPage() {
  return (
    <StaticPage title="Contact Us">
      <p>
        Thank you for visiting Liebess. We value your feedback
        and welcome questions, suggestions, and inquiries from
        our visitors.
      </p>

      <p>
        If you have questions about our website, experience a
        problem with one of our tools, or would like to suggest
        an improvement, we encourage you to get in touch with us.
      </p>

      <h2>General Inquiries</h2>

      <p>
        For general questions about Liebess, our website, or
        the services we provide, you can contact us using the
        contact information listed below.
      </p>

      <h2>Technical Support</h2>

      <p>
        If a calculator, PDF tool, converter, or another feature
        does not work as expected, please contact us with a
        description of the problem.
      </p>

      <p>
        When reporting a technical issue, it is helpful to include
        the name of the tool, the type of device or browser you
        are using, and a brief explanation of what happened.
      </p>

      <h2>Feedback and Suggestions</h2>

      <p>
        Your feedback helps us improve Liebess. We welcome
        suggestions about existing tools, website usability,
        accessibility, and features that you would like to see
        added in the future.
      </p>

      <h2>Business and Other Inquiries</h2>

      <p>
        For business-related inquiries, partnerships, website
        matters, or other professional questions, please use
        our contact email address.
      </p>

      <h2>Contact Information</h2>

      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:YOUR_EMAIL_ADDRESS">
          YOUR_EMAIL_ADDRESS
        </a>
      </p>

      <p>
        We will review your message and aim to respond as soon
        as reasonably possible.
      </p>

      <h2>Before Contacting Us</h2>

      <p>
        Please do not include passwords, payment details,
        sensitive personal information, or confidential
        documents in your messages unless absolutely necessary.
      </p>

      <p>
        Thank you for being part of Liebess. We appreciate
        your time and interest in helping us improve.
      </p>
    </StaticPage>
  );
}