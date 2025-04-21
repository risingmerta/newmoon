import React from "react";
import WatchLive from "@/component/WatchLive/WatchLive";
import { connectDB } from "@/lib/mongoClient";  // Use the connectDB function for MongoDB connection
import Script from "next/script";

export default async function page({ params, searchParams }) {
  const { animeId } = searchParams;
  const { id } = params;

  const db = await connectDB();
  let data = null;
  let datal = null;
  let episodeId = null;
  let datajDub = [];
  let datajSub = [];
  let episodes = [];

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

    if (streamAnime) {
      datal = streamAnime;

      try {
        const [dubRes, subRes, rawRes] = await Promise.all([
          fetch(`https://vimal.animoon.me/api/stream?id=${streamAnime.episodeId}&server=hd-2&type=dub`).then((res) => res.json()),
          fetch(`https://vimal.animoon.me/api/stream?id=${streamAnime.episodeId}&server=hd-2&type=sub`).then((res) => res.json()),
          fetch(`https://vimal.animoon.me/api/stream?id=${streamAnime.episodeId}&server=hd-2&type=raw`).then((res) => res.json())
        ]);

        datajDub = dubRes || [];
        datajSub = subRes || [];

        if (!datajSub?.results?.streamingLink?.link?.file) {
          datajSub = rawRes || [];
        }
      } catch (error) {
        console.error("Error fetching stream data: ", error);
      }
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
      />
      {/* Optionally include an advertisement */}
      {/* <Advertize /> */}
    </div>
  );
}
