import type React from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Playfair_Display, Cinzel } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
  title:
    "V Design - Premium Architecture & Interior Design Studio | Pune, India",
  description:
    "V Design is a leading architecture and interior design studio in Pune, India. Led by Ar. Virali Dias, we specialize in luxury residential and commercial design, creating timeless spaces that blend functionality with aesthetic excellence. Get free consultation for your dream space.",
  keywords:
    "architecture studio Pune, interior design Pune, luxury interior design, residential design, commercial design, Virali Dias architect, V Design studio, modern architecture, sustainable design, space planning, 3D visualization, construction supervision, furniture design, lighting design, home renovation Pune, office interior design, villa design, apartment interior design, premium interior designer Pune, best architect Pune",
  authors: [{ name: "V Design Studio", url: "https://www.vdesignbyvirali.in" }],
  creator: " Virali Dias",
  publisher: " Virali Dias",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.vdesignbyvirali.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "V Design - Premium Architecture & Interior Design Studio | Pune",
    description:
      "Transform your space with V Design's premium architecture and interior design services in Pune. Led by Ar. Virali Dias, we create timeless spaces through architectural excellence and interior innovation. Free consultation available.",
    url: "https://www.vdesignbyvirali.in",
    siteName: "V Design Studio",
    images: [
      {
        url: "/images/about-background.jpg",
        width: 1200,
        height: 630,
        alt: "V Design Studio - Premium Architecture and Interior Design in Pune",
      },
      {
        url: "/images/v-design-logo.png",
        width: 1200,
        height: 630,
        alt: "V Design Studio Logo - Architecture and Interior Design",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "V Design - Premium Architecture & Interior Design Studio | Pune",
    description:
      "Transform your space with V Design's premium architecture and interior design services in Pune. Led by Ar. Virali Dias.",
    images: ["/images/about-background.jpg"],
    creator: "@vdesignstudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual Google verification code
  },
  category: "Architecture & Interior Design",
  classification: "Business",
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Pune, Maharashtra, India",
    "geo.position": "18.5204;73.8567",
    ICBM: "18.5204, 73.8567",
  },
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
        <link rel="canonical" href="https://www.vdesignbyvirali.in" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#365545" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="V Design Studio" />
        <meta name="application-name" content="V Design Studio" />
        <meta name="msapplication-TileColor" content="#365545" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Additional Social Media Meta Tags */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta
          property="og:image:secure_url"
          content="https://www.vdesignbyvirali.in/images/about-background.jpg"
        />

        {/* WhatsApp and other social platforms */}
        <meta
          property="og:image:alt"
          content="V Design Studio - Premium Architecture and Interior Design in Pune"
        />
        <meta
          name="twitter:image:alt"
          content="V Design Studio - Premium Architecture and Interior Design in Pune"
        />

        {/* LinkedIn specific */}
        <meta
          property="og:image"
          content="https://www.vdesignbyvirali.in/images/about-background.jpg"
        />

        {/* Facebook specific */}
        <meta property="fb:app_id" content="" />

        {/* Pinterest */}
        <meta name="pinterest-rich-pin" content="true" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ArchitectureFirm",
              name: "V Design Studio",
              description:
                "Premium architecture and interior design studio in Pune, India",
              url: "https://www.vdesignbyvirali.in",
              logo: "https://www.vdesignbyvirali.in/images/v-design-logo.png",
              image: "https://www.vdesignbyvirali.in/images/v-design-logo.png",
              telephone: "+91-97644 47006",
              email: "virali.vdesign@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Pune, Maharashtra",
                addressLocality: "Pune",
                addressRegion: "Maharashtra",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 18.5204,
                longitude: 73.8567,
              },
              openingHours: "Mo-Fr 09:00-18:00",
              priceRange: "₹₹₹",
              currenciesAccepted: "INR",
              paymentAccepted: "Cash, Credit Card, Bank Transfer",
              areaServed: {
                "@type": "City",
                name: "Pune",
              },
              serviceArea: {
                "@type": "City",
                name: "Pune",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Architecture & Interior Design Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Residential Interior Design",
                      description:
                        "Transform your home into a personalized sanctuary",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Architectural Design",
                      description:
                        "Complete architectural solutions from concept to construction",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Commercial Interior Design",
                      description:
                        "Create inspiring workspaces that enhance productivity",
                    },
                  },
                ],
              },
              founder: {
                "@type": "Person",
                name: "Ar. Virali Dias",
                jobTitle: "Founder & Principal Architect",
                description:
                  "Leading architect with expertise in luxury residential and commercial design",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5.0",
                reviewCount: "15",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {children}

        <Toaster />
      </body>
    </html>
  );
}
