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

// Fetch a single page of data
const fetchPage = async (page) => {
  const data = await retryFetch(apiUrl + page); // Use retryFetch to handle errors
  const urls = [];
  const dataList = data.results.data;

  dataList.forEach((item) => {
    urls.push(`${baseUrl}/${item.id}`);
  });

  return urls; // Return the collected URLs for this page
};

// Fetch data from all pages one by one
const fetchAllUrls = async () => {
  let allUrls = [];
  const totalPages = await getTotalPages(); // Dynamically get total number of pages

  // Loop through each page one by one
  for (let page = 80; page <= totalPages && page <= 100; page++) {
    try {
      const pageUrls = await fetchPage(page); // Fetch a single page
      allUrls = allUrls.concat(pageUrls); // Concatenate the URLs from the page
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

// API Route handler for sitemap export
export async function GET(req) {
  try {
    const host = req.headers.get("host"); // Get the current domain
    const protocol = host.includes("localhost") ? "http" : "https"; // Use HTTPS unless running locally
    const baseUrl = `${protocol}://${host}`; // Construct the dynamic base URL

    const urls = await fetchAllUrls(); // Fetch all URLs from pages
    const allUrls = urls.map((url) => url.replace("https://animoon.me", baseUrl)); // Adjust URLs dynamically

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

