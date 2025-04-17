import { connectDB } from "@/lib/mongoClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { directLink = "", refLink = "", userId } = await req.json();

    if (!userId || !directLink) {
      return NextResponse.json({ success: false, message: "Missing required fields." });
    }

    const db = await connectDB();
    const collection = db.collection("profile");

    const result = await collection.updateOne(
      { userId },
      {
        $set: {
          directLink,
          refLink,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("Error saving links:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
