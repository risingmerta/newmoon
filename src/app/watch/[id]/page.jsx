import React from "react";
import { connectDB } from "@/lib/mongoClient";
import Watchi from "@/component/Watchi/page";
import Script from "next/script";

let sharedAnimeData = null;

export async function generateMetadata({ params }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon";
  const idToCheck = params.id;

  try {
    const db = await connectDB();
    const animeCollection = db.collection("animeInfo");

    let existingAnime = await animeCollection.findOne({ _id: idToCheck });

    let datao = existingAnime?.info;

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

    sharedAnimeData = existingAnime;

    const title =
      existingAnime?.info?.results?.data?.title || datao?.results?.data?.title;
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
  const db = await connectDB();
  const [animeCollection, episodesCollection] = [
    db.collection("animeInfo"),
    db.collection("epi"),
  ];
  let direct = "";

  const searchParam = await searchParams;

  const idToCheck = params.id;
  const epis = searchParam.ep;
  const episodeIdParam = epis ? `${params.id}?ep=${epis}` : null;

  let existingAnime = sharedAnimeData;

  if (!existingAnime) {
    existingAnime = await animeCollection.findOne({ _id: idToCheck });
  }

  const profileCollection = db.collection("profile");

  const docs = await animeCollection.find({}).toArray();
  animeDocs = JSON.parse(JSON.stringify(docs));

  const referId = searchParam?.refer;
  if (referId) {
    const userProfile = await profileCollection.findOne({ _id: referId });
    if (userProfile?.directLink) {
      direct = userProfile.directLink;
    }
  }

  let datao = existingAnime?.info;
  let data = existingAnime?.episodes;

  if (
    !datao?.results?.data ||
    !Array.isArray(data?.results?.episodes) ||
    data?.results?.episodes?.length === 0
  ) {
    const [dat, episData] = await Promise.all([
      fetch(`https://vimal.animoon.me/api/info?id=${idToCheck}`).then((r) =>
        r.json()
      ),
      fetch(`https://vimal.animoon.me/api/episodes/${idToCheck}`).then((r) =>
        r.json()
      ),
    ]);
    if (
      dat?.results?.data?.title &&
      Array.isArray(episData?.results?.episodes) &&
      episData?.results?.episodes.length > 0
    ) {
      await animeCollection.updateOne(
        { _id: idToCheck },
        { $set: { info: dat, episodes: episData } },
        { upsert: true }
      );
      datao = dat;
      data = episData;
    }
  }

  const epId = episodeIdParam || data?.results?.episodes[0]?.id;
  const existingEpisode = await episodesCollection.findOne({ _id: epId });
  console.log("from db", existingEpisode);

  let episodeNumber =
    data?.results?.episodes?.find((ep) => ep?.id === epId)?.episode_no || 0;
  let epiod = episodeNumber;

  let dubTruth =
    datao?.results?.data?.animeInfo?.tvInfo?.dub >= epiod ? "yes" : "";

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

  const ShareUrl = `https://animoon.me/watch/${epId}`;
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
      {/* <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      /> */}
      <Watchi
        data={data}
        anId={params.id}
        // subPrio={subPrio}
        // dataStr={dataStr}
        schedule={dati?.schedule}
        datajDub={datajDub}
        datajSub={datajSub}
        datao={datao}
        epiod={episodeNumber}
        epId={epId}
        epis={epis}
        dataj={dataj}
        datapp={datapp}
        // gogoDub={gogoDub}
        // gogoSub={gogoSub}
        ShareUrl={ShareUrl}
        arise={arise}
        raw={raw}
      />
      {direct && <Advertize direct={direct} />}
    </div>
  );
}
