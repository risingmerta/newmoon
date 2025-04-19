// app/page.tsx or app/page.jsx (depending on your setup)

import React from 'react';
import { MongoClient } from 'mongodb';

export default async function Page() {
  const mongoUri =
    "mongodb://animoon:Imperial_merta2030@127.0.0.1:27017/?authSource=admin";
  const dbName = "mydatabase";

  const client = new MongoClient(mongoUri);
  await client.connect();

  const db = client.db(dbName);
  const animeCollection = db.collection("animoon-schedule");

  const animeDocs = await animeCollection.find({}).toArray();

  await client.close();

  return (
    <div>
      <h1>All Animoon Schedule Docs</h1>
      <pre>{JSON.stringify(animeDocs, null, 2)}</pre>
    </div>
  );
}
