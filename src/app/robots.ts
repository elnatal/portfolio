import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/projects/"],
        disallow: ["/admin/", "/admin", "/login", "/api/"],
      },
    ],
    sitemap: "https://elnatal.com/sitemap.xml",
    host: "https://elnatal.com",
  };
}
