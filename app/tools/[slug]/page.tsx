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
      <header className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold">{tool.title}</h1>
        <p className="mt-3 text-gray-600">
          {tool.description}
        </p>
      </header>

      <ToolComponent />
    </main>
  );
}