
import type { MetadataRoute } from "next";

import { toolsRegistry } from "@/lib/tools";
import { germanToolsRegistry } from "@/lib/tools/de";
import { frenchToolsRegistry } from "@/lib/tools/fr";
import { spanishToolsRegistry } from "@/lib/tools/es";
import { arabicToolsRegistry } from "@/lib/tools/ar";

export const dynamic = "force-static";

const BASE_URL = "https://liebess.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about-us",
    "/contact-us",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  const englishUrls = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
  }));

  const createLanguageUrls = (
    locale: string,
    registry: Record<string, unknown>
  ) =>
    Object.keys(registry).map((slug) => ({
      url: `${BASE_URL}/${locale}/${slug}`,
      lastModified: now,
    }));

  const englishToolUrls = Object.keys(toolsRegistry).map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: now,
  }));

  return [
    ...englishUrls,
    ...englishToolUrls,
    ...createLanguageUrls("de", germanToolsRegistry),
    ...createLanguageUrls("fr", frenchToolsRegistry),
    ...createLanguageUrls("es", spanishToolsRegistry),
    ...createLanguageUrls("ar", arabicToolsRegistry),
  ];
}
