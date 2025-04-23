import React from "react";
import AllLive from "@/component/AllLive/page";
import Advertize from "@/component/Advertize/Advertize";
import { connectDB } from "@/lib/mongoClient";
import Script from "next/script";

export default async function page({searchParams}) {
  const db = await connectDB();
  const collection = db.collection("liveRooms");
  const searchParam = await searchParams;
  const liveRooms = await collection.find({}).toArray();
  const live = JSON.stringify(liveRooms);
  const liveRoom = JSON.parse(live);

  return (
    <div>
      {/* <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      /> */}
      <AllLive liveRoom={liveRoom} refer={searchParam?.refer}/>
      {/* <Advertize /> */}
    </div>
  );
}
