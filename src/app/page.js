import Advertize from "@/component/Advertize/Advertize";
import Home from "@/component/Home/Home";
import { MongoClient } from "mongodb";
import Script from "next/script";

export default async function Page() {
  // Fetch data from the API route
  const res = await fetch(`https://kaori.animoon.me/api/home`,{cache: 'no-store'});

  // Check if the request was successful
  if (!res.ok) {
    console.error("Failed to fetch data");
    return;
  }

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

  const { data, existingAnime } = await res.json();
  return (
    <div>
      {/* <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      /> */}
      <Home data={data} existingAnime={existingAnime} schedule={animeDocs}/>
      {/* <Advertize /> */}
    </div>
  );
}
