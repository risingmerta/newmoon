import { MongoClient } from "mongodb";

const mongoUri =
  "mongodb://root:Imperial_king2004@145.223.118.168:27017/?authSource=admin";
const dbName = "mydatabase";

function normalizeString(str) {
  return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

async function getFilteredAnime(filters) {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const animeCollection = db.collection("animeInfo");

    let query = {};

    if (filters.type && filters.type !== "All") {
      query["info.results.data.showType"] = filters.type;
    }
    if (filters.status && filters.status !== "All") {
      query["info.results.data.animeInfo.Status"] = filters.status.replaceAll(" ", "-");
    }
    if (filters.rating && filters.rating !== "All") {
      query["info.results.data.animeInfo.tvInfo.rating"] = filters.rating;
    }
    if (filters.score && filters.score !== "All") {
      const numericScore = parseInt(filters.score.match(/\d+/)[0], 10);
      if (!isNaN(numericScore)) {
        query["info.results.data.animeInfo.MAL Score"] = {
          $regex: `^${numericScore}`,
        };
      }
    }
    if (filters.season && filters.season !== "All") {
      query["info.results.data.animeInfo.Premiered"] = {
        $regex: filters.season,
        $options: "i",
      };
    }
    if (filters.language && filters.language !== "All") {
      const languages = filters.language.toLowerCase().split(" & ");
      if (languages.includes("sub") && languages.includes("dub")) {
        query["info.results.data.animeInfo.tvInfo.sub"] = { $exists: true };
        query["info.results.data.animeInfo.tvInfo.dub"] = { $exists: true };
      } else {
        if (languages.includes("sub")) {
          query["info.results.data.animeInfo.tvInfo.sub"] = { $exists: true };
        }
        if (languages.includes("dub")) {
          query["info.results.data.animeInfo.tvInfo.dub"] = { $exists: true };
        }
      }
    }
    if (filters.genres && filters.genres.length > 0) {
      const modifiedGenres = filters.genres.map((genre) => genre.replaceAll(" ", "-"));
      query["info.results.data.animeInfo.Genres"] = { $in: modifiedGenres };
    }
    
    if (filters.keyword) {
      const keyword = normalizeString(filters.keyword);
      query.$or = [
        { "info.results.data.title": { $regex: keyword, $options: "i" } },
        { "info.results.data.animeInfo.japaneseTitle": { $regex: keyword, $options: "i" } },
      ];
    }

    let sortOptions = {};
    if (filters.sort) {
      if (filters.sort === "Score") {
        sortOptions["MAL_Score"] = -1;
      } else if (filters.sort === "Name A-Z") {
        sortOptions["info.results.data.title"] = 1;
      }
    }

    const filteredAnimes = await animeCollection
      .find(query)
      .project({ "info.results.data": 1, _id: 0 })
      .sort(sortOptions)
      .limit(36)
      .toArray();

    return filteredAnimes;
  } finally {
    await client.close();
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      type: searchParams.get("type"),
      status: searchParams.get("status"),
      rating: searchParams.get("rating"),
      score: searchParams.get("score"),
      season: searchParams.get("season"),
      language: searchParams.get("language"),
      genres: searchParams.getAll("genre"),
      keyword: searchParams.get("keyword"),
      sort: searchParams.get("sort"),
    };

    const filteredAnimes = await getFilteredAnime(filters);
    return new Response(JSON.stringify(filteredAnimes), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch filtered anime", { status: 500 });
  }
}
