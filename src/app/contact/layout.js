export const metadata = {
  title: "Contact Us - Let's Create Together | KARINITY & FOASH",
  description:
    "Get in touch with KARINITY & FOASH creative studio. Based in Old Harbour District, Oslo. Let's discuss your next digital project, motion world, or dream engineering needs.",
  keywords:
    "contact, get in touch, hire creative agency, project inquiry, creative consultation, studio contact, agency contact",
  openGraph: {
    title: "Contact Us - Let's Create Together | KARINITY & FOASH",
    description:
      "Get in touch with KARINITY & FOASH creative studio. Let's discuss your next digital project.",
    images: ["/opengraph-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | KARINITY & FOASH",
    description:
      "Get in touch with KARINITY & FOASH creative studio. Let's discuss your next digital project.",
    images: ["/opengraph-image.png"],
  },
};

export default function ContactLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Us",
    description: "Get in touch with KARINITY & FOASH creative studio",
    url: "https://www.karinity-foash.com/contact",
    mainEntity: {
      "@type": "Organization",
      name: "KARINITY & FOASH",
      email: "studio@politechaos.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Oslo",
        addressRegion: "Old Harbour District",
        addressCountry: "NO",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "studio@politechaos.com",
        contactType: "Customer Service",
        availableLanguage: ["English"],
      },
      areaServed: "Worldwide",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
