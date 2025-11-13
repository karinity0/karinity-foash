export const metadata = {
  title: "About Our Studio | KARINITY & FOASH",
  description:
    "Meet the creative team behind KARINITY & FOASH. We are polite, we are chaos. A digital creative studio crafting motion worlds and dream engineering through art and technology.",
  keywords:
    "about us, creative studio, design team, digital agency team, creative professionals, agency culture, studio team",
  openGraph: {
    title: "About Our Studio | KARINITY & FOASH",
    description:
      "Meet the creative team behind KARINITY & FOASH. We blend art and technology to create visuals that move both on screen and in emotion.",
    images: ["/studio/studio-header.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Our Studio | KARINITY & FOASH",
    description:
      "Meet the creative team behind KARINITY & FOASH. We blend art and technology to create visuals that move both on screen and in emotion.",
    images: ["/studio/studio-header.jpg"],
  },
};

export default function StudioLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Our Studio",
    description:
      "Polite Chaos is a creative studio shaping digital worlds through motion, color, and story",
    url: "https://www.karinity-foash.com/studio",
    mainEntity: {
      "@type": "Organization",
      name: "KARINITY & FOASH",
      description:
        "A creative studio shaping digital worlds through motion, color, and story. We blend art and technology to create visuals that move not only on screen but in emotion.",
      slogan: "We are polite. We are chaos.",
      knowsAbout: [
        "Web Design",
        "Web Development",
        "Motion Design",
        "3D Design",
        "Digital Art",
        "Branding",
        "Creative Direction",
      ],
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

