export const metadata = {
  title: "Gunmetal Dream - Project Case Study | KARINITY & FOASH",
  description:
    "A visual narrative set in a metallic dreamscape. Gunmetal Dream explores the tension between machine and memory where emotion flickers inside engineered perfection. 3D Design and Motion by Polite Chaos.",
  keywords:
    "case study, project details, digital art, 3D design, motion design, visual narrative, creative project",
  openGraph: {
    title: "Gunmetal Dream - Project Case Study | KARINITY & FOASH",
    description:
      "A visual narrative exploring the tension between machine and memory. 3D Design and Motion project by Polite Chaos.",
    images: ["/project/sample-project-1.jpg"],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gunmetal Dream - Project Case Study",
    description:
      "A visual narrative exploring the tension between machine and memory.",
    images: ["/project/sample-project-1.jpg"],
  },
};

export default function SampleProjectLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Gunmetal Dream",
    description:
      "A visual narrative set in a metallic dreamscape, exploring the tension between machine and memory",
    image: "/project/sample-project-1.jpg",
    creator: {
      "@type": "Organization",
      name: "Polite Chaos",
    },
    dateCreated: "2025",
    genre: "Digital Art Series",
    artMedium: "3D Design and Motion",
    artform: "Digital Art",
    abstract:
      "Gunmetal Dream explores the tension between machine and memory where emotion flickers inside engineered perfection",
    url: "https://www.karinity-foash.com/sample-project",
    isPartOf: {
      "@type": "WebSite",
      name: "KARINITY & FOASH",
      url: "https://www.karinity-foash.com",
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
