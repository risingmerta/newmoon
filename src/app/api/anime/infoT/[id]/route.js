import { NextResponse } from "next/server";

// Main API handler function
export async function GET(req, { params }) {
  // Fetch data using 'force-cache' and revalidate mechanism
  try {
    const response = await fetch(
      `https://hianimes.animoon.me/anime/info?id=${params.id}`,
      {
        cache: "force-cache", // Force cache the response
        next: { revalidate: 18000 }, // Revalidate after 5 hours (18000 seconds)
      }
    );

    // Parse response data
    const data = await response.json();
    if (data && data.length > 0) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ message: "Recent Episodes not found" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Error fetching data" });
  }
}
