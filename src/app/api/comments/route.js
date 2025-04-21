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

export async function GET() {
  const db = await connectToDatabase();
  const comments = await db.collection("comments").find().toArray();

  return new Response(JSON.stringify(comments), { status: 200 });
}

// Handle Like/Dislike reactions
export async function PATCH(req) {
  const { commentId } = req.url.split('/').pop(); // Extract commentId from URL
  const { action } = await req.json(); // 'like' or 'dislike'

  const db = await connectToDatabase();
  const comment = await db.collection("comments").findOne({ _id: commentId });

  if (comment) {
    const updateField = action === 'like' ? 'likes' : 'dislikes';
    await db.collection("comments").updateOne(
      { _id: commentId },
      { $inc: { [updateField]: 1 } }
    );

    const updatedComment = await db.collection("comments").findOne({ _id: commentId });

    return new Response(JSON.stringify(updatedComment), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404 });
}
