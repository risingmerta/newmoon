import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Fetch data with force-cache and revalidate after 1 hour (3600 seconds)
    const response = await fetch(
      `https://hianimes.animoon.me/anime/recently-added?page=1`,
      {
        cache: "force-cache", // Force cache the response
        next: { revalidate: 3600 }, // Revalidate the cache after 1 hour
      }
    );

    const data = await response.json();

    // If data is fetched successfully and it's not an empty array, return it
    if (data && data.length > 0) {
      return NextResponse.json(data);
    } else {
      // Handle cases where the data is empty or not fetched properly
      return NextResponse.json({ message: "Recent Episodes not found" });
    }
  } catch (error) {
    console.error("Error fetching recent episodes:", error);
    return NextResponse.json({ message: "Error fetching recent episodes" });
  }
}
