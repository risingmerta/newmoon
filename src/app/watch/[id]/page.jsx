// /app/watch/[id]/page.tsx
import React, { Suspense } from "react";
import { connectDB } from "@/lib/mongoClient";
import Watchi from "@/component/Watchi/page";
import Advertize from "@/component/Advertize/Advertize";
import HeroSkeleton from "@/component/Loading/HeroSkeleton"; // Assuming you have a loading skeleton

// --- Fetch anime data ---
const fetchAnimeData = async (idToCheck) => {
  try {
    const db = await connectDB();
    const animeCollection = db.collection("animeInfo");

    let existingAnime = await animeCollection.findOne({ _id: idToCheck });
    let datao = existingAnime?.info;
    let data = existingAnime?.episodes;

    const isInfoMissing =
      !existingAnime?.info?.results?.data ||
      !Array.isArray(existingAnime?.episodes?.results?.episodes) ||
      existingAnime?.episodes?.results?.episodes.length === 0;

    if (!existingAnime || isInfoMissing) {
      const [info, episodes] = await Promise.all([
        fetch(`https://vimal.animoon.me/api/info?id=${idToCheck}`).then((res) =>
          res.json()
        ),
        fetch(`https://vimal.animoon.me/api/episodes/${idToCheck}`).then(
          (res) => res.json()
        ),
      ]);

      if (
        info?.results?.data?.title &&
        Array.isArray(episodes?.results?.episodes) &&
        episodes?.results?.episodes.length > 0
      ) {
        await animeCollection.updateOne(
          { _id: idToCheck },
          { $set: { info, episodes } },
          { upsert: true }
        );
        existingAnime = { info, episodes };
      }
    }

    return existingAnime;
  } catch (error) {
    console.error("Error fetching anime data:", error);
    return null;
  }
};

// --- Metadata generation ---
export async function generateMetadata({ params }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon";
  const idToCheck = params.id;

  try {
    const existingAnime = await fetchAnimeData(idToCheck);
    const title = existingAnime?.info?.results?.data?.title || "Anime";

    return {
      title: `Watch ${title} English Sub/Dub online free on ${siteName}`,
      description: `${siteName} is the best site to watch ${title} SUB online, or you can even watch underrated anime on ${siteName}.`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `Watch Anime Online Free on ${siteName}`,
      description: `${siteName} is the best site to watch anime in high quality with both sub and dub options.`,
    };
  }
}

// --- Page component with suspense ---
async function WatchPage({ params, searchParams }) {
  const idToCheck = params.id;
  const epis = searchParams?.ep;
  const episodeIdParam = epis ? `${idToCheck}?ep=${epis}` : null;

  const db = await connectDB();
  const profileCollection = db.collection("profile");

  // Fetch anime data
  const existingAnime = await fetchAnimeData(idToCheck);
  const datao = existingAnime?.info;
  const data = existingAnime?.episodes;

  if (!data || !datao) {
    return <HeroSkeleton />;
  }

  // Find episode
  const epId = episodeIdParam || data?.results?.episodes[0]?.id;
  const episodeNumber =
    data?.results?.episodes?.find((ep) => ep?.id === epId)?.episode_no || 0;

  const epiod = episodeNumber;

  // Check dub availability
  const dubTruth =
    datao?.results?.data?.animeInfo?.tvInfo?.dub >= epiod ? "yes" : "";

  // Streaming fetcher
  const fetchStreamData = async (id, type) => {
    try {
      return await fetch(
        `https://vimal.animoon.me/api/stream?id=${id}&server=hd-2&type=${type}`
      ).then((res) => res.json());
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  };

  // Fetch streaming links
  let datajDub = dubTruth ? await fetchStreamData(epId, "dub") : [];
  let datajSub = await fetchStreamData(epId, "sub");
  let raw = "";

  if (!datajSub?.results?.streamingLink?.link?.file) {
    datajSub = await fetchStreamData(epId, "raw");
    raw = "yes";
  }

  // Fetch schedule
  let dati = null;
  try {
    const res = await fetch(
      `https://vimal.animoon.me/api/schedule/${idToCheck}`
    );
    if (res.ok) {
      const json = await res.json();
      const dateOnly = json?.results?.nextEpisodeSchedule?.split(" ")[0];
      if (dateOnly) {
        const schDoc = await db
          .collection("animoon-schedule")
          .findOne({ _id: dateOnly });
        dati = schDoc?.schedule?.find((s) => s.id === idToCheck)
          ? { schedule: schDoc.schedule.find((s) => s.id === idToCheck) }
          : null;
      }
    }
  } catch (error) {
    console.error("Failed to fetch schedule:", error.message);
  }

  // Fetch homepage data
  let datapp = null;
  try {
    const doc = await db.collection("animoon-home").findOne({});
    datapp =
      doc ||
      (await fetch("https://vimal.animoon.me/api/").then((res) => res.json()));
  } catch (error) {
    console.error("Error fetching homepage data:", error.message);
  }

  // Refer link
  let direct = "";
  const referId = searchParams?.refer;
  if (referId) {
    const userProfile = await profileCollection.findOne({ _id: referId });
    if (userProfile?.directLink) {
      direct = userProfile.directLink;
    }
  }

  const ShareUrl = `https://animoon.me/watch/${epId}&refer=${
    searchParams?.refer || ""
  }`;
  const arise = "this Episode";

  return (
    <div>
      <Watchi
        data={data}
        anId={idToCheck}
        schedule={dati?.schedule}
        datajDub={datajDub}
        datajSub={datajSub}
        datao={datao}
        epiod={epiod}
        epId={epId}
        epis={epis}
        dataj={[]}
        datapp={datapp}
        ShareUrl={ShareUrl}
        arise={arise}
        raw={raw}
        refer={referId}
      />
      <Advertize direct={direct} />
    </div>
  );
}

// --- Final export using Suspense ---
export default async function PageWrapper({ params, searchParams }) {
  const searchParam = await searchParams;
  const param = await params;
  return (
    <Suspense fallback={<HeroSkeleton />}>
      {/* Wrapped your async page inside Suspense */}
      <WatchPage params={param} searchParams={searchParam} />
    </Suspense>
  );
}
