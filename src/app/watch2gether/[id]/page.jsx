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
    "mongodb://adminUser:adminPass123@127.0.0.1:27017/kaoriDB?authSource=admin";
  const dbName = "mydatabase"; // Change the database name as needed
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  let data;
  let datal;
  let streams;
  let datajDub = [];
  let datajSub = [];
  let difference;
  let episodes;
  if (searchParam.animeId) {
    const episodesCollection = db.collection("episo");
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

    const existingEpisode = await episodesCollection.findOne({ _id: epId });
    streams = existingEpisode.streams;
  } else {
    const animeCollection = db.collection("liveRooms");

    const streamAnime = await animeCollection.findOne({
      id: param.id,
    });
    const str = JSON.stringify(streamAnime);
    const strN = JSON.parse(str);
    datal = strN;

    let dubTruth = "";

    if (streamAnime.episodes.dub >= 1) {
      dubTruth = "yes";
    }
    if (dubTruth) {
      try {
        datajDub = streamAnime.streams.dub; // Add existing raw data
      } catch (error) {
        console.error("Error fetching stream data: ", error);
        datajDub = [];
      }
    }

    try {
      datajSub = streamAnime.streams.sub; // Add existing raw data
    } catch (error) {
      console.error("Error fetching stream data: ", error);
      datajSub = [];
    }

    let raw = "";

    if (!datajSub?.results?.streamingLink?.link?.file) {
      try {
        datajSub = streamAnime.streams.raw; // Add existing raw data
        raw = "yes";
      } catch (error) {
        console.error("Error fetching stream data: ", error);
      }
    }
    if (data?.results?.data?.animeInfo?.tvInfo?.dub >= epiod) {
      if (!datajDub?.results?.streamingLink?.link?.file) {
        const res = await fetch(`https://vimal.animoon.me/api/servers/${epId}`);
        const dat = await res.json();
        if (dat.results.some((item) => item.type === "dub")) {
          const res = await fetch(
            `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=dub`
          );
          const strdat = await res.json();
  
          datajDub = strdat;
  
          if (epId) {
            const result = await episodesCollection.updateOne(
              { _id: epId }, // Convert epId to ObjectId
              { $set: { "streams.dub": strdat } }
            );
  
            if (result.modifiedCount > 0) {
              console.log("Document updated successfully!");
            } else {
              console.log("No document was updated.");
            }
          } else {
            console.log("Invalid ObjectId");
          }
        }
      }
    }
  
    if (data?.results?.data?.animeInfo?.tvInfo?.sub >= epiod) {
      if (!datajSub?.results?.streamingLink?.link?.file) {
        const res = await fetch(`https://vimal.animoon.me/api/servers/${epId}`);
        const dat = await res.json();
        if (dat.results.some((item) => item.type === "sub")) {
          const res = await fetch(
            `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=sub`
          );
          const strdat = await res.json();
  
          datajSub = strdat;
  
          if (epId) {
            const result = await episodesCollection.updateOne(
              { _id: epId }, // Convert epId to ObjectId
              { $set: { "streams.sub": strdat } }
            );
  
            if (result.modifiedCount > 0) {
              console.log("Document updated successfully!");
            } else {
              console.log("No document was updated.");
            }
          } else {
            console.log("Invalid ObjectId");
          }
        }
  
        if (dat.results.some((item) => item.type === "raw")) {
          const res = await fetch(
            `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=raw`
          );
          const strdat = await res.json();
  
          datajSub = strdat;
  
          if (epId) {
            const result = await episodesCollection.updateOne(
              { _id: epId }, // Convert epId to ObjectId
              { $set: { "streams.raw": strdat } }
            );
  
            if (result.modifiedCount > 0) {
              console.log("Document updated successfully!");
            } else {
              console.log("No document was updated.");
            }
          } else {
            console.log("Invalid ObjectId");
          }
        }
      }
    }
  
    if (data.results.data.animeInfo.Status === "Currently-Airing") {
      const res = await fetch(`https://vimal.animoon.me/api/servers/${epId}`, {
        next: { revalidate: 3600 },
      });
      const dat = await res.json();
      if (dat.results.some((item) => item.server_id === "1")) {
        if (
          dat.results.some(
            (item) =>
              item.type === "dub" &&
              datajDub?.results?.streamingLink?.intro?.end === 0 &&
              datajDub?.results?.streamingLink?.outro?.start === 0
          )
        ) {
          const res = await fetch(
            `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=dub`
          );
          const strdat = await res.json();
  
          datajDub = strdat;
  
          if (epId) {
            const result = await episodesCollection.updateOne(
              { _id: epId }, // Convert epId to ObjectId
              { $set: { "streams.dub": strdat } }
            );
  
            if (result.modifiedCount > 0) {
              console.log("Document updated successfully!");
            } else {
              console.log("No document was updated.");
            }
          } else {
            console.log("Invalid ObjectId");
          }
        }
        if (
          dat.results.some(
            (item) =>
              item.type === "sub" &&
              datajSub?.results?.streamingLink?.intro?.end === 0 &&
              datajSub?.results?.streamingLink?.outro?.start === 0
          )
        ) {
          const res = await fetch(
            `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=sub`
          );
          const strdat = await res.json();
  
          datajSub = strdat;
  
          if (epId) {
            const result = await episodesCollection.updateOne(
              { _id: epId }, // Convert epId to ObjectId
              { $set: { "streams.sub": strdat } }
            );
  
            if (result.modifiedCount > 0) {
              console.log("Document updated successfully!");
            } else {
              console.log("No document was updated.");
            }
          } else {
            console.log("Invalid ObjectId");
          }
        }
  
        if (
          dat.results.some(
            (item) =>
              item.type === "raw" &&
              datajSub?.results?.streamingLink?.intro?.end === 0 &&
              datajSub?.results?.streamingLink?.outro?.start === 0
          )
        ) {
          const res = await fetch(
            `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=raw`
          );
          const strdat = await res.json();
  
          datajSub = strdat;
  
          if (epId) {
            const result = await episodesCollection.updateOne(
              { _id: epId }, // Convert epId to ObjectId
              { $set: { "streams.raw": strdat } }
            );
  
            if (result.modifiedCount > 0) {
              console.log("Document updated successfully!");
            } else {
              console.log("No document was updated.");
            }
          } else {
            console.log("Invalid ObjectId");
          }
        }
  
        if (
          datajSub?.results?.streamingLink?.intro?.end === 0 &&
          datajSub?.results?.streamingLink?.outro?.start === 0
        ) {
          const resp = await fetch(
            `https://vimal.animoon.me/api/episodes/${param.id}`
          );
          const datar = await resp.json();
          data = datar;
  
          if (param.id) {
            const result = await animeCollection.updateOne(
              { _id: param.id }, // Convert epId to ObjectId
              { $set: { episodes: datar } }
            );
  
            if (result.modifiedCount > 0) {
              console.log("Document updated successfully!");
            } else {
              console.log("No document was updated.");
            }
          } else {
            console.log("Invalid ObjectId");
          }
        }
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
        streams={streams}
        datajDub={datajDub}
        secon={difference}
        datajSub={datajSub}
        animeId={searchParam.animeId}
        episodes={episodes}
      />
      <Advertize/>
    </div>
  );
}
