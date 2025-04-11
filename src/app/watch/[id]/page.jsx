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
  const param = await params;
  try {
    const mongoUri =
      "mongodb://adminUser:adminPass123@127.0.0.1:27017/kaoriDB?authSource=admin";
    const dbName = "mydatabase"; // Change the database name as needed
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);
    const animeCollection = db.collection("animeInfo");
    const idToCheck = param.id;

    const existingAnime = await animeCollection.findOne({ _id: idToCheck });

    let datao = "";

    if (!existingAnime?.info?.results?.data) {
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
        epis.results.episodes.length > 0
      ) {
        await animeCollection.insertOne({
          _id: idToCheck,
          info: dat,
          episodes: epis,
        });
        datao = dat;
      }
    }

    const title = existingAnime?.info
      ? existingAnime?.info?.results?.data?.title
      : datao?.results?.data?.title;

    return {
      title: `Watch ${title} English Sub/Dub online free on Animoon.me`,
      description: `Animoon is the best site to watch ${title} SUB online, or you can even watch underrated anime on Animoon.`,
    };
  } catch (error) {
    console.error("Error fetching metadata: ", error);
    return {
      title: "Watch Anime Online Free on Animoon.me",
      description:
        "Animoon is the best site to watch anime in high quality with both sub and dub options.",
    };
  }
}

// Main page component
export default async function page({ params, searchParams }) {
  const mongoUri =
    "mongodb://adminUser:adminPass123@127.0.0.1:27017/kaoriDB?authSource=admin";
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

  console.log("anime data from db", existingAnime);

  // Fetch anime info with force-cache and revalidation
  let datao;
  // = await fetchDataFromAPI(
  //   `https://hianimes.animoon.me/anime/info?id=${param.id}`,
  //   18000 // Revalidate after 5 hours
  // );
  datao = existingAnime?.info;
  // Fetch episodes with force-cache and revalidation
  let data;
  // = await fetchDataFromAPI(
  //   `https://hianimes.animoon.me/anime/episodes/${param.id}`,
  //   3600 // Revalidate after 1 hour
  // );
  data = existingAnime?.episodes;

  if (!existingAnime?.info?.results?.data || !existingAnime?.episodes) {
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
      epis.results.episodes.length > 0
    ) {
      await animeCollection.insertOne({
        _id: idToCheck,
        info: dat,
        episodes: epis,
      });
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

  // Fetch stream data (real-time, no caching)
  let dataj = [];
  // try {
  //   const respStream = await fetch(
  //     `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-1&type=sub`,
  //     { cache: "no-store" } // No cache for real-time streaming data
  //   );
  //   dataj = await respStream.json();
  //   console.log(dataj);
  // } catch (error) {
  //   console.error("Error fetching stream data: ", error);
  //   dataj = [];
  // }

  // console.log("dataj:", dataj);

  // dataj = [];

  let datajDub = [];
  if (dubTruth) {
    try {
      // const respStream = await fetch(
      //   `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-1&type=dub`,
      //   { cache: "no-store" } // No cache for real-time streaming data
      // );
      // const fetchedData = await respStream.json();
      // datajDub = {};

      // Create a `results` object inside `datajSub` and add data
      datajDub = existingEpisode?.streams?.dub; // Add existing raw data
      // If you need to log or use it:
    } catch (error) {
      console.error("Error fetching stream data: ", error);
      datajDub = [];
    }
  }

  let datajSub = [];
  try {
    // const respStream = await fetch(
    //   `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-1&type=sub`,
    //   { cache: "no-store" } // No cache for real-time streaming data
    // );
    // const fetchedData = await respStream.json();
    // datajSub = {};

    // Create a `results` object inside `datajSub` and add data
    datajSub = existingEpisode?.streams?.sub; // Add existing raw data
    // If you need to log or use it:
  } catch (error) {
    console.error("Error fetching stream data: ", error);
    datajSub = [];
  }

  let raw = "";

  if (!datajSub?.results?.streamingLink?.link?.file) {
    // datajSub is an array and is empty

    try {
      // const respStream = await fetch(
      //   `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-1&type=raw`,
      //   { cache: "no-store" } // No cache for real-time streaming data
      // );

      // Parse the response JSON
      // let fetchedData = await respStream.json();

      // Initialize `datajSub` as an empty object
      // datajSub = {};

      // Create a `results` object inside `datajSub` and add data
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

  const dataStr = { sub: [], dub: [] }; // Separate arrays for sub and dub URLs

  // try {
  //   // Step 1: Fetch the server list for the episode
  //   const episodeId = epis ? epis : data.episodes[0].episodeId.split("ep=")[1];
  //   const serversResponse = await axios.get(
  //     `https://hianime.to/ajax/v2/episode/servers?episodeId=${episodeId}`
  //   );
  //   const serversData = serversResponse.data;

  //   if (serversData?.html) {
  //     const $ = cheerio.load(serversData.html);

  //     // Extract SUB and DUB server data
  //     ["sub", "dub"].forEach((type) => {
  //       $(`div.ps_-block-sub.servers-${type} div.server-item`).each(
  //         (_, element) => {
  //           const dataId = $(element).attr("data-id");
  //           if (dataId) {
  //             dataStr[type].push({ id: dataId, url: null }); // Initialize URL as null
  //           }
  //         }
  //       );
  //     });

  //     // Step 2: Fetch sources for all `data-id`s in parallel
  //     for (const type of ["sub", "dub"]) {
  //       await Promise.all(
  //         dataStr[type].map(async (server) => {
  //           try {
  //             const sourcesResponse = await axios.get(
  //               `https://hianime.to/ajax/v2/episode/sources?id=${server.id}`
  //             );
  //             const sourcesData = sourcesResponse.data;

  //             if (sourcesData?.link) {
  //               const match = sourcesData.link.match(/e-1\/(.*?)\?k=1/);
  //               if (match && match[1]) {
  //                 const extractedText = match[1];
  //                 server.url = `https://ea.bunniescdn.online/embed-2/e-1/${extractedText}?k=1&ep_id=${server.id}&autostart=true`;
  //               }
  //             }
  //           } catch (err) {
  //             console.error(
  //               `Error fetching sources for server ID ${server.id}:`,
  //               err.message
  //             );
  //           }
  //         })
  //       );
  //     }

  //     console.log("Extracted EA URLs:", dataStr);
  //   } else {
  //     console.error("Invalid servers response or missing HTML.");
  //   }
  // } catch (error) {
  //   console.error("Error:", error.message);
  // }

  let datau = [];
  // try {
  //   const respS = await fetch(
  //     `https://hianimes.animoon.me/anime/search/suggest?q=${params.id}`,
  //     { cache: "force-cache" }
  //   );
  //   datau = await respS.json();
  // } catch (error) {
  //   datau = [];
  // }

  let jname = "";
  // datau &&
  //   datau.suggestions &&
  //   datau?.suggestions?.map((i) => {
  //     if (i.id === params.id) {
  //       jname = i.jname;
  //     }
  //   });

  let gogoEP = [];
  // try {
  //   const gogoTP = await fetch(
  //     `https://newgogoking.vercel.app/${datao?.anime?.info?.name}?page=1`,
  //     { cache: "force-cache" }
  //   );
  //   gogoEP = await gogoTP.json();
  // } catch (error) {
  //   gogoEP = [];
  // }

  // const caseEP = gogoEP?.results?.length > 0 ? gogoEP.results[0]?.id : "";
  // let gogoId =
  //   "/" +
  //   (
  //     caseEP.replace(":", "").toLocaleLowerCase().replaceAll(" ", "-") +
  //     `-dub-episode-${epiod}`
  //   ).replace(/[^a-zA-Z0-9\-]/g, "");
  // let caseId =
  //   "/" +
  //   (
  //     caseEP.replace(":", "").toLocaleLowerCase().replaceAll(" ", "-") +
  //     `-episode-${epiod}`
  //   ).replace(/[^a-zA-Z0-9\-]/g, "");
  // Example data from your `datao` object

  // Example gogoData (with sub and dub information)
  let gogoSub = [];
  // try {
  //   let gogoSC = await fetch(`https://newgogoking.vercel.app/watch/${caseId}`, {
  //     cache: "force-cache",
  //   });
  //   gogoSub = await gogoSC.json();
  // } catch (error) {
  //   gogoSub = [];
  // }
  // console.log(gogoSub);

  let gogoDub = [];
  // try {
  //   let gogoSC = await fetch(`https://newgogoking.vercel.app/watch/${gogoId}`, {
  //     cache: "force-cache",
  //   });
  //   gogoDub = await gogoSC.json();
  // } catch (error) {
  //   gogoDub = [];
  // }
  // console.log("sub", gogoSub);

  let subPri = [];
  // try {
  //   let gogoMC = await fetch(
  //     `https://hianimes.animoon.me/anime/episode-srcs?id=${epId}&serverId=4&category=sub`,
  //     {
  //       cache: "force-cache",
  //     }
  //   );
  //   subPri = await gogoMC.json();
  // } catch (error) {
  //   console.error("Error fetching subtitle data:", error);
  //   subPri = [];
  // }

  // Check if subPri is empty or null before making the second fetch
  if (!subPri || subPri.length === 0) {
    // try {
    //   let gogoMC = await fetch(
    //     `https://hianimes.animoon.me/anime/episode-srcs?id=${epId}&serverId=4&category=raw`,
    //     {
    //       cache: "force-cache",
    //     }
    //   );
    //   subPri = await gogoMC.json();
    // } catch (error) {
    //   console.error("Error fetching raw data:", error);
    //   subPri = [];
    // }
  }

  const subPrio = subPri && subPri.tracks ? subPri.tracks : "";

  // Fetch homepage data with force-cache and revalidation
  let datapp;
  // = await fetchDataFromAPI(
  //   "https://hianimes.animoon.me/anime/home",
  //   3600 // Revalidate after 1 hour
  // );

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
      <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      />
      <Watchi
        data={data}
        anId={param.id}
        subPrio={subPrio}
        dataStr={dataStr}
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
