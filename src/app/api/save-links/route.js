import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const { directLink, refLink, userId } = body;

    if (!userId || (!directLink && !refLink)) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    const db = await connectDB();
    const collection = db.collection("profile");

    const result = await collection.updateOne(
      { userId },
      {
        $set: {
          directLink: directLink || "",
          refLink: refLink || "",
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("Error saving links:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
