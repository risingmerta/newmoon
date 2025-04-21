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
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const url = new URL(req.url);
  const commentId = url.searchParams.get("commentId");
  const { action } = await req.json(); // 'like' or 'dislike'
  const userId = session.user.id;

  if (!commentId || !['like', 'dislike'].includes(action)) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const db = await connectToDatabase();
  const comments = db.collection("comments");
  const comment = await comments.findOne({ _id: commentId });

  if (!comment) {
    return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404 });
  }

  const hasLiked = comment.likedBy?.includes(userId);
  const hasDisliked = comment.dislikedBy?.includes(userId);

  // Prepare update
  const update = { $set: {}, $inc: {}, $pull: {}, $addToSet: {} };

  if (action === "like") {
    if (hasLiked) {
      return new Response(JSON.stringify({ message: "Already liked" }), { status: 200 });
    }

    if (hasDisliked) {
      update.$pull.dislikedBy = userId;
      update.$inc.dislikes = -1;
    }

    update.$addToSet.likedBy = userId;
    update.$inc.likes = 1;

  } else if (action === "dislike") {
    if (hasDisliked) {
      return new Response(JSON.stringify({ message: "Already disliked" }), { status: 200 });
    }

    if (hasLiked) {
      update.$pull.likedBy = userId;
      update.$inc.likes = -1;
    }

    update.$addToSet.dislikedBy = userId;
    update.$inc.dislikes = 1;
  }

  // Clean up empty operations
  Object.keys(update).forEach(key => {
    if (Object.keys(update[key]).length === 0) delete update[key];
  });

  await comments.updateOne({ _id: commentId }, update);

  const updatedComment = await comments.findOne({ _id: commentId });
  return new Response(JSON.stringify(updatedComment), { status: 200 });
}
