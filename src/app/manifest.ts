import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "최민기 — Mingi Choe",
    short_name: "최민기",
    description: "프로덕트 엔지니어 최민기의 글",
    start_url: "/",
    display: "standalone",
    background_color: "#111110",
    theme_color: "#111110",
    icons: [
      { src: "/icon/small", sizes: "64x64", type: "image/png" },
      { src: "/icon/medium", sizes: "192x192", type: "image/png" },
      {
        src: "/icon/large",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
