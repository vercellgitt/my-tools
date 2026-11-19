export const photoImageResizer = {
  slug: "photo-image-resizer",
  title: "Photo Image Resizer Online — Free Photo & Image Resizer Tool",
  description:
    "Resize any photo or image online in your browser with our fast photo image resizer. Adjust pixel dimensions, aspect ratio, scale percentage, JPG, PNG, and WebP.",

  load: () =>
    import("@/components/tools/pdf/photo-image-resizer/photo-image-resizer"),
};