export const metadata = {
  title: "Our Work - Portfolio | KARINITY & FOASH",
  description:
    "Explore our portfolio of creative projects including web design, mobile apps, and digital experiences. View case studies from our award-winning work at KARINITY & FOASH creative agency.",
  keywords:
    "portfolio, web design portfolio, creative work, case studies, design projects, branding work, app design examples, UI/UX portfolio",
  openGraph: {
    title: "Our Work - Creative Portfolio | KARINITY & FOASH",
    description:
      "Explore our portfolio of creative projects including web design, mobile apps, and digital experiences.",
    images: ["/work/work_1_1.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work - Creative Portfolio | KARINITY & FOASH",
    description:
      "Explore our portfolio of creative projects including web design, mobile apps, and digital experiences.",
    images: ["/work/work_1_1.jpg"],
  },
};

export default function WorkLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Our Work - Portfolio",
    description:
      "Portfolio showcasing our creative projects and digital experiences",
    url: "https://www.karinity-foash.com/work",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "CreativeWork",
          position: 1,
          name: "Citychild",
          image: "/work/work_1_1.jpg",
        },
        {
          "@type": "CreativeWork",
          position: 2,
          name: "Chrome Saint",
          image: "/work/work_2_1.jpg",
        },
        {
          "@type": "CreativeWork",
          position: 3,
          name: "G-Dream",
          image: "/work/work_3_1.jpg",
        },
        {
          "@type": "CreativeWork",
          position: 4,
          name: "Stoneface",
          image: "/work/work_4_1.jpg",
        },
        {
          "@type": "CreativeWork",
          position: 5,
          name: "Amber Cloak",
          image: "/work/work_5_1.jpg",
        },
        {
          "@type": "CreativeWork",
          position: 6,
          name: "Paper Blade",
          image: "/work/work_6_1.jpg",
        },
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

