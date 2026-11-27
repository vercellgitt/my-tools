
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { frenchToolsRegistry } from "@/lib/tools/fr";
import type { ToolDefinition } from "@/lib/tools/types";
import ToolRenderer, {
  createToolMetadata,
} from "@/lib/tools/page-utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(frenchToolsRegistry).map((slug) => ({ slug }));
}

function getTool(slug: string): ToolDefinition | undefined {
  return frenchToolsRegistry[
    slug as keyof typeof frenchToolsRegistry
  ] as ToolDefinition | undefined;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) return { title: "Page introuvable" };

  return createToolMetadata(tool, slug, "fr");
}

export default async function FrenchToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  return <ToolRenderer tool={tool} slug={slug} locale="fr" />;
}
