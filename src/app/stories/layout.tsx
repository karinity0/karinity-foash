import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Stories & Insights | KARINITY & FOASH",
  description:
    "Explore creative stories, insights, and behind-the-scenes content from KARINITY & FOASH. Discover our creative process, project stories, and digital design inspiration.",
  keywords:
    "design stories, creative insights, design process, project stories, creative blog, design inspiration, behind the scenes",
  openGraph: {
    title: "Stories & Insights | KARINITY & FOASH",
    description:
      "Explore creative stories, insights, and behind-the-scenes content from KARINITY & FOASH.",
    images: ["/stories/story-1.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stories & Insights | KARINITY & FOASH",
    description:
      "Explore creative stories, insights, and behind-the-scenes content from KARINITY & FOASH.",
    images: ["/stories/story-1.jpg"],
  },
};

export default function StoriesLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Stories & Insights",
    description:
      "Creative stories and insights from KARINITY & FOASH creative studio",
    url: "https://www.karinity-foash.com/stories",
    publisher: {
      "@type": "Organization",
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

