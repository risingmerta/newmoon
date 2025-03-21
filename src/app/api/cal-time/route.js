export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");
  
    // Check if date and time are provided
    if (!date || !time) {
      return new Response(
        JSON.stringify({ error: "Invalid date or time" }),
        { status: 400 }
      );
    }
  
    const startTime = new Date(`${date} ${time}`).getTime();
    const now = Date.now();
    const difference = Math.floor((now - startTime) / 1000); // Convert to seconds
  
    // Return the time difference as JSON
    return new Response(
      JSON.stringify({ difference }),
      { status: 200 }
    );
  }
  