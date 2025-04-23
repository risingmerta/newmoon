import React from "react";
import RecommendedTopTen from "../../layouts/RecommendedTopTen";
import { connectDB } from "@/lib/mongoClient";
import Advertize from "@/component/Advertize/Advertize";

const homeCollectionName = "animoon-home";
const animeCollectionName = "animeInfo";

// ───────────────────────────────────────────────────────────

async function fetchHomeData(db) {
  const homeCollection = db.collection(homeCollectionName);
  const document = await homeCollection.findOne({});
  if (document) return document;

  const res = await fetch("https://vimal.animoon.me/api/");
  return await res.json();
}

async function fetchAndStoreAnime(db, idToCheck) {
  const animeCollection = db.collection(animeCollectionName);
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
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon";
  const idToCheck = params.anime;

  let data = null;
  let animeDoc = null;

  try {
    const db = await connectDB();
    data = await fetchHomeData(db);
    animeDoc = await fetchAndStoreAnime(db, idToCheck);
  } catch (err) {
    console.error("Error in generateMetadata:", err.message);
  }

  const title =
    animeDoc?.info?.results?.data?.title ?? "Anime not found - Animoon";

  return {
    title: `Watch ${title} English Sub/Dub online free on ${siteName}`,
    description: `${siteName} is the best site to watch ${title} SUB online, or you can even watch ${title} DUB in HD quality. You can also watch underrated anime on ${siteName}.`,
  };
}

// ───────────────────────────────────────────────────────────

export default async function Page({ params, searchParams }) {
  const idToCheck = params.anime;
  const searchParam = await searchParams;

  let data = null;
  let animeDoc = null;
  let direct = "";

  try {
    const db = await connectDB();
    const profileCollection = db.collection("profile");

    const referId = searchParam.refer;
    if (referId) {
      const userProfile = await profileCollection.findOne({ _id: referId });
      if (userProfile?.directLink) {
        direct = userProfile.directLink;
      }
    }
    data = await fetchHomeData(db);
    animeDoc = await fetchAndStoreAnime(db, idToCheck);
  } catch (err) {
    console.error("Error in Page component:", err.message);
  }

  const ShareUrl = `https://animoon.me/${idToCheck}`;
  const arise = "this Anime";

  return (
    <div>
      <RecommendedTopTen
        uiui={animeDoc}
        data={data}
        ShareUrl={ShareUrl}
        arise={arise}
        id={idToCheck}
      />
      {direct && <Advertize direct={direct} />}
    </div>
  );
}
