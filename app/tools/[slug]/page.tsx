import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTool, tools } from "@/lib/tools";

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    return {};
  }

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    notFound();
  }

  const ToolComponent = (await tool.load()).default;

  return (
    <main>
      <header className="container" style={{ paddingTop: 32 }}>
        <h1>{tool.title}</h1>
        <p>{tool.description}</p>
      </header>

      <ToolComponent />
    </main>
  );
}