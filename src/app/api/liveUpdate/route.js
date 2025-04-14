import { connectDB } from "@/lib/mongoClient";

export async function POST(req) {
  try {
    const db = await connectDB();
    const liveRoomsCollection = db.collection("liveRooms");

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const epId = url.searchParams.get("epId");
    const episodeNo = url.searchParams.get("episodeNo");

    if (!id || !epId || episodeNo == null) {
      return new Response(
        JSON.stringify({
          error: "Missing required query parameters: id, epId, or episodeNo",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const episodeNumber = Number(episodeNo);
    if (isNaN(episodeNumber)) {
      return new Response(
        JSON.stringify({ error: "Invalid episodeNo, must be a number" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let datajDub = {};
    let datajSub = {};
    let raw = "";

    try {
      const res = await fetch(
        `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=dub`
      );
      datajDub = await res.json();
    } catch (error) {
      console.error("Error fetching dub stream data:", error);
      datajDub = [];
    }

    try {
      const res = await fetch(
        `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=sub`
      );
      datajSub = await res.json();
    } catch (error) {
      console.error("Error fetching sub stream data:", error);
      datajSub = [];
    }

    if (!datajSub?.results?.streamingLink?.link?.file) {
      try {
        const res = await fetch(
          `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=raw`
        );
        datajSub = await res.json();
        raw = "yes";
      } catch (error) {
        console.error("Error fetching raw stream data:", error);
      }
    }

    const streams = [];

    if (datajDub?.results?.streamingLink?.link?.file) {
      streams.push({ type: "dub", data: datajDub });
    }

    if (datajSub?.results?.streamingLink?.link?.file) {
      streams.push({ type: raw === "yes" ? "raw" : "sub", data: datajSub });
    }

    const existingRoom = await liveRoomsCollection.findOne({ id });
 
    if (existingRoom) {
      await liveRoomsCollection.updateOne(
        { id },
        { $set: { episodeNo: episodeNumber, episodeId: epId ,streams } }
      );
    }

    return new Response(
      JSON.stringify({
        message: existingRoom
          ? "Room updated successfully"
          : "Stream fetched successfully",
        updated: {
          id,
          epId,
          episodeNo: episodeNumber,
          episodeId: epId,
          streams,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error inserting or updating data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to store data", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
