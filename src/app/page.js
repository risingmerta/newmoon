export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/mongoClient";
import Home from "@/component/Home/Home";
import Advertize from "@/component/Advertize/Advertize";
import Script from "next/script";

export default async function Page({ searchParams }) {
  let data = [];
  let existingAnime = [];
  let animeDocs = [];
  let direct = "";

  const searchParam = await searchParams;

  try {
    const res = await fetch("https://kaori.animoon.me/api/home", {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      existingAnime = json.existingAnime || [];
    } else {
      console.error("Failed to fetch data from API");
    }
  } catch (err) {
    console.error("API fetch error:", err);
  }

  try {
    const db = await connectDB();
    const animeCollection = db.collection("animoon-schedule");
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
  } catch (err) {
    console.error("MongoDB error:", err);
  }

  return (
    <div>
      {/* Optional */}
      {/* <Script strategy="afterInteractive" src="..." /> */}
      <Home data={data} existingAnime={existingAnime} schedule={animeDocs} refer={searchParam?.refer}/>
      <Advertize direct={direct} />
    </div>
  );
}
