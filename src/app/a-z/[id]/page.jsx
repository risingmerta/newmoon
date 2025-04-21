import SearchResults from "@/component/AZ/az";
import Script from "next/script";
import React from "react";
import { connectDB } from "@/lib/mongoClient";

export async function generateMetadata({ params }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon";
  const idd = "Anime";

  return {
    title: `Watch ${idd} English Sub/Dub online free on ${siteName}, free Anime Streaming`,
    description: `${siteName} is the best site to watch ${idd} SUB online, or you can even watch ${idd} DUB in HD quality. You can also watch underrated anime on ${siteName} website.`,
  };
}

export default async function Page({ params, searchParams }) {
  const pageParam = searchParams?.page || "1";
  const sortParam = searchParams?.sort?.toString().toLowerCase();
  const azCollectionName = sortParam ? `az-list_${sortParam}` : "az-list";

  let existingAnime = [];
  let count = 0;
  let json = null;
  const cacheMaxAge = 345600; // 4 days

  try {
    const db = await connectDB();
    const animeCollection = db.collection(azCollectionName.trim());

    const result = await animeCollection.findOne({
      page: parseInt(pageParam),
    });

    if (result) {
      existingAnime = JSON.parse(JSON.stringify(result));
    }

    count = await animeCollection.countDocuments();
  } catch (error) {
    console.error("MongoDB Error:", error.message);
  }

  try {
    const url = sortParam
      ? `https://vimal.animoon.me/api/az-list/${sortParam}?page=${pageParam}`
      : `https://vimal.animoon.me/api/az-list?page=${pageParam}`;

    const data = await fetch(url);

    json = await data.json();
  } catch (error) {
    console.error("Fetch Error:", error.message);
  }

  return (
    <div>
      {/* <Script strategy="afterInteractive" src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js" /> */}
      <SearchResults
        el={existingAnime}
        sort={sortParam}
        page={pageParam}
        totalPages={count}
        para={params?.id}
      />
    </div>
  );
}
