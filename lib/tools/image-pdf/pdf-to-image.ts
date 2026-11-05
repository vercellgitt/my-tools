export const pdfToImage = {
  slug: "pdf-to-image",
  title: "PDF to Image Converter - Convert PDF Pages to JPG, PNG & WEBP Online",
  description: "Easily convert PDF pages into high-quality JPG, PNG, or WEBP images online. Select specific pages, adjust DPI resolution, and download individually or as a ZIP archive.",
  keywords: ["pdf to image", "convert pdf to jpg", "pdf to png converter", "pdf to webp", "extract images from pdf"],
  load: () =>
    import("@/components/tools/pdf/pdf-to-image/pdf-to-image"),
};