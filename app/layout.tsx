import type { Metadata, Viewport } from "next";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import "./../components/layout/Base.css";

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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <div className="site-main">{children}</div>
        <Footer />
      </body>
    </html>
  );
}