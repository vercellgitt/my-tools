
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { arabicToolsRegistry } from "@/lib/tools/ar";
import type { ToolDefinition } from "@/lib/tools/types";
import ToolRenderer, {
  createToolMetadata,
} from "@/lib/tools/page-utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(arabicToolsRegistry).map((slug) => ({ slug }));
}

function getTool(slug: string): ToolDefinition | undefined {
  return arabicToolsRegistry[
    slug as keyof typeof arabicToolsRegistry
  ] as ToolDefinition | undefined;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) return { title: "الصفحة غير موجودة" };

  return createToolMetadata(tool, slug, "ar");
}

export default async function ArabicToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  return <ToolRenderer tool={tool} slug={slug} locale="ar" />;
}
