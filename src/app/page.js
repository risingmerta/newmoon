import { connectDB } from "@/lib/mongoClient";
import Home from "@/component/Home/Home";
import Advertize from "@/component/Advertize/Advertize"; // Uncomment if you use it
import Script from "next/script";

export default async function Page({ searchParams }) {
  let data = [];
  let existingAnime = [];
  let animeDocs = [];
  let direct = "";

  try {
    // Fetch external API data
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
    animeDocs = JSON.parse(JSON.stringify(docs)); // required by Next.js

    const referId = typeof searchParams?.refer === "string" ? searchParams.refer : null;

    if (referId) {
      const userProfile = await profileCollection.findOne({ id: referId });
      if (userProfile?.directLink) {
        direct = userProfile.directLink;
      }
    }
  } catch (err) {
    console.error("MongoDB error:", err);
  }

  return (
    <div>
      {/* Optional Ad Script */}
      {/* <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      /> */}

      {/* Render Components */}
      <Home data={data} existingAnime={existingAnime} schedule={animeDocs} />
      {direct && <Advertize direct={direct} />}
    </div>
  );
}
