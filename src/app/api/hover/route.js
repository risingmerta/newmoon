export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Check if 'id' query parameter is provided
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch data from the external API
    const apiUrl = `https://vimal.animoon.me/api/qtip/${id}`;
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch data (${response.status})` }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();

    // Check if data exists
    if (!data || Object.keys(data).length === 0) {
      return new Response(JSON.stringify({ error: "Data not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the fetched data
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
