// 📁 app/api/comments/route.js
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust this to your path

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
  const timestamp = Date.now();
  const id = `${userId}_${timestamp}`;

  const comment = {
    _id: id,
    userId,
    text,
    parentId,
    createdAt: new Date(),
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