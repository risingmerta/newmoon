import { connectDB } from "@/lib/mongoClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId." });
    }

    const db = await connectDB();
    const collection = db.collection("profile");

    const profile = await collection.findOne({ _id: userId });

    if (!profile) {
      return NextResponse.json({ success: false, message: "User not found." });
    }

    return NextResponse.json({
      success: true,
      directLink: profile.directLink || "",
      refLink: profile.refLink || "",
      monetized: !!profile.directLink, // true if directLink exists
    });
  } catch (err) {
    console.error("Error fetching links:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
