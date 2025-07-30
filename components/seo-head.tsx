"use client";

import Head from "next/head";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

export function SEOHead({
  title = "V Design - Premium Architecture & Interior Design Studio | Pune, India",
  description = "V Design is a leading architecture and interior design studio in Pune, India. Led by Ar. Virali Dias, we specialize in luxury residential and commercial design, creating timeless spaces that blend functionality with aesthetic excellence.",
  keywords = "architecture studio Pune, interior design Pune, luxury interior design, residential design, commercial design, Virali Dias architect, V Design studio, modern architecture, sustainable design, space planning, 3D visualization, construction supervision, furniture design, lighting design, home renovation Pune, office interior design, villa design, apartment interior design, premium interior designer Pune, best architect Pune",
  ogImage = "/images/v-design-logo.png",
  canonical = "https://www.vdesignbyvirali.in",
  noIndex = false,
}: SEOHeadProps) {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="V Design Studio" />
      <meta
        name="robots"
        content={noIndex ? "noindex,nofollow" : "index,follow"}
      />
      <meta
        name="googlebot"
        content={noIndex ? "noindex,nofollow" : "index,follow"}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta
        property="og:image"
        content={`https://www.vdesignbyvirali.in${ogImage}`}
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="V Design Studio - Architecture and Interior Design"
      />
      <meta property="og:site_name" content="V Design Studio" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={`https://www.vdesignbyvirali.in${ogImage}`}
      />
      <meta name="twitter:creator" content="@vdesignstudio" />

      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#365545" />
      <meta name="msapplication-TileColor" content="#365545" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="V Design Studio" />

      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Pune, Maharashtra, India" />
      <meta name="geo.position" content="18.5204;73.8567" />
      <meta name="ICBM" content="18.5204, 73.8567" />

      {/* Business Meta Tags */}
      <meta
        name="business:contact_data:street_address"
        content="Pune, Maharashtra"
      />
      <meta name="business:contact_data:locality" content="Pune" />
      <meta name="business:contact_data:region" content="Maharashtra" />
      <meta name="business:contact_data:postal_code" content="411001" />
      <meta name="business:contact_data:country_name" content="India" />
      <meta
        name="business:contact_data:phone_number"
        content="+91-97644 47006"
      />
      <meta
        name="business:contact_data:email"
        content="virali.vdesign@gmail.com"
      />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com"
      />

      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link
        rel="dns-prefetch"
        href="//hebbkx1anhila5yf.public.blob.vercel-storage.com"
      />

      {/* Structured Data for Local Business */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
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
              postalCode: "411001",
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
    </Head>
  );
}
