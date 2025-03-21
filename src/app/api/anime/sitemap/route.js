import { NextResponse } from "next/server";

const apiUrl = "https://vimal.animoon.me/api/az-list?page=";
const baseUrl = "https://animoon.me";

// Helper function for retrying fetch in case of error
const retryFetch = async (url, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }
      return await response.json(); // Return the parsed JSON if successful
    } catch (error) {
      console.error(`Fetch attempt ${i + 1} failed for ${url}:`, error);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
      } else {
        throw error; // Rethrow error after final retry
      }
    }
  }
};

// Fetch total number of pages from the first request
const getTotalPages = async () => {
  const data = await retryFetch(apiUrl + "1"); // Fetch the first page with retry logic
  return data.results.totalPages; // Return the total number of pages
};

// Fetch data from all pages one by one
const fetchAllUrls = async () => {
  let allUrls = [];
  const totalPages = await getTotalPages(); // Dynamically get total number of pages

  for (let page = 1; page <= totalPages && page <= 20; page++) {
    try {
      // Fetch one page at a time with retry logic
      const data = await retryFetch(apiUrl + page);
      const dataList = data.results.data;

      // Process each item's data
      dataList.forEach((item) => {
        allUrls.push(`${baseUrl}/${item.id}`);
      });

      console.log(`Fetched and processed page ${page}`);
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    }
  }

  return allUrls; // Return all URLs after fetching all pages
};

// Helper function to escape XML characters
const escapeXml = (url) => {
  return url
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

// Generate XML for the sitemap
const generateSitemap = (urls) => {
  const lastModifiedDate = new Date().toISOString(); // Get the current date in ISO format
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map((url) => {
        const escapedUrl = escapeXml(url); // Escape the URL before adding it to the XML
        return `
        <url>
          <loc>${escapedUrl}</loc>
          <lastmod>${lastModifiedDate}</lastmod> <!-- Add lastmod element -->
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `;
      })
      .join("")}
  </urlset>`;
};

// Fetch URLs for genres
const genreUrls = () => {
  const genres = [
    "Action",
    "Adventure",
    "Cars",
    "Comedy",
    "Dementia",
    "Demons",
    "Drama",
    "Ecchi",
    "Fantasy",
    "Game",
    "Harem",
    "Historical",
    "Horror",
    "Isekai",
    "Josei",
    "Kids",
    "Magic",
    "Martial Arts",
    "Mecha",
    "Military",
    "Music",
    "Mystery",
    "Parody",
    "Police",
    "Psychological",
    "Romance",
    "Samurai",
    "School",
    "Sci-Fi",
    "Seinen",
    "Shoujo",
    "Shoujo Ai",
    "Shounen",
    "Shounen Ai",
    "Slice of Life",
    "Space",
    "Sports",
    "Super Power",
    "Supernatural",
    "Thriller",
    "Vampire",
  ];

  return genres.map((genre) => `${baseUrl}/genre?id=${genre}&name=${genre}`);
};

// Fetch URLs for categories
const categoryUrls = () => {
  const categories = [
    "most-favorite",
    "most-popular",
    "subbed-anime",
    "dubbed-anime",
    "recently-updated",
    "recently-added",
    "top-upcoming",
    "top-airing",
    "movie",
    "special",
    "ova",
    "ona",
    "tv",
    "completed",
  ];

  return categories.map(
    (category) =>
      `${baseUrl}/grid?name=${category}&heading=${category
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())}`
  );
};

// API Route handler for sitemap
export async function GET(req) {
  try {
    const host = req.headers.get("host"); // Get the current domain
    const protocol = host.includes("localhost") ? "http" : "https"; // Use HTTPS unless running locally
    const baseUrl = `${protocol}://${host}`; // Construct the dynamic base URL

    const urls = await fetchAllUrls(); // Fetch all URLs from pages
    const genreUrlsList = genreUrls().map((url) => url.replace("https://animoon.me", baseUrl)); // Adjust genre URLs
    const categoryUrlsList = categoryUrls().map((url) => url.replace("https://animoon.me", baseUrl)); // Adjust category URLs
    const allUrls = [baseUrl, ...urls.map((url) => url.replace("https://animoon.me", baseUrl)), ...genreUrlsList, ...categoryUrlsList];

    const sitemap = generateSitemap(allUrls); // Generate the sitemap with all URLs

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}

