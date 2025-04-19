// app/page.tsx or app/page.jsx (depending on your setup)

import React from "react";
import { MongoClient } from "mongodb";
import Schedule from "@/component/Schedule/Schedule";

export default async function Page() {
  const mongoUri =
    "mongodb://animoon:Imperial_merta2030@127.0.0.1:27017/?authSource=admin";
  const dbName = "mydatabase";

  const client = new MongoClient(mongoUri);
  await client.connect();

  const db = client.db(dbName);
  const animeCollection = db.collection("animoon-schedule");

  let animeDocs = await animeCollection.find({}).toArray();
  animeDocs = JSON.parse(JSON.stringify(animeDocs));

  await client.close();

  return (
    <div>
      <Schedule schedule={animeDocs} />
    </div>
  );
}
