import Advertize from "@/component/Advertize/Advertize";
import GenreSidebar from "@/component/Gridle/page";
import { connectDB } from "@/lib/mongoClient"; // Import connectDB
import Script from "next/script";
import React from "react";

export async function generateMetadata({ searchParams }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing
  const searchParam = await searchParams;
  const idd = searchParam.heading || "Anime"; // Default fallback for heading

  return {
    title: `Watch ${idd} Anime English Sub/Dub online free on ${siteName}`,
    description: `${siteName} is the best site to watch ${idd} Anime SUB online, or you can even watch ${idd} Anime DUB in HD quality. You can also watch underrated anime on ${siteName} website.`,
  };
}

export default async function page({ searchParams }) {
  const searchParam = await searchParams;
  const cate = searchParam.name?.toString() || "default-category"; // Default value fallback
  const fiki = searchParam.heading?.toString() || "Anime"; // Default fallback for heading
  const pageParam = searchParam.page ? searchParam.page : "1"; // Default page is 1
  const cacheMaxAge = 345600; // Cache for 4 days (in seconds)

  const homeCollectionName = "animoon-home";
  const gridCollectionName = cate;

  let data;
  let existingAnime = [];
  let count;

  try {
    // Connect to MongoDB using the connectDB function
    const client = await connectDB;
    console.log("Connected to MongoDB");

    const db = client.db("mydatabase");

    // Fetch homepage data from MongoDB
    const homeCollection = db.collection(homeCollectionName.trim());
    const document = await homeCollection.findOne({}); // Adjust query as needed

    if (document) {
      data = document;
    } else {
      console.log("No homepage data found in MongoDB");
    }

    // If homepage data is missing, fetch from API
    if (!data) {
      const res = await fetch("https://vimal.animoon.me/api/");
      data = await res.json();
    }

    // Fetch anime data for the selected category (gridCollectionName) and page
    const animeCollection = db.collection(gridCollectionName.trim());
    existingAnime = await animeCollection.findOne({
      page: parseInt(pageParam),
    });

    if (existingAnime) {
      existingAnime = JSON.parse(JSON.stringify(existingAnime)); // Convert BSON to plain object
    }

    // Get the total count of documents in the category collection
    count = await db.collection(gridCollectionName.trim()).countDocuments();
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  }

  // Construct the shareable URL for this category and page
  const ShareUrl = `https://animoon.me/grid?name=${cate}&heading=${fiki}`;
  const arise = `${fiki} Anime`;

  return (
    <div>
      {/* <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      /> */}
      <GenreSidebar
        data={existingAnime}
        fiki={fiki}
        cate={cate}
        datal={data}
        totalPages={count}
        ShareUrl={ShareUrl}
        page={pageParam}
        arise={arise}
      />
      {/* <Advertize /> */}
    </div>
  );
}
