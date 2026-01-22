import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export const metadata: Metadata = {
  title: "Recipe Scaling Engine",
  description: "Smart recipe scaling system with advanced algorithms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
              <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
