
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolsRegistry } from "@/lib/tools";
import type { ToolDefinition } from "@/lib/tools/types";
import ToolRenderer, {
  createToolMetadata,
} from "@/lib/tools/page-utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(toolsRegistry).map((slug) => ({
    slug,
  }));
}

function getTool(slug: string): ToolDefinition | undefined {
  return toolsRegistry[
    slug as keyof typeof toolsRegistry
  ] as ToolDefinition | undefined;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    return {
      title: "Page Not Found | Liebess",
      robots: { index: false, follow: false },
    };
  }

  return createToolMetadata(tool, slug, "en");
}

export default async function EnglishToolPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  return (
    <ToolRenderer
      tool={tool}
      slug={slug}
      locale="en"
    />
  );
}
