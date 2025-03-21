import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "default-category";
    const page = searchParams.get("page") || "1";

    const date = name
      .replaceAll(" ", "-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\-]/g, ""); // Clean up name

    // Fetch anime genre data
    const [animeResp, homeResp] = await Promise.all([
      fetch(`https://vimal.animoon.me/api/genre/${date}?page=${page}`, {
        next: { revalidate: 3600 },
      }),
      fetch("https://vimal.animoon.me/api", {
        next: { revalidate: 3600 },
      }),
    ]);

    if (!animeResp.ok || !homeResp.ok) {
      throw new Error("Failed to fetch data.");
    }

    const animeData = await animeResp.json();
    const homeData = await homeResp.json();

    return NextResponse.json({
      animeData,
      homeData,
      ShareUrl: `https://animoon.me/genre?id=${name}&name=${name}`,
      arise: `${name} Anime`,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to load data." },
      { status: 500 }
    );
  }
}
