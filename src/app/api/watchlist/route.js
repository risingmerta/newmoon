import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "1", 10);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const collection = db.collection("watchlists");
    const userWatchlist = await collection.findOne({ _id: userId });

    if (!userWatchlist || !userWatchlist.watchlist) {
      return NextResponse.json([]);
    }

    let animeList = [];
    if (type) {
      animeList = userWatchlist.watchlist[type] || [];
    } else {
      animeList = Object.values(userWatchlist.watchlist).flat();
    }

    // Pagination logic
    const startIndex = (page - 1) * pageSize;
    const paginatedAnime = animeList.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      data: paginatedAnime,
      total: animeList.length,
      page,
      pageSize,
      totalPages: Math.ceil(animeList.length / pageSize),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { anime } = await req.json();
    const { userId, type, ...animeData } = anime;

    if (!userId || !type) {
      return NextResponse.json(
        { error: "User ID and type are required" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const collection = db.collection("watchlists");
    let userWatchlist = await collection.findOne({ _id: userId });

    if (!userWatchlist) {
      userWatchlist = { _id: userId, watchlist: {} };
    }

    if (!userWatchlist.watchlist[type]) {
      userWatchlist.watchlist[type] = [];
    }

    const exists = userWatchlist.watchlist[type].some(
      (item) => item.id === animeData.id
    );
    if (!exists) {
      userWatchlist.watchlist[type].push(animeData);
      await collection.updateOne(
        { _id: userId },
        { $set: { [`watchlist.${type}`]: userWatchlist.watchlist[type] } },
        { upsert: true }
      );
    }

    return NextResponse.json(
      { message: "Anime added to watchlist" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const animeId = searchParams.get("animeId");
    const type = searchParams.get("type");

    if (!userId || !animeId || !type) {
      return NextResponse.json(
        { error: "User ID, Anime ID, and Type are required" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const collection = db.collection("watchlists");
    const userWatchlist = await collection.findOne({ _id: userId });

    if (!userWatchlist || !userWatchlist.watchlist[type]) {
      return NextResponse.json(
        { error: "Watchlist not found" },
        { status: 404 }
      );
    }

    userWatchlist.watchlist[type] = userWatchlist.watchlist[type].filter(
      (anime) => anime.id !== animeId
    );

    await collection.updateOne(
      { _id: userId },
      { $set: { [`watchlist.${type}`]: userWatchlist.watchlist[type] } }
    );

    return NextResponse.json({ message: "Anime removed from watchlist" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 }
    );
  }
}
