export async function GET(req) {
  const { headers } = req;
  const host = headers.get("host"); // Get the current domain dynamically

  const robotsTxt = `
  User-agent: *
  Allow: /
  Disallow: /sign-in
  Disallow: /sign-up
  Disallow: /random
  
  Sitemap: https://${host}/api/anime/sitemap
  Sitemap: https://${host}/api/anime/sitemap1
  Sitemap: https://${host}/api/anime/sitemap2
  Sitemap: https://${host}/api/anime/sitemap3
  Sitemap: https://${host}/api/anime/sitemap4
  Sitemap: https://${host}/api/anime/sitemap5
  Sitemap: https://${host}/api/anime/sitemap6
  Sitemap: https://${host}/api/anime/sitemap7
  Sitemap: https://${host}/api/anime/sitemap8
  Sitemap: https://${host}/api/anime/sitemap9
  Sitemap: https://${host}/api/anime/sitemap10
    `;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
