import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Free Online Tools</h1>

      <ul className="mt-6">
        <li>
          <Link href="/tools/age-calculator">
            Age Calculator
          </Link>
        </li>
      </ul>
    </main>
  );
}