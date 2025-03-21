import Advertize from "@/component/Advertize/Advertize";
import GenreSidebar from "@/component/Gridle/page";
import { MongoClient } from "mongodb";
import React from "react";

export async function generateMetadata({ searchParams }) {
  const searchParam = await searchParams;
  const idd = searchParam.heading;

  return {
    title: `Watch ${idd} Anime English Sub/Dub online free on Animoon.me`,
    description: `Animoon is the best site to watch ${idd} Anime SUB online, or you can even watch ${idd} Anime DUB in HD quality. You can also watch under rated anime on Animoon website.`,
  };
}

export default async function page({ searchParams }) {
  const searchParam = await searchParams;
  const cate = searchParam.name?.toString() || "default-category"; // Default value fallback
  const fiki = searchParam.heading?.toString() || "Anime"; // Default fallback
  const pageParam = searchParam.page ? searchParam.page : "1";
  const cacheMaxAge = 345600; // Cache for 4 days (in seconds)

  const mongoUri =
    "mongodb://root:Imperial_king2004@145.223.118.168:27017/?authSource=admin";
  const dbName = "mydatabase";
  const homeCollectionName = "animoon-home";
  const gridCollectionName = cate;

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
    const animeCollection = db.collection(gridCollectionName.trim());
    existingAnime = await animeCollection.findOne({
      page: parseInt(pageParam),
    });

    if (existingAnime) {
      existingAnime = JSON.parse(JSON.stringify(existingAnime)); // Convert BSON to plain object
    }

    count = await db.collection(gridCollectionName.trim()).countDocuments();
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }

  // Constructing the shareable URL
  const ShareUrl = `https://animoon.me/grid?name=${cate}&heading=${fiki}`;
  const arise = `${fiki} Anime`;

  return (
    <div>
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
      <Advertize/>
    </div>
  );
}
