import "./globals.css";
import ClientLayout from "@/client-layout";
import { ViewTransitions } from "next-view-transitions";

const siteUrl = "https://www.karinity-foash.com"; // Update with your actual domain
const siteName = "KARINITY & FOASH";
const siteDescription =
  "Award-winning creative agency specializing in web design & development, mobile app development, branding, and digital solutions. Transform your vision into stunning digital experiences with KARINITY & FOASH.";
const keywords = [
  "creative agency",
  "web design",
  "web development",
  "mobile app development",
  "UI/UX design",
  "branding agency",
  "digital marketing",
  "graphic design",
  "app development",
  "responsive web design",
  "custom website development",
  "brand identity",
  "creative studio",
  "design agency",
  "digital agency",
  "software development",
  "logo design",
  "print design",
  "digital transformation",
  "creative solutions",
];

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Creative Digital Agency - Web & Mobile Development`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: keywords.join(", "),
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Icons
  icons: {
    icon: [
      { url: "/kafo.png" },
      { url: "/kafo.png", sizes: "192x192", type: "image/png" },
      { url: "/kafo.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/kafo.png",
    apple: [
      { url: "/kafo.png" },
      { url: "/kafo.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} | Creative Digital Agency - Web & Mobile Development`,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${siteName} - Creative Digital Agency`,
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Creative Digital Agency`,
    description: siteDescription,
    images: ["/opengraph-image.png"],
    creator: "@karinity_foash", // Update with your actual Twitter handle
    site: "@karinity_foash",
  },

  // Verification (add your verification codes)
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },

  // Alternate languages (add if you have multi-language support)
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
      // "es-ES": `${siteUrl}/es`,
      // "fr-FR": `${siteUrl}/fr`,
    },
  },

  // Additional metadata
  category: "technology",
  classification: "Business",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // App-specific
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "black-translucent",
  },

  // Other
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
  },
};

export default function RootLayout({ children }) {
  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/kafo.png`,
          width: 512,
          height: 512,
        },
        description: siteDescription,
        sameAs: [
          "https://twitter.com/karinity_foash", // Update with actual social links
          "https://www.linkedin.com/company/karinity-foash",
          "https://www.instagram.com/karinity_foash",
          "https://www.facebook.com/karinity.foash",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          availableLanguage: ["English"],
        },
        areaServed: "Worldwide",
        brand: {
          "@type": "Brand",
          name: siteName,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/work?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#service`,
        name: siteName,
        image: `${siteUrl}/opengraph-image.png`,
        description: siteDescription,
        priceRange: "$$",
        telephone: "+1-XXX-XXX-XXXX", // Update with actual phone
        address: {
          "@type": "PostalAddress",
          addressCountry: "US", // Update with your country
          addressLocality: "Your City", // Update with your city
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 0.0, // Update with actual coordinates
          longitude: 0.0,
        },
        url: siteUrl,
        serviceType: [
          "Web Design",
          "Web Development",
          "Mobile App Development",
          "Branding",
          "Digital Marketing",
          "UI/UX Design",
          "Graphic Design",
          "Print Design",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Creative Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Web Design & Development",
                description:
                  "Custom website design and development with modern technologies",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Mobile App Development",
                description:
                  "Native and cross-platform mobile application development",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Branding & Design",
                description:
                  "Brand identity, logo design, and comprehensive visual systems",
              },
            },
          ],
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ViewTransitions>
          <ClientLayout>{children}</ClientLayout>
        </ViewTransitions>
      </body>
    </html>
  );
}
