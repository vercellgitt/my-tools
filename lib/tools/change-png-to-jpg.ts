import { changePngToJpgConfig } from "@/components/tools/change-png-to-jpg/faq";

const loadPngToJpgTool = () =>
  import("@/components/tools/change-png-to-jpg/change-png-to-jpg");

const createPngToJpgTool = (slug: string) => {
  const config = changePngToJpgConfig[slug];

  return {
    slug,
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords,
    receiveSlug: true,
    load: loadPngToJpgTool,
  };
};

export const changePngToJpgTools = {
  "format-png-to-jpg": createPngToJpgTool("format-png-to-jpg"),

  "change-png-to-jpg": createPngToJpgTool("change-png-to-jpg"),

  "png-to-jpg-convert-online": createPngToJpgTool(
    "png-to-jpg-convert-online"
  ),

  "photo-png-to-jpg-convert": createPngToJpgTool(
    "photo-png-to-jpg-convert"
  ),
};

export type ChangePngToJpgSlug =
  keyof typeof changePngToJpgTools;