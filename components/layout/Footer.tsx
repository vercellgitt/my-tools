import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <Link href="/" className="footer-logo">
          liebess.com
        </Link>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/about-us">About Us</Link>
          <Link href="/contact-us">Contact Us</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">
            Terms &amp; Conditions
          </Link>
        </nav>

        <p className="footer-copyright">
          © {new Date().getFullYear()} Liebess. All rights reserved.
        </p>
      </div>
    </footer>
  );
}