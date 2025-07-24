import type React from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Playfair_Display, Cinzel } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "V Design - Architecture & Interior Design Studio | Pune",
  description:
    "V Design is a premium architecture and interior design studio based in Pune, India. Led by Ar. Virali Dias, we create timeless spaces through architectural excellence and interior innovation.",
  keywords:
    "architecture, interior design, Pune, Virali Dias, luxury interiors, residential design, commercial design",
  authors: [{ name: "V Design Studio" }],
  openGraph: {
    title: "V Design - Architecture & Interior Design Studio",
    description:
      "Crafting timeless spaces through architectural excellence & interior innovation in Pune, India.",
    type: "website",
    locale: "en_IN",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${cinzel.variable}`}
    >
      <head>
        <link rel="icon" href="/images/v-design-logo.png" type="image/png" />
      </head>
      <body className="antialiased">
        {children}

        <Toaster />
      </body>
    </html>
  );
}
