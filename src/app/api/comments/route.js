import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust this to your path

const mongoUri = "mongodb://animoon:Imperial_merta2030@127.0.0.1:27017/?authSource=admin";
const dbName = "mydatabase";

let client;
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
  }
  return client.db(dbName);
}

// Handle Comment Creation (POST)
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { text, parentId = null } = await req.json();
  const userId = session.user.id;
  const username = session.user.username; // Assuming username is available in the session
  const avatar = session.user.avatar || '/default-avatar.png'; // Assuming avatar is available in the session
  const timestamp = Date.now();
  const id = `${userId}_${timestamp}`;

  const comment = {
    _id: id,
    userId,
    username,
    avatar,
    text,
    parentId,
    createdAt: new Date(),
    likes: 0,
    dislikes: 0,
  };

  const db = await connectToDatabase();
  await db.collection("comments").insertOne(comment);

  return new Response(JSON.stringify(comment), { status: 201 });
}

// Get Comments (GET)
export async function GET() {
  const db = await connectToDatabase();
  const comments = await db.collection("comments").find().toArray();

  return new Response(JSON.stringify(comments), { status: 200 });
}

// Handle Like/Dislike reactions (PATCH)
export async function PATCH(req) {
  const url = new URL(req.url);
  const commentId = url.searchParams.get("commentId"); // Get the commentId from query parameters
  const { action } = await req.json(); // 'like' or 'dislike'

  if (!commentId) {
    return new Response(JSON.stringify({ error: 'commentId is required' }), { status: 400 });
  }

  if (!action || !['like', 'dislike'].includes(action)) {
    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  }

  const db = await connectToDatabase();
  const comment = await db.collection("comments").findOne({ _id: commentId });

  if (!comment) {
    return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404 });
  }

  const updateField = action === 'like' ? 'likes' : 'dislikes';
  const updateData = {};
  updateData[updateField] = 1; // Increment likes/dislikes by 1

  await db.collection("comments").updateOne(
    { _id: commentId },
    { $inc: updateData } // Increment the like/dislike count
  );

  // Fetch the updated comment data
  const updatedComment = await db.collection("comments").findOne({ _id: commentId });

  return new Response(JSON.stringify(updatedComment), { status: 200 });
}
