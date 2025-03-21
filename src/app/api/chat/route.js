import { connectDB } from "@/lib/mongoClient";

export async function POST(req) {
  try {
    const db = await connectDB();
    const collection = db.collection("chats");
    const body = await req.json();

    if (!body || !body.text || !body.liveId || !body.username) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messageData = {
      text: body.text,
      username: body.username,
      randomImage: body.randomImage || "/default-avatar.png",
      liveId: body.liveId,
      timestamp: new Date(),
    };

    await collection.insertOne(messageData);

    return new Response(
      JSON.stringify({ message: "Message sent successfully", messageData }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error inserting chat message:", error);
    return new Response(JSON.stringify({ error: "Failed to store message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req) {
  try {
    const db = await connectDB();
    const collection = db.collection("chats");
    const url = new URL(req.url);
    const liveId = url.searchParams.get("liveId");

    if (!liveId) {
      return new Response(
        JSON.stringify({ error: "Missing liveId parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages = await collection
      .find({ liveId })
      .sort({ timestamp: 1 })
      .toArray();

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch messages" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
