import { connectDB } from "@/lib/mongoClient";

export async function POST(req) {
  try {
    const db = await connectDB();
    const liveRoomsCollection = db.collection("liveRooms");
    const episodesCollection = db.collection("episodesStream");

    // Extract query parameters
    const url = new URL(req.url); // Base URL is required for `new URL`
    const id = url.searchParams.get("id");
    const epId = url.searchParams.get("epId");
    const episodeNo = url.searchParams.get("episodeNo");

    // Validate required query parameters
    if (!id || !epId || episodeNo == null) {
      return new Response(
        JSON.stringify({
          error: "Missing required query parameters: id, epId, or episodeNo",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convert `episodeNo` to a number if necessary
    const episodeNumber = Number(episodeNo);
    if (isNaN(episodeNumber)) {
      return new Response(
        JSON.stringify({ error: "Invalid episodeNo, must be a number" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch episode streams
    let dubTruth = "";
    let datajDub = {};
    let datajSub = {};
    let raw = "";

    try {
      const res = await fetch(
        `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=dub`
      );
      const strdat = await res.json();
      datajDub = strdat;
    } catch (error) {
      console.error("Error fetching dub stream data: ", error);
      datajDub = [];
    }

    try {
      const res = await fetch(
        `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=sub`
      );
      const strdat = await res.json();
      datajSub = strdat;
    } catch (error) {
      console.error("Error fetching sub stream data: ", error);
      datajSub = [];
    }

    if (!datajSub?.results?.streamingLink?.link?.file) {
      try {
        const res = await fetch(
          `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=raw`
        );
        const strdat = await res.json();
        datajSub = strdat;
        raw = "yes";
      } catch (error) {
        console.error("Error fetching raw stream data: ", error);
      }
    }

    // Ensure streams array exists
    const streams = [];

    // Push data into streams
    if (datajDub?.results?.streamingLink?.link?.file) {
      streams.push({
        type: "dub",
        data: datajDub,
      });
    }

    if (datajSub?.results?.streamingLink?.link?.file) {
      streams.push({
        type: raw === "yes" ? "raw" : "sub",
        data: datajSub,
      });
    }

    // Optionally assign back to existingEpisode

    // Check if a room with the same id already exists
    const existingRoom = await liveRoomsCollection.findOne({ id });

    if (existingRoom) {
      // Update only the specific fields instead of replacing the entire document
      await liveRoomsCollection.updateOne(
        { id },
        { $set: { episodeNo: episodeNumber, episodeId: epId } } // Only updates these fields
      );

      return new Response(
        JSON.stringify({
          message: "Room updated successfully",
          updated: { id, epId, episodeNo: episodeNumber, episodeId: epId , streams},
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error inserting or updating data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to store data", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
