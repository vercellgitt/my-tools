import type { Metadata } from "next";
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

  const tool = toolsRegistry[slug as keyof typeof toolsRegistry];

  if (!tool) {
    return {
      title: {
        absolute: "Page Not Found | Liebess",
      },
    };
  }

  // প্রতিটি টুলের নির্ধারিত Title অপরিবর্তিত থাকবে।
  const title = tool.title;

  // Description-এ অন্য কোনো ক্যালকুলেটরের নাম যুক্ত হবে না।
  const description = tool.description;

  const url = `https://liebess.com/${slug}`;

  return {
    metadataBase: new URL("https://liebess.com"),

    applicationName: "Liebess",

    // absolute ব্যবহারের কারণে RootLayout-এর title.template
    // এই Title-এর সঙ্গে অতিরিক্ত কিছু যুক্ত করতে পারবে না।
    title: {
      absolute: title,
    },

    description,

    keywords: tool.keywords,

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

  const tool = toolsRegistry[slug as keyof typeof toolsRegistry];

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

  return (
    <main>
      <ToolComponent />
    </main>
  );
}