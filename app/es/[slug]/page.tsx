
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { spanishToolsRegistry } from "@/lib/tools/es";
import type { ToolDefinition } from "@/lib/tools/types";
import ToolRenderer, {
  createToolMetadata,
} from "@/lib/tools/page-utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(spanishToolsRegistry).map((slug) => ({ slug }));
}

function getTool(slug: string): ToolDefinition | undefined {
  return spanishToolsRegistry[
    slug as keyof typeof spanishToolsRegistry
  ] as ToolDefinition | undefined;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) return { title: "Página no encontrada" };

  return createToolMetadata(tool, slug, "es");
}

export default async function SpanishToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  return <ToolRenderer tool={tool} slug={slug} locale="es" />;
}
