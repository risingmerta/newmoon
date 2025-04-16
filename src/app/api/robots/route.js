export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const sitemaps = Array.from({ length: 10 }, (_, i) => 
    `Sitemap: ${baseUrl}/api/anime/sitemap${i + 1}`
  ).join("\n");

  const robotsTxt = `
User-agent: *
Allow: /
Disallow: /sign-in
Disallow: /sign-up
Disallow: /random

Sitemap: ${baseUrl}/api/anime/sitemap
${sitemaps}
  `.trim();

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
 