import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/app/components/LanguageProvider";
import PageSurface from "@/app/components/PageSurface";
import SiteChrome from "@/app/components/SiteChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Botman Design - Timeless Elegance",
  description:
    "Luxe interieurontwerp en architectuur voor tijdloze ruimtes die perfect aansluiten bij uw visie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${montserrat.variable} antialiased`}
      >
        <PageSurface />
        <LanguageProvider>
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
