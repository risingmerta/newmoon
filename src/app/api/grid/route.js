import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cate = searchParams.get("name") || "default-category"; // Default fallback
    const fiki = searchParams.get("heading") || "Anime"; // Default fallback
    const pageParam = searchParams.get("page") || "1";

    // Fetch category-specific anime list and homepage data
    const [animeResp, homeResp] = await Promise.all([
      fetch(`https://vimal.animoon.me/api/${cate}?page=${pageParam}`, {
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

    // Constructing the shareable URL
    const ShareUrl = `https://animoon.me/grid?name=${cate}&heading=${fiki}`;
    const arise = `${fiki} Anime`;

    return NextResponse.json({
      animeData,
      homeData,
      ShareUrl,
      arise,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error loading data. Please try again later." },
      { status: 500 }
    );
  }
}
