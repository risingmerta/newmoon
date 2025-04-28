import React from "react";
import { connectDB } from "@/lib/mongoClient";
import Watchi from "@/component/Watchi/page";
import Script from "next/script";
import Advertize from "@/component/Advertize/Advertize";

// Centralized data fetching function
const fetchAnimeData = async (idToCheck) => {
  try {
    const db = await connectDB();
    const animeCollection = db.collection("animeInfo");

    // Check if the anime data already exists in the database
    let existingAnime = await animeCollection.findOne({ _id: idToCheck });

    let datao = existingAnime?.info;
    let data = existingAnime?.episodes;

    const isInfoMissing =
      !existingAnime?.info?.results?.data ||
      !Array.isArray(existingAnime?.episodes?.results?.episodes) ||
      existingAnime.episodes.results.episodes.length === 0;

    if (!existingAnime || isInfoMissing) {
      const [dat, epis] = await Promise.all([
        fetch(`https://vimal.animoon.me/api/info?id=${idToCheck}`).then((r) =>
          r.json()
        ),
        fetch(`https://vimal.animoon.me/api/episodes/${idToCheck}`).then((r) =>
          r.json()
        ),
      ]);

      if (
        dat?.results?.data?.title &&
        Array.isArray(epis?.results?.episodes) &&
        epis?.results?.episodes.length > 0
      ) {
        await animeCollection.updateOne(
          { _id: idToCheck },
          { $set: { info: dat, episodes: epis } },
          { upsert: true }
        );
        datao = dat;
        existingAnime = { info: dat, episodes: epis };
      }
    }

    return existingAnime;
  } catch (error) {
    console.error("Error fetching anime data: ", error);
    return null;
  }
};

export async function generateMetadata({ params }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon";
  const param = await params;
  const idToCheck = param.id;

  try {
    const existingAnime = await fetchAnimeData(idToCheck);
    const title =
      existingAnime?.info?.results?.data?.title ||
      existingAnime?.info?.results?.data?.title;

    return {
      title: `Watch ${title} English Sub/Dub online free on ${siteName}`,
      description: `${siteName} is the best site to watch ${title} SUB online, or you can even watch underrated anime on ${siteName}.`,
    };
  } catch (error) {
    console.error("Error fetching metadata: ", error);
    return {
      title: `Watch Anime Online Free on ${siteName}`,
      description: `${siteName} is the best site to watch anime in high quality with both sub and dub options.`,
    };
  }
}

export default async function page({ params, searchParams }) {
  const param = await params;
  const searchParam = await searchParams;
  const idToCheck = param.id;
  const epis = searchParam.ep;
  const episodeIdParam = epis ? `${param.id}?ep=${epis}` : null;

  // Fetch anime data
  let existingAnime = await fetchAnimeData(idToCheck);

  // Profile collection and refer ID check
  const db = await connectDB();
  const profileCollection = db.collection("profile");
  let direct = "";

  const referId = searchParam?.refer;
  if (referId) {
    const userProfile = await profileCollection.findOne({ _id: referId });
    if (userProfile?.directLink) {
      direct = userProfile.directLink;
    }
  }

  let datao = existingAnime?.info;
  let data = existingAnime?.episodes;

  const epId = episodeIdParam || data?.results?.episodes[0]?.id;
  let episodeNumber =
    data?.results?.episodes?.find((ep) => ep?.id === epId)?.episode_no || 0;
  let epiod = episodeNumber;

  let dubTruth =
    datao?.results?.data?.animeInfo?.tvInfo?.dub >= epiod ? "yes" : "";

  // Fetch streaming data
  const fetchStreamData = async (epId, type) => {
    try {
      return await fetch(
        `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=${type}`
      ).then((r) => r.json());
    } catch (e) {
      console.error(`Error fetching ${type}:`, e);
      return [];
    }
  };

  let datajDub = dubTruth ? await fetchStreamData(epId, "dub") : [];
  let datajSub = await fetchStreamData(epId, "sub");
  let raw = "";

  if (!datajSub?.results?.streamingLink?.link?.file) {
    datajSub = await fetchStreamData(epId, "raw");
    raw = "yes";
  }

  // Schedule data
  let dati = null;
  try {
    const respi = await fetch(
      `https://vimal.animoon.me/api/schedule/${idToCheck}`
    );
    if (respi.ok) {
      const datih = await respi.json();
      const dateOnly = datih?.results?.nextEpisodeSchedule?.split(" ")[0];
      if (dateOnly) {
        const schDoc = await db
          .collection("animoon-schedule")
          .findOne({ _id: dateOnly });
        dati = schDoc?.schedule?.find((s) => s.id === idToCheck)
          ? { schedule: schDoc.schedule.find((s) => s.id === idToCheck) }
          : null;
      }
    }
  } catch (e) {
    console.log("Failed to fetch schedule:", e.message);
  }

  const ShareUrl = `https://animoon.me/watch/${epId}&refer=${searchParam.refer}`;
  const arise = "this Episode";

  let datapp;
  try {
    const doc = await db.collection("animoon-home").findOne({});
    datapp =
      doc ||
      (await fetch("https://vimal.animoon.me/api/").then((r) => r.json()));
  } catch (e) {
    console.error("Error fetching homepage data:", e.message);
  }

  const dataj = [];

  return (
    <div>
      {data && datao ? (
        <Watchi
          data={data}
          anId={param.id}
          schedule={dati?.schedule}
          datajDub={datajDub}
          datajSub={datajSub}
          datao={datao}
          epiod={episodeNumber}
          epId={epId}
          epis={epis}
          dataj={dataj}
          datapp={datapp}
          ShareUrl={ShareUrl}
          arise={arise}
          raw={raw}
          refer={searchParam.refer}
        />
      ) : (
        <HeroSkeleton />
      )}
      <Advertize direct={direct} />
    </div>
  );
}
