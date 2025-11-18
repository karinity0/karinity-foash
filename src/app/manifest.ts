import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KARINITY & FOASH - Creative Digital Agency",
    short_name: "KARINITY FOASH",
    description:
      "Award-winning creative agency specializing in web design & development, mobile app development, branding, and digital solutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/kafo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/kafo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "design", "technology"],
    lang: "en-US",
    dir: "ltr",
  };
}
