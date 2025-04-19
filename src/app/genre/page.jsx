import Advertize from "@/component/Advertize/Advertize";
import GenreSidebar from "@/component/Gridle/page";
import { MongoClient } from "mongodb";
import Script from "next/script";
import React from "react";

export async function generateMetadata({ searchParams }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing
  const searchParam = await searchParams;
  const idd = searchParam.name || "Anime"; // Default fallback for name

  return {
    title: `Watch ${idd} Anime English Sub/Dub online free on ${siteName}`,
    description: `${siteName} is the best site to watch ${idd} Anime SUB online, or you can even watch ${idd} Anime DUB in HD quality. You can also watch underrated anime on ${siteName} website.`,
  };
}

export default async function page({ searchParams }) {
  const searchParam = await searchParams;
  const cate = searchParam.name?.toString() || "default-category"; // Ensure cate has a value
  const date = cate
    .replaceAll(" ", "-")
    .toLocaleLowerCase()
    .replace(/[^a-zA-Z0-9\-]/g, ""); // Clean up the category name for URL

  const pageParam = searchParam.page ? searchParam.page : "1";

  const mongoUri =
    "mongodb://animoon:Imperial_merta2030@127.0.0.1:27017/?authSource=admin";
  const dbName = "mydatabase";
  const homeCollectionName = "animoon-home";
  const genreCollectionName = "genre_" + cate;

  const client = new MongoClient(mongoUri);
  let data;
  let existingAnime = [];
  let count;

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Fetch homepage data
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

    // Check if anime from spotlights exists in the animeInfo collection
    const animeCollection = db.collection(genreCollectionName.trim());
    existingAnime = await animeCollection.findOne({
      page: parseInt(pageParam),
    });

    if (existingAnime) {
      existingAnime = JSON.parse(JSON.stringify(existingAnime)); // Convert BSON to plain object
    }

    count = await db.collection(genreCollectionName.trim()).countDocuments();
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }

  const cacheMaxAge = 345600; // Cache for 4 days (in seconds)

  // Fetch genre-specific anime list and homepage data concurrently
  // Constructing the shareable URL
  const ShareUrl = `https://animoon.me/genre?id=${cate}&name=${cate}`;
  const arise = `${cate} Anime`;

  return (
    <div>
      {/* <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      /> */}
      <GenreSidebar
        data={existingAnime}
        name={cate}
        cate={cate}
        datal={data}
        totalPages={count}
        genre={"yes"}
        ShareUrl={ShareUrl}
        page={pageParam}
        arise={arise}
      />
      {/* <Advertize /> */}
    </div>
  );
}
