import { Suspense } from "react";
import { connectDB } from "@/lib/mongoClient";
import Home from "@/component/Home/Home";
import Advertize from "@/component/Advertize/Advertize";
import HeroSkeleton from "@/component/HeroSkeleton/HeroSkeleton";
import SpotlightLoader from "@/component/Loader/SpotlightLoader";

export const dynamic = "force-dynamic";

// 🛠️ Async function to fetch everything server-side
async function HomeContent({ searchParam }) {
  let data = [];
  let existingAnime = [];
  let animeDocs = [];
  let direct = "";

  try {
    const res = await fetch("https://kaori.animoon.me/api/home", {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      existingAnime = json.existingAnime || [];
    }
  } catch (err) {
    console.error("API error:", err);
  }

  try {
    const db = await connectDB();
    const animeCollection = db.collection("animoon-schedule");
    const docs = await animeCollection.find({}).toArray();
    animeDocs = JSON.parse(JSON.stringify(docs));

    const referId = searchParam?.refer;
    if (referId) {
      const profileCollection = db.collection("profile");
      const userProfile = await profileCollection.findOne({ _id: referId });
      if (userProfile?.directLink) {
        direct = userProfile.directLink;
      }
    }
  } catch (err) {
    console.error("MongoDB error:", err);
  }

  return (
    <Home
      data={data}
      existingAnime={existingAnime}
      schedule={animeDocs}
      refer={searchParam?.refer}
    />
  );
}

// 🛠️ Main page
export default async function Page({ searchParams }) {
  const searchParam = await searchParams;
  return (
    <div>
      {/* While HomeContent loads, HeroSkeleton is shown */}
      <Suspense fallback={<SpotlightLoader />}>
        <HomeContent searchParams={searchParam} />
      </Suspense>
      <Advertize direct={searchParams?.refer || ""} />
    </div>
  );
}
