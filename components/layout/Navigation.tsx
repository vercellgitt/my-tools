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

    {/* Website Logo - Not a Link */}
    <div className="site-logo">
      liebess<span>.com</span>
    </div>

    {/* Desktop Navigation */}
    <div className="desktop-nav">
      <Link href="/">Home</Link>
      <Link href="/#popular-tools">Finance Calculator</Link>

      {/*
      <Link href="/about-us">Health Calculator</Link>
      <Link href="/contact-us">Pdf-Image</Link>
      */}
    </div>

    {/* Mobile Menu Button */}
    <button
      type="button"
      className="mobile-menu-button"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      aria-controls="mobile-navigation-menu"
      onClick={() => setMenuOpen((open) => !open)}
    >
      <span aria-hidden="true">
        {menuOpen ? "×" : "☰"}
      </span>
    </button>

    {/* Mobile Navigation */}
    {menuOpen && (
      <div
        className="mobile-nav"
        id="mobile-navigation-menu"
      >
        <Link href="/" onClick={closeMenu}>
          Home
        </Link>

        <Link href="/#popular-tools" onClick={closeMenu}>
          Finance Calculator
        </Link>

        {/*
        <Link href="/about-us" onClick={closeMenu}>
          Health Calculator
        </Link>

        <Link href="/contact-us" onClick={closeMenu}>
          Pdf-Image
        </Link>
        */}
      </div>
    )}

  </nav>
</header>

);
}