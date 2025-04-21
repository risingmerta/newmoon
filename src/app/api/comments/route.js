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

  const update = {
    $pull: {},
    $addToSet: {},
    $inc: {}
  };

  if (action === 'like') {
    if (hasLiked) {
      // Remove like
      update.$pull.likedBy = userId;
      update.$inc.likes = -1;
    } else {
      // Add like, remove dislike if exists
      update.$addToSet.likedBy = userId;
      update.$inc.likes = 1;

      if (hasDisliked) {
        update.$pull.dislikedBy = userId;
        update.$inc.dislikes = -1;
      }
    }
  } else if (action === 'dislike') {
    if (hasDisliked) {
      // Remove dislike
      update.$pull.dislikedBy = userId;
      update.$inc.dislikes = -1;
    } else {
      // Add dislike, remove like if exists
      update.$addToSet.dislikedBy = userId;
      update.$inc.dislikes = 1;

      if (hasLiked) {
        update.$pull.likedBy = userId;
        update.$inc.likes = -1;
      }
    }
  }

  // Remove empty update operations
  for (const key in update) {
    if (Object.keys(update[key]).length === 0) {
      delete update[key];
    }
  }

  if (Object.keys(update).length > 0) {
    await comments.updateOne({ _id: commentId }, update);
  }

  const updatedComment = await comments.findOne({ _id: commentId });
  return new Response(JSON.stringify(updatedComment), { status: 200 });
}

