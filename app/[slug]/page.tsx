import type { Metadata } from "next";
import { toolsRegistry } from "@/lib/tools";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOConfig {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  h1Title?: string;
  introText?: string;
  article?: {
    title: string;
    sections?: {
      heading: string;
      level: "h2" | "h3" | "h4";
      content: string;
    }[];
  };
  faqs?: FAQItem[];
}

interface ExtendedTool {
  slug?: string;
  title: string;
  description: string;
  keywords?: string[];
  receiveSlug?: boolean;
  isFree?: boolean;
  seoConfig?: SEOConfig;
  load: () => Promise<any>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(toolsRegistry).map((slug) => ({
    slug,
  }));
}

function getToolData(slug: string): ExtendedTool | undefined {
  return toolsRegistry[slug as keyof typeof toolsRegistry] as ExtendedTool | undefined;
}

function getPageUrl(slug: string) {
  return `https://liebess.com/${slug}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolData(slug);

  if (!tool) {
    return {
      title: {
        absolute: "Page Not Found | Liebess",
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const seo = tool.seoConfig;
  const title = seo?.metaTitle || tool.title;
  const description = seo?.metaDescription || tool.description;
  const keywords = seo?.keywords || tool.keywords;
  const url = getPageUrl(slug);

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

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolData(slug);

  if (!tool) {
    notFound();
  }

  const seo = tool.seoConfig;
  const title = seo?.metaTitle || tool.title;
  const description = seo?.metaDescription || tool.description;
  const keywords = seo?.keywords || tool.keywords || [];
  const url = getPageUrl(slug);

  const faqs = seo?.faqs || [];
  const article = seo?.article;

  // Universal JSON-LD Schema
  const schemaGraph: Record<string, any>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      "url": url,
      "name": title,
      "description": description,
      "isPartOf": {
        "@id": "https://liebess.com/#website",
      },
      "mainEntity": {
        "@id": `${url}#webapp`,
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${url}#webapp`,
      "name": title,
      "description": description,
      "url": url,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript enabled",
      ...(tool.isFree === true && { "isAccessibleForFree": true }),
      ...(keywords.length > 0 && { "keywords": keywords.join(", ") }),
    },
  ];

  // FAQ Schema - Only when FAQ exists
  if (faqs.length > 0) {
    schemaGraph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      "url": url,
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    });
  }

  // Article Schema - Only when article exists
  if (article && article.title && article.sections && article.sections.length > 0) {
    schemaGraph.push({
      "@type": "Article",
      "@id": `${url}#article`,
      "headline": article.title,
      "description": description,
      "url": url,
      "mainEntityOfPage": {
        "@id": `${url}#webpage`,
      },
      "author": {
        "@type": "Organization",
        "name": "Liebess",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Liebess",
        "url": "https://liebess.com/",
      },
      "articleBody": article.sections
        .map((section) => `${section.heading}\n${section.content}`)
        .join("\n\n"),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": schemaGraph,
  };

  // Safely serialize JSON-LD
  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  // Dynamic Tool Import with Proper Typecasting
  const ToolComponent = dynamic(tool.load as any, {
    loading: () => (
      <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
    ),
  }) as ComponentType<{ slug?: string }>;

  const receivesSlug = tool.receiveSlug === true;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      {receivesSlug ? <ToolComponent slug={slug} /> : <ToolComponent />}
    </main>
  );
}
