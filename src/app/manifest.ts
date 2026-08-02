import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kruzo Document AI",
    short_name: "Kruzo",
    description: "Turn documents into Excel without manual data entry.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f2",
    theme_color: "#2563eb",
    icons: [{ src: "/kruzo-mark.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
