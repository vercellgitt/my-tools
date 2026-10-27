import type { ReactNode } from "react";
import "./StaticPage.css";

type Props = {
  title: string;
  children: ReactNode;
};

export default function StaticPage({ title, children }: Props) {
  return (
    <main className="static-page">
      <article className="page-content">
        <h1>{title}</h1>
        {children}
      </article>
    </main>
  );
}