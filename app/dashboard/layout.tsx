import type { Metadata } from "next";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "Recipe Scaling Engine",
  description: "ספר מתכונים חכם עם אלגוריתמי scaling מתקדמים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}