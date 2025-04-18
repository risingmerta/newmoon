import React from "react";
import RecommendedTopTen from "../../layouts/RecommendedTopTen";
import { MongoClient } from "mongodb";
import Advertize from "@/component/Advertize/Advertize";
import Script from "next/script";

const mongoUri =
  "mongodb://animoon:Imperial_merta2030@127.0.0.1:27017/?authSource=admin";
const dbName = "mydatabase";
const homeCollectionName = "animoon-home";
const animeCollectionName = "animeInfo";

async function fetchHomeData(db) {
  const homeCollection = db.collection(homeCollectionName.trim());
  const document = await homeCollection.findOne({});
  if (document) return document;

  const res = await fetch("https://vimal.animoon.me/api/");
  return await res.json();
}

async function fetchAndStoreAnime(db, idToCheck) {
  const animeCollection = db.collection(animeCollectionName.trim());
  let animeDoc = await animeCollection.findOne({ _id: idToCheck });

  const isInfoMissing =
    !animeDoc?.info?.results?.data ||
    !Array.isArray(animeDoc?.episodes?.results?.episodes) ||
    animeDoc.episodes.results.episodes.length === 0;

  if (!animeDoc || isInfoMissing) {
    const [infoRes, episodesRes] = await Promise.all([
      fetch(`https://vimal.animoon.me/api/info?id=${idToCheck}`),
      fetch(`https://vimal.animoon.me/api/episodes/${idToCheck}`),
    ]);

    const info = await infoRes.json();
    const episodes = await episodesRes.json();

    if (
      info?.results?.data?.title &&
      Array.isArray(episodes?.results?.episodes) &&
      episodes.results.episodes.length > 0
    ) {
      await animeCollection.updateOne(
        { _id: idToCheck },
        { $set: { info, episodes } },
        { upsert: true }
      );
      animeDoc = { _id: idToCheck, info, episodes };
    }
  }

  return animeDoc;
}

// ───────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing
  const idToCheck = params.anime;

  const client = new MongoClient(mongoUri);
  let data = null;
  let animeDoc = null;

  try {
    await client.connect();
    const db = client.db(dbName);

    data = await fetchHomeData(db);
    animeDoc = await fetchAndStoreAnime(db, idToCheck);
  } catch (err) {
    console.error("Error in generateMetadata:", err.message);
  } finally {
    await client.close();
  }

  const title =
    animeDoc?.info?.results?.data?.title ?? "Anime not found - Animoon";

    return {
      title: `Watch ${title} English Sub/Dub online free on ${siteName}`,
      description: `${siteName} is the best site to watch ${title} SUB online, or you can even watch ${title} DUB in HD quality. You can also watch underrated anime on ${siteName}.`,
    };
}

// ───────────────────────────────────────────────────────────

export default async function Page({ params }) {
  const idToCheck = params.anime;

  const client = new MongoClient(mongoUri);
  let data = null;
  let animeDoc = null;

  try {
    await client.connect();
    const db = client.db(dbName);

    data = await fetchHomeData(db);
    animeDoc = await fetchAndStoreAnime(db, idToCheck);
  } catch (err) {
    console.error("Error in Page component:", err.message);
  } finally {
    await client.close();
  }

  const ShareUrl = `https://animoon.me/${idToCheck}`;
  const arise = "this Anime";

  return (
    <div>
      {/* <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      /> */}
      <RecommendedTopTen
        uiui={animeDoc}
        data={data}
        ShareUrl={ShareUrl}
        arise={arise}
        id={idToCheck}
      />
      <Advertize />
    </div>
  );
}
