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
    const existingEpisode = await episodesCollection.findOne({ _id: epId });

    if (!existingEpisode) {
      return new Response(
        JSON.stringify({ error: "Episode stream data not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const streams = existingEpisode.streams || []; // Ensure streams is an array

    // Check if a room with the same id already exists
    const existingRoom = await liveRoomsCollection.findOne({ id });

    if (existingRoom) {
      // Update only the specific fields instead of replacing the entire document
      await liveRoomsCollection.updateOne(
        { id },
        { $set: { episodeNo: episodeNumber, streams } } // Only updates these fields
      );

      return new Response(
        JSON.stringify({
          message: "Room updated successfully",
          updated: { id, epId, episodeNo: episodeNumber, streams },
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
