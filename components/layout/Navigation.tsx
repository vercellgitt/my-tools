"use client";

import { useState } from "react";
import Link from "next/link";
import "./Navigation.css";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="navigation container" aria-label="Main navigation">
        <Link
          href="/"
          className="site-logo"
          onClick={closeMenu}
          aria-label="Liebess Home"
        >
          liebess<span>.com</span>
        </Link>

        <div className="desktop-nav">
          <Link href="/">Home</Link>
          <Link href="/#popular-tools">Finance Calcouator</Link>
          <Link href="/about-us">Health Calculator</Link>
          <Link href="/contact-us">Pdf-Image</Link>
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        </button>

        {menuOpen && (
          <div
            className="mobile-nav"
            id="mobile-navigation-menu"
          >
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>

            <Link href="/#popular-tools" onClick={closeMenu}>
             Finance Calcouator
            </Link>

            <Link href="/about-us" onClick={closeMenu}>
              Health Calculator
            </Link>

            <Link href="/contact-us" onClick={closeMenu}>
              Pdf-Image
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}