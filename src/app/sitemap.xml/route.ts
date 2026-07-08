interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export async function GET() {
  const entries: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/menu", changefreq: "weekly", priority: "0.9" },
    { path: "/builder", changefreq: "monthly", priority: "0.8" },
    { path: "/cart", changefreq: "monthly", priority: "0.3" },
    { path: "/tracking", changefreq: "monthly", priority: "0.3" },
  ];

  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${process.env.NEXT_PUBLIC_APP_URL || ""}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
