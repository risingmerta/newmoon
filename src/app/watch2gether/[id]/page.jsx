import React from "react";
import WatchLive from "@/component/WatchLive/WatchLive";
import { connectDB } from "@/lib/mongoClient"; // Use the connectDB function for MongoDB connection
import Script from "next/script";

export default async function page({ params, searchParams }) {
  const { animeId } = searchParams;
  const searchParam = await searchParams;
  const { id } = params;

  const db = await connectDB();
  let data = null;
  let datal = null;
  let episodeId = null;
  let datajDub = [];
  let datajSub = [];
  let episodes = [];

  const fetchWithErrorHandling = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching URL ${url}:`, error);
      return null;
    }
  };

  if (animeId) {
    const animeCollection = db.collection("animeInfo");
    const existingAnime = await animeCollection.findOne({ _id: animeId });

    if (existingAnime) {
      data = existingAnime.info;
      episodes = existingAnime.episodes?.results?.episodes || [];
      episodeId = episodes[0]?.id; // Assuming the first episode is the one you're fetching
    }
  } else {
    const liveRoomsCollection = db.collection("liveRooms");
    const streamAnime = await liveRoomsCollection.findOne({ id });

    if (streamAnime && streamAnime.episodeId) {
      datal = streamAnime;

      try {
        const [dubRes, subRes, rawRes] = await Promise.all([
          fetchWithErrorHandling(`https://vimal.animoon.me/api/stream?id=${streamAnime.episodeId}&server=hd-2&type=dub`),
          fetchWithErrorHandling(`https://vimal.animoon.me/api/stream?id=${streamAnime.episodeId}&server=hd-2&type=sub`),
          fetchWithErrorHandling(`https://vimal.animoon.me/api/stream?id=${streamAnime.episodeId}&server=hd-2&type=raw`)
        ]);

        datajDub = dubRes?.results || [];
        datajSub = subRes?.results || [];

        if (!datajSub?.streamingLink?.link?.file) {
          datajSub = rawRes?.results || [];
        }
      } catch (error) {
        console.error("Error fetching stream data: ", error);
      }
    } else {
      console.error("streamAnime or episodeId is missing.");
    }
  }

  return (
    <div>
      <WatchLive
        id={id}
        data={data}
        datal={datal}
        episodeId={episodeId}
        datajDub={datajDub}
        datajSub={datajSub}
        animeId={animeId}
        episodes={episodes}
        refer={searchParam?.refer}
      />
      {/* Optionally include an advertisement */}
      {/* <Advertize /> */}
    </div>
  );
}
