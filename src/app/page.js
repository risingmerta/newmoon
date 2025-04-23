// import { getServerSession } from "@/app/api/auth/[...nextauth]/route";
// import { authOptions } from "@/lib/auth"; // adjust this path based on your project
import { connectDB } from "@/lib/mongoClient";

import Home from "@/component/Home/Home";
// import Advertize from "@/component/Advertize/Advertize";
import Script from "next/script";

export default async function Page({ searchParams }) {
  const searchParam = await searchParams;
  // Get the session
  // const session = await getServerSession(authOptions);

  // // If not logged in, you can optionally show a message or redirect
  // if (!session) {
  //   console.error("No session found");
  //   return <div>Please log in to view this page.</div>;
  // }

  // Fetch external API data
  const res = await fetch(`https://kaori.animoon.me/api/home`, {
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Failed to fetch data");
    return <div>Failed to load content.</div>;
  }

  // Connect to MongoDB
  const db = await connectDB();
  const animeCollection = db.collection("animoon-schedule");
  const profileCollection = db.collection("profile");

  // Fetch anime schedule documents
  let animeDocs = await animeCollection.find({}).toArray();
  animeDocs = JSON.parse(JSON.stringify(animeDocs)); // Required for Next.js serialization

  // Fetch the user's profile using their ID from session
  const userProfile = await profileCollection.findOne({
    id: searchParam.refer,
  });
  const direct = JSON.parse(JSON.stringify(userProfile));

  // Get the response JSON from the API
  const { data, existingAnime } = await res.json();

  return (
    <div>
      {/* Optional Ad Script */}
      {/* <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      /> */}

      {/* Render Home Component */}
      <Home data={data} existingAnime={existingAnime} schedule={animeDocs} />

      {/* Optional Advertize Component */}
      <Advertize direct={direct} />
    </div>
  );
}
