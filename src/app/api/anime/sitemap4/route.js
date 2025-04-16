import { NextResponse } from "next/server";

const apiUrl = "https://vimal.animoon.me/api/az-list?page=";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Helper function to retry fetch
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

// Get total number of pages
const getTotalPages = async () => {
  const data = await retryFetch(apiUrl + "1");
  return data.results.totalPages;
};

// Fetch a single page and return URLs
const fetchPage = async (page) => {
  const data = await retryFetch(apiUrl + page);
  const urls = [];
  const dataList = data.results.data;

  dataList.forEach((item) => {
    urls.push(`${baseUrl}/${item.id}`);
  });

  return urls;
};

// Fetch all URLs from a range of pages
const fetchAllUrls = async () => {
  let allUrls = [];
  const totalPages = await getTotalPages();

  for (let page = 80; page <= totalPages && page <= 100; page++) {
    try {
      const pageUrls = await fetchPage(page);
      allUrls = allUrls.concat(pageUrls);
      console.log(`Fetched and processed page ${page}`);
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    }
  }

  return allUrls;
};

// Escape special characters for XML
const escapeXml = (url) => {
  return url
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

// Generate sitemap XML
const generateSitemap = (urls) => {
  const lastModifiedDate = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>  
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">  
  ${urls
    .map((url) => {
      const escapedUrl = escapeXml(url);
      return `
  <url>
    <loc>${escapedUrl}</loc>
    <lastmod>${lastModifiedDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join("")}  
</urlset>`;
};

// API Route handler
export async function GET() {
  try {
    const urls = await fetchAllUrls();
    const allUrls = [...urls];

    const sitemap = generateSitemap(allUrls);

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml", // ✅ Critical header for Google
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
