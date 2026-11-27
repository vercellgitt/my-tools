
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { germanToolsRegistry } from "@/lib/tools/de";
import type { ToolDefinition } from "@/lib/tools/types";
import ToolRenderer, {
  createToolMetadata,
} from "@/lib/tools/page-utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(germanToolsRegistry).map((slug) => ({ slug }));
}

function getTool(slug: string): ToolDefinition | undefined {
  return germanToolsRegistry[
    slug as keyof typeof germanToolsRegistry
  ] as ToolDefinition | undefined;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) return { title: "Seite nicht gefunden" };

  return createToolMetadata(tool, slug, "de");
}

export default async function GermanToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  return <ToolRenderer tool={tool} slug={slug} locale="de" />;
}
