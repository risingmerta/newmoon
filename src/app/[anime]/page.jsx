import React from "react";
import RecommendedTopTen from "../../layouts/RecommendedTopTen";
import { MongoClient } from "mongodb";
import Advertize from "@/component/Advertize/Advertize";
import Script from "next/script";

export async function generateMetadata({ params }) {
  const param = await params;
  const idToCheck = param.anime;

  const mongoUri =
    "mongodb://root:Imperial_king2004@145.223.118.168:27017/?authSource=admin";
  const dbName = "mydatabase";
  const homeCollectionName = "animoon-home";
  const animeCollectionName = "animeInfo";

  const client = new MongoClient(mongoUri);
  let data;
  let existingAnime = [];

  let datao = "";

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
    const animeCollection = db.collection(animeCollectionName.trim());
    existingAnime = await animeCollection.findOne({ _id: idToCheck });
    
    if (!existingAnime) {
      const res = await fetch(
        `https://vimal.animoon.me/api/info?id=${idToCheck}`
      );
      const dat = await res.json();

      const rest = await fetch(
        `https://vimal.animoon.me/api/episodes/${idToCheck}`
      );
      const epis = await rest.json();

      if (
        dat?.results?.data?.title &&
        Array.isArray(epis?.results?.episodes) &&
        epis.results.episodes.length > 0
      ) {
        await animeCollection.insertOne({
          _id: idToCheck,
          info: dat,
          episodes: epis,
        });
        datao = dat;
      }
    }
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
  if (!existingAnime || !existingAnime?.info?.results?.data?.title) {
    return {
      title: "Anime not found - Animoon",
      description: "The requested anime could not be found.",
    };
  }

  const title = existingAnime ? existingAnime?.info?.results?.data?.title : datao?.results?.data?.title;
  return {
    title: `Watch ${title} English Sub/Dub online free on Animoon.me`,
    description: `Animoon is the best site to watch ${title} SUB online, or you can even watch ${title} DUB in HD quality. You can also watch underrated anime on Animoon.`,
  };
}

export default async function Page({ params }) {
  const param = await params;
  const idToCheck = param.anime;

  const mongoUri =
    "mongodb://root:Imperial_king2004@145.223.118.168:27017/?authSource=admin";
  const dbName = "mydatabase";
  const homeCollectionName = "animoon-home";
  const animeCollectionName = "animeInfo";

  const client = new MongoClient(mongoUri);
  let data;
  let existingAnime = [];

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
    const animeCollection = db.collection(animeCollectionName.trim());
    existingAnime = await animeCollection.findOne({ _id: idToCheck });
    if (!existingAnime) {
      const res = await fetch(
        `https://vimal.animoon.me/api/info?id=${idToCheck}`
      );
      const dat = await res.json();

      const rest = await fetch(
        `https://vimal.animoon.me/api/episodes/${idToCheck}`
      );
      const epis = await rest.json();

      if (
        dat?.results?.data?.title &&
        Array.isArray(epis?.results?.episodes) &&
        epis.results.episodes.length > 0
      ) {
        await animeCollection.insertOne({
          _id: idToCheck,
          info: dat,
          episodes: epis,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }

  // Fetch the anime details

  const ShareUrl = `https://animoon.me/${idToCheck}`;
  const arise = "this Anime";

  return (
    <div>
      <Script
          strategy="afterInteractive"
          src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
        />
      <RecommendedTopTen
        uiui={existingAnime}
        data={data}
        ShareUrl={ShareUrl}
        arise={arise}
        id={idToCheck}
      />
      <Advertize/>
    </div>
  );
}
