import { connectDB } from "@/lib/mongoClient";

export async function POST(req) {
  try {
    const db = await connectDB();
    const collection = db.collection("liveRooms");
    const body = await req.json();

    if (!body || !body.id) {
      return new Response(JSON.stringify({ error: "Missing required field: id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if a room with the same id already exists
    const existingRoom = await collection.findOne({ id: body.id });

    if (existingRoom) {
      // Update the existing room
      await collection.updateOne({ id: body.id }, { $set: body });

      return new Response(
        JSON.stringify({ message: "Room updated successfully", updated: body }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Insert a new room
    const result = await collection.insertOne(body);

    return new Response(
      JSON.stringify({ message: "Room created successfully", insertedId: result.insertedId }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error inserting or updating data:", error);
    return new Response(JSON.stringify({ error: "Failed to store data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req) {
  try {
    const db = await connectDB();
    const collection = db.collection("liveRooms");
    const url = new URL(req.url);
    const roomId = url.searchParams.get("id");

    if (roomId) {
      const liveRoom = await collection.findOne({ id: roomId });

      if (!liveRoom) {
        return new Response(
          JSON.stringify({ message: "No room found with this ID" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(liveRoom), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch all live rooms if no specific ID is provided
    const liveRooms = await collection.find({}).toArray();
    return new Response(JSON.stringify(liveRooms), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
