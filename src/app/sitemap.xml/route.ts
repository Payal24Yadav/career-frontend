export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  let blogSlugs: string[] = [];
  try {
    const res = await fetch(`${apiUrl}/blogs?limit=100`);
    const data = await res.json();
    blogSlugs = data.data?.map((b: any) => b.slug) || [];
  } catch {}

  const staticPages = ["", "/about", "/blog", "/jobs", "/colleges", "/contact", "/inquiry", "/partner"];

  const urls = [
    ...staticPages.map((page) => `<url><loc>${baseUrl}${page}</loc><changefreq>weekly</changefreq><priority>${page === "" ? "1.0" : "0.8"}</priority></url>`),
    ...blogSlugs.map((slug: string) => `<url><loc>${baseUrl}/blog/${slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
