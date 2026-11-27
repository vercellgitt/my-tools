
import type { Metadata, Viewport } from "next";
import SiteShell from "@/components/layout/SiteShell";
import "../../components/layout/Base.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://liebess.com"),
  title: {
    default: "Liebess - Free Online Tools",
    template: "%s | Liebess",
  },
  description:
    "Use free online calculators and helpful tools with Liebess.",
  applicationName: "Liebess",
  robots: {
    index: true,
    follow: true,
  },
  other: {
  google: "notranslate",
},
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function EnglishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
