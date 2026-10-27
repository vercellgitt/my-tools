"use client";

import { useState } from "react";
import "./age-calculator.css";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function calculateAge() {
    setError("");
    setResult("");

    if (!birthDate) {
      setError("Please select your date of birth.");
      return;
    }

    const birth = new Date(`${birthDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(birth.getTime()) || birth > today) {
      setError("Please enter a valid date of birth.");
      return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setResult(`${years} years, ${months} months, ${days} days`);
  }

  return (
    <section className="age-calculator">
      <label htmlFor="birth-date">Date of Birth</label>

      <input
        id="birth-date"
        type="date"
        value={birthDate}
        max={new Date().toLocaleDateString("en-CA")}
        onChange={(event) => setBirthDate(event.target.value)}
      />

      <button onClick={calculateAge}>Calculate Age</button>

      {error && <p className="age-error">{error}</p>}

      {result && (
        <div className="age-result" aria-live="polite">
          <h2>Your Age</h2>
          <p>{result}</p>
        </div>
      )}
    </section>
  );
}
