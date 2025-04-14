import React from "react";
// import CreateLive from "../../../component/CreateLive/CreateLive";
// import LivePage from "../../../component/LivePage/LivePage";
import axios from "axios";
import * as cheerio from "cheerio";
import WatchLive from "@/component/WatchLive/WatchLive";
import { MongoClient } from "mongodb";
import Advertize from "@/component/Advertize/Advertize";
import Script from "next/script";

export default async function page({ params, searchParams }) {
  const searchParam = await searchParams;
  const param = await params;

  const mongoUri =
    "mongodb://animoon:Imperial_merta2030@127.0.0.1:27017/?authSource=admin";
  const dbName = "mydatabase"; // Change the database name as needed
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  let data;
  let datal;
  let episodeId;
  let datajDub = [];
  let datajSub = [];
  let difference;
  let episodes;
  if (searchParam.animeId) {
    const animeCollection = db.collection("animeInfo");

    const existingAnime = await animeCollection.findOne({
      _id: searchParam.animeId,
    });
    console.log("anime data from db", existingAnime);

    data = existingAnime.info;
    let dat;
    dat = existingAnime.episodes;
    episodes = dat;

    // Determine the episode ID
    const epId = dat?.results?.episodes[0]?.id;
    episodeId = epId;
  } else {
    let epiod = 1;
    const animeCollection = db.collection("liveRooms");

    const streamAnime = await animeCollection.findOne({
      id: param.id,
    });
    const str = JSON.stringify(streamAnime);
    const strN = JSON.parse(str);
    datal = strN;

    let dubTruth = "";

    try {
      const res = await fetch(
        `https://vimal.animoon.me/api/stream?id=${streamAnime.episodeId}&server=hd-2&type=dub`
      );
      const strdat = await res.json();

      datajDub = strdat;
    } catch (error) {
      console.error("Error fetching stream data: ", error);
      datajDub = [];
    }

    try {
      const res = await fetch(
        `https://vimal.animoon.me/api/stream?id=${streamAnime.episodeId}&server=hd-2&type=sub`
      );
      const strdat = await res.json();

      datajSub = strdat;
    } catch (error) {
      console.error("Error fetching stream data: ", error);
      datajSub = [];
    }

    let raw = "";

    if (!datajSub?.results?.streamingLink?.link?.file) {
      try {
        const res = await fetch(
          `https://vimal.animoon.me/api/stream?id=${streamAnime.episodeId}&server=hd-2&type=raw`
        );
        const strdat = await res.json();

        datajSub = strdat;
        raw = "yes";
      } catch (error) {
        console.error("Error fetching stream data: ", error);
      }
    }
  }

  return (
    <div>
      <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      />
      <WatchLive
        id={param.id}
        data={data}
        datal={datal}
        episodeId={episodeId}
        datajDub={datajDub}
        secon={difference}
        datajSub={datajSub}
        animeId={searchParam.animeId}
        episodes={episodes}
      />
      <Advertize />
    </div>
  );
}
