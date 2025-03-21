import React from "react";
import AllLive from "@/component/AllLive/page";
import Advertize from "@/component/Advertize/Advertize";
import { MongoClient } from "mongodb";

export default async function page() {
  const mongoUri =
    "mongodb://root:Imperial_king2004@145.223.118.168:27017/?authSource=admin";
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
      <AllLive liveRoom={liveRoom}/>
      <Advertize />
    </div>
  );
}
