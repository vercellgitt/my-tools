
import type { Metadata } from "next";
import SiteShell from "@/components/layout/SiteShell";
import "../../components/layout/Base.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://liebess.com"),
  applicationName: "Liebess",
    other: {
  google: "notranslate",
},
};

export default function ArabicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
