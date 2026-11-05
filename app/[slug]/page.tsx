import type { Metadata } from "next";
import type { ComponentType } from "react";
import { toolsRegistry } from "@/lib/tools";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(toolsRegistry).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const tool =
    toolsRegistry[slug as keyof typeof toolsRegistry];

  if (!tool) {
    return {
      title: {
        absolute: "Page Not Found | Liebess",
      },
    };
  }

  const title = tool.title;
  const description = tool.description;
  const keywords = "keywords" in tool ? tool.keywords : undefined;

  const url = `https://liebess.com/${slug}`;

  return {
    metadataBase: new URL("https://liebess.com"),
    applicationName: "Liebess",

    title: {
      absolute: title,
    },

    description,
    keywords,

    authors: [{ name: "Liebess" }],
    publisher: "Liebess",

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url,
      siteName: "Liebess",
      title,
      description,
      locale: "en_US",
    },

    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ToolPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const tool =
    toolsRegistry[slug as keyof typeof toolsRegistry];

  if (!tool) {
    notFound();
  }

  const ToolComponent = dynamic(tool.load as any, {
    loading: () => (
      <div style={{ textAlign: "center", padding: 40 }}>
        Loading...
      </div>
    ),
  });

  if ("receiveSlug" in tool && tool.receiveSlug === true) {
    const SlugComponent =
      ToolComponent as ComponentType<{ slug: string }>;

    return (
      <main>
        <SlugComponent slug={slug} />
      </main>
    );
  }

  return (
    <main>
      <ToolComponent />
    </main>
  );
}