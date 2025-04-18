import React from "react";
// import WatchAnime from "../../../component/WatchAnime/WatchAnime";
// import axios from "axios";
// import * as cheerio from "cheerio";
import { MongoClient, ObjectId } from "mongodb";
import Watchi from "@/component/Watchi/page";
import Script from "next/script";
// import { currentUser } from "@clerk/nextjs/server";

async function fetchDataFromAPI(url, revalidate) {
  try {
    const response = await fetch(url, {
      cache: "force-cache", // Cache the response forcefully
      next: { revalidate },
    });
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from API: `, error);
    return null;
  }
}

// Generate metadata dynamically based on the anime info
export async function generateMetadata({ params }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing
  const param = await params;
  try {
    const mongoUri =
      "mongodb://animoon:Imperial_merta2030@127.0.0.1:27017/?authSource=admin";
    const dbName = "mydatabase"; // Change the database name as needed
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);
    const animeCollection = db.collection("animeInfo");
    const idToCheck = param.id;

    const existingAnime = await animeCollection.findOne({ _id: idToCheck });

    let datao = existingAnime?.info;

    const isInfoMissing =
      !existingAnime?.info?.results?.data ||
      !Array.isArray(existingAnime?.episodes?.results?.episodes) ||
      existingAnime.episodes.results.episodes.length === 0;

    if (!existingAnime || isInfoMissing) {
      const res = await fetch(
        `https://vimal.animoon.me/api/info?id=${idToCheck}`
      );
      const dat = await res.json();

      datao = dat;
    }

    const title = existingAnime?.info
      ? existingAnime?.info?.results?.data?.title
      : datao?.results?.data?.title;
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

// Main page component
export default async function page({ params, searchParams }) {
  const mongoUri =
    "mongodb://animoon:Imperial_merta2030@127.0.0.1:27017/?authSource=admin";
  const dbName = "mydatabase"; // Change the database name as needed
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  const episodesCollection = db.collection("epi");
  const epiColl = db.collection("episo");
  const animeCollection = db.collection("animeInfo");
  const searchParam = await searchParams;
  const epis = searchParam.ep;
  const param = await params;
  const episodeIdParam = epis ? `${param.id}?ep=${epis}` : null;

  const idToCheck = param.id;

  const existingAnime = await animeCollection.findOne({ _id: idToCheck });

  let datao = existingAnime?.info;
  let data = existingAnime?.episodes;

  if (
    !existingAnime?.info?.results?.data ||
    !Array.isArray(existingAnime?.episodes?.results?.episodes) ||
    existingAnime?.episodes?.results?.episodes?.length === 0
  ) {
    const res = await fetch(
      `https://vimal.animoon.me/api/info?id=${idToCheck}`
    );
    const dat = await res.json();

    const rest = await fetch(
      `https://vimal.animoon.me/api/episodes/${idToCheck}`
    );
    const epis = await rest.json();

    if (
      dat?.results?.data?.title &&
      Array.isArray(epis?.results?.episodes) &&
      epis?.results?.episodes?.length > 0
    ) {
      await animeCollection.updateOne(
        { _id: idToCheck },
        {
          $set: {
            info: dat,
            episodes: epis,
          },
        },
        { upsert: true }
      );

      datao = dat;
      data = epis;
    }
  }

  // Determine the episode ID
  const epId = episodeIdParam || data?.results?.episodes[0]?.id;

  const existingEpisode = await episodesCollection.findOne({ _id: epId });

  console.log("from db", existingEpisode);

  // Find the episode number
  let episodeNumber = 0;
  if (data?.results?.episodes?.length > 0) {
    const currentEpisode = data?.results?.episodes?.find(
      (ep) => ep?.id === epId
    );
    episodeNumber = currentEpisode ? currentEpisode?.episode_no : 0;
  }

  let epiod = 0;
  let i = 0;
  for (i > 0; i < data?.results?.episodes?.length; i++) {
    if (data?.results?.episodes[i]?.id?.includes(epId)) {
      epiod = data?.results?.episodes[i]?.episode_no;
    }
  }
  epiod = episodeNumber;
  let dubTruth = "";
  if (datao?.results?.data?.animeInfo?.tvInfo?.dub >= epiod) {
    dubTruth = "yes";
  }
  let dataj = [];
  let datajDub = [];
  if (dubTruth) {
    try {
      datajDub = existingEpisode?.streams?.dub; // Add existing raw data
      // If you need to log or use it:
    } catch (error) {
      console.error("Error fetching stream data: ", error);
      datajDub = [];
    }
  }

  let datajSub = [];
  try {
    datajSub = existingEpisode?.streams?.sub; // Add existing raw data
  } catch (error) {
    console.error("Error fetching stream data: ", error);
    datajSub = [];
  }

  let raw = "";

  if (!datajSub?.results?.streamingLink?.link?.file) {
    try {
      datajSub = existingEpisode?.streams?.raw; // Add existing raw data
      raw = "yes";
      // If you need to log or use it:
    } catch (error) {
      console.error("Error fetching stream data: ", error);
    }
  }

  if (datao?.results?.data?.animeInfo?.tvInfo?.dub >= epiod) {
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
          const result = await epiColl.updateOne(
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

  if (datao?.results?.data?.animeInfo?.tvInfo?.sub >= epiod) {
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
          const result = await epiColl.updateOne(
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
          const result = await epiColl.updateOne(
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

  if (datao.results.data.animeInfo.Status === "Currently-Airing") {
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
          const result = await epiColl.updateOne(
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
          const result = await epiColl.updateOne(
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
          const result = await epiColl.updateOne(
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

  if (!datao?.results?.data?.title) {
    const resp = await fetch(
      `https://vimal.animoon.me/api/info?id=${param.id}`
    );
    const datar = await resp.json();
    datao = datar;

    if (param.id) {
      const result = await animeCollection.updateOne(
        { _id: param.id }, // Convert epId to ObjectId
        { $set: { info: datar } }
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

  if (Array.isArray(data?.results)) {
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

  if (data?.results?.episodes?.length > 0) {
    const currentEpisode = data?.results?.episodes?.find(
      (ep) => ep?.id === epId
    );
    episodeNumber = currentEpisode ? currentEpisode?.episode_no : 0;
  }

  let dati;

  try {
    const respi = await fetch(
      `https://vimal.animoon.me/api/schedule/${idToCheck}`
    );

    if (!respi.ok) {
      throw new Error(`HTTP error! Status: ${respi.status}`);
    }

    const datih = await respi.json();
    const scheduleDateTime = datih?.results?.nextEpisodeSchedule;

    if (scheduleDateTime) {
      const dateOnly = scheduleDateTime.split(" ")[0]; // Extract "YYYY-MM-DD"

      // Fetch from 'animoon-schedule' collection using the date as _id
      const schColl = "animoon-schedule";
      const SchCollection = db.collection(schColl.trim());
      const scheduleDoc = await SchCollection.findOne({ _id: dateOnly });

      if (scheduleDoc) {
        // Convert the entire MongoDB document to a string and then back to JSON
        const scheduleJSON = JSON.parse(JSON.stringify(scheduleDoc));

        // Find the schedule entry that matches the idToCheck
        const matchingSchedule = scheduleJSON.schedule.find(
          (item) => item.id === idToCheck
        );

        if (matchingSchedule) {
          // Prepare data to pass as props
          dati = {
            schedule: matchingSchedule,
          };
        } else {
          console.log(`No matching schedule found for id: ${idToCheck}`);
          dati = null;
        }
      } else {
        console.log(`No schedule document found for date: ${dateOnly}`);
        dati = null;
      }
    } else {
      console.log("No nextEpisodeSchedule found in API response");
      dati = null;
    }
  } catch (error) {
    console.log("Failed to fetch schedule data:", error.message);
    dati = null;
  }

  console.log( "0_0", dati);

  const dataStr = { sub: [], dub: [] }; // Separate arrays for sub and dub URLs
  let gogoSub = [];
  let gogoDub = [];
  let subPri = [];
  if (!subPri || subPri.length === 0) {
  }

  const subPrio = subPri && subPri.tracks ? subPri.tracks : "";
  let datapp;
  let existingAnimes = [];
  const homeCollectionName = "animoon-home";
  const animeCollectionName = "animeInfo";

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Fetch homepage data
    const homeCollection = db.collection(homeCollectionName.trim());
    const document = await homeCollection.findOne({}); // Adjust query as needed

    if (document) {
      datapp = document;
    } else {
      console.log("No homepage data found in MongoDB");
    }

    // If homepage data is missing, fetch from API
    if (!datapp) {
      const res = await fetch("https://vimal.animoon.me/api/");
      datapp = await res.json();
    }

    // Check if anime from spotlights exists in the animeInfo collection
    if (datapp?.spotlights?.length > 0) {
      const animeCollection = db.collection(animeCollectionName.trim());

      // Use Promise.all to fetch data for all spotlight IDs concurrently
      existingAnimes = await Promise.all(
        datapp.spotlights.map(async (spotlight) => {
          const result = await animeCollection.findOne(
            { _id: spotlight.id },
            {
              projection: {
                "info.results.data.animeInfo.Genres": 1,
                "info.results.data.poster": 1,
              },
            }
          );

          if (result) {
            return {
              Genres: result.info?.results?.data?.animeInfo?.Genres || [],
              poster: result.info?.results?.data?.poster || "",
            };
          } else {
            console.log(`Anime ${spotlight.title} not found in database.`);
            return null;
          }
        })
      );

      // Filter out any null results
      existingAnimes = existingAnimes.filter((item) => item !== null);
    }
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }

  // Share URL and title for the current episode
  const ShareUrl = `https://animoon.me/watch/${epId}`;
  const arise = "this Episode";

  // Render WatchAnime component
  return (
    <div>
      {/* <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      /> */}
      <Watchi
        data={data}
        anId={param.id}
        subPrio={subPrio}
        dataStr={dataStr}
        schedule={dati.schedule}
        datajDub={datajDub}
        datajSub={datajSub}
        datao={datao}
        epiod={episodeNumber}
        epId={epId}
        epis={epis}
        dataj={dataj}
        datapp={datapp}
        gogoDub={gogoDub}
        gogoSub={gogoSub}
        ShareUrl={ShareUrl}
        arise={arise}
        raw={raw}
      />
    </div>
  );
}
