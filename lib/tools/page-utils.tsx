
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ToolDefinition } from "./types";

const BASE_URL = "https://liebess.com";

type ToolComponentProps = {
  slug?: string;
};

export function createToolMetadata(
  tool: ToolDefinition,
  slug: string,
  locale: string
): Metadata {
  const seo = tool.seoConfig;
  const title = seo?.metaTitle || tool.title;
  const description = seo?.metaDescription || tool.description;

  const url = `${BASE_URL}/${locale === "en" ? "" : `${locale}/`}${slug}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: { absolute: title },
    description,
    keywords: seo?.keywords || tool.keywords,
    authors: [{ name: "Liebess" }],
    publisher: "Liebess",

    alternates: {
      canonical: url,
      ...(seo?.hreflang && {
        languages: seo.hreflang,
      }),
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
      locale:
        locale === "de"
          ? "de_DE"
          : locale === "fr"
            ? "fr_FR"
            : locale === "es"
              ? "es_ES"
              : locale === "ar"
                ? "ar_SA"
                : "en_US",
    },

    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function ToolRenderer({
  tool,
  slug,
  locale,
}: {
  tool: ToolDefinition;
  slug: string;
  locale: string;
}) {
  const ToolComponent = dynamic<ToolComponentProps>(
    async () => {
      const module = await tool.load();
      return module.default as ComponentType<ToolComponentProps>;
    },
    {
      loading: () => (
        <div style={{ textAlign: "center", padding: 40 }}>
          Loading...
        </div>
      ),
    }
  );

  const seo = tool.seoConfig;
  const title = seo?.metaTitle || tool.title;
  const description = seo?.metaDescription || tool.description;
  const keywords = seo?.keywords || tool.keywords || [];

  const url = `${BASE_URL}/${locale === "en" ? "" : `${locale}/`}${slug}`;

  const faqs = seo?.faqs || [];
  const article = seo?.article;

  const graph: Record<string, any>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: {
        "@id": `${BASE_URL}/#website`,
      },
      mainEntity: {
        "@id": `${url}#webapp`,
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${url}#webapp`,
      name: title,
      description,
      url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript enabled",

      ...(tool.isFree === true && {
        isAccessibleForFree: true,
      }),

      ...(keywords.length > 0 && {
        keywords: keywords.join(", "),
      }),
    },
  ];

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      url,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  if (article?.title && article.sections?.length) {
    graph.push({
      "@type": "Article",
      "@id": `${url}#article`,
      headline: article.title,
      description,
      url,
      mainEntityOfPage: {
        "@id": `${url}#webpage`,
      },
      author: {
        "@type": "Organization",
        name: "Liebess",
      },
      publisher: {
        "@type": "Organization",
        name: "Liebess",
        url: `${BASE_URL}/`,
      },
      articleBody: article.sections
        .map((section) => `${section.heading}\n${section.content}`)
        .join("\n\n"),
    });
  }

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {tool.receiveSlug === true ? (
        <ToolComponent slug={slug} />
      ) : (
        <ToolComponent />
      )}
    </>
  );
}
