import React from "react";
import AllLive from "@/component/AllLive/page";
import Advertize from "@/component/Advertize/Advertize";
import { MongoClient } from "mongodb";
import Script from "next/script";

export default async function page() {
  const mongoUri =
    "mongodb://adminUser:adminPass123@69.62.64.106:27017/kaoriDB?authSource=admin";
  const dbName = "mydatabase"; // Change the database name as needed
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("liveRooms");

  // Fetch all live rooms if no specific ID is provided
  const liveRooms = await collection.find({}).toArray();
  const live = JSON.stringify(liveRooms)
  const liveRoom = JSON.parse(live)
  return (
    <div>
      <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      />
      <AllLive liveRoom={liveRoom}/>
      <Advertize />
    </div>
  );
}
