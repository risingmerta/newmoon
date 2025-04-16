import { NextResponse } from "next/server";

const apiUrl = "https://vimal.animoon.me/api/az-list?page=";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const retryFetch = async (url, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Fetch attempt ${i + 1} failed for ${url}:`, error);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

const getTotalPages = async () => {
  const data = await retryFetch(apiUrl + "1");
  return data.results.totalPages;
};

const fetchAllUrls = async () => {
  const allUrls = [];
  const totalPages = await getTotalPages();

  for (let page = 1; page <= totalPages && page <= 20; page++) {
    try {
      const data = await retryFetch(apiUrl + page);
      const dataList = data.results.data;

      dataList.forEach((item) => {
        allUrls.push(`${baseUrl}/${item.id}`);
      });

      console.log(`Fetched and processed page ${page}`);
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    }
  }

  return allUrls;
};

const escapeXml = (url) => {
  return url
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const generateSitemap = (urls) => {
  const lastModifiedDate = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => {
    const escapedUrl = escapeXml(url);
    return `<url>
  <loc>${escapedUrl}</loc>
  <lastmod>${lastModifiedDate}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>`;
  })
  .join("\n")}
</urlset>`;
};

const genreUrls = () => {
  const genres = [
    "Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", "Drama", "Ecchi", "Fantasy", "Game",
    "Harem", "Historical", "Horror", "Isekai", "Josei", "Kids", "Magic", "Martial Arts", "Mecha", "Military",
    "Music", "Mystery", "Parody", "Police", "Psychological", "Romance", "Samurai", "School", "Sci-Fi",
    "Seinen", "Shoujo", "Shoujo Ai", "Shounen", "Shounen Ai", "Slice of Life", "Space", "Sports",
    "Super Power", "Supernatural", "Thriller", "Vampire"
  ];

  return genres.map((genre) => `${baseUrl}/genre?id=${genre}&name=${genre}`);
};

const categoryUrls = () => {
  const categories = [
    "most-favorite", "most-popular", "subbed-anime", "dubbed-anime", "recently-updated", "recently-added",
    "top-upcoming", "top-airing", "movie", "special", "ova", "ona", "tv", "completed"
  ];

  return categories.map((category) => {
    const heading = category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return `${baseUrl}/grid?name=${category}&heading=${heading}`;
  });
};

export async function GET() {
  try {
    const urls = await fetchAllUrls();
    const genreUrlsList = genreUrls();
    const categoryUrlsList = categoryUrls();
    const allUrls = [baseUrl, ...urls, ...genreUrlsList, ...categoryUrlsList];

    const sitemap = generateSitemap(allUrls);

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
