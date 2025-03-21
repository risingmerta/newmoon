import Advertize from "@/component/Advertize/Advertize";
import Home from "@/component/Home/Home";

export default async function Page() {
  // Fetch data from the API route
  const res = await fetch(`https://homio.animoon.me/api/home`,{cache: 'no-store'});

  // Check if the request was successful
  if (!res.ok) {
    console.error("Failed to fetch data");
    return;
  }

  const { data, existingAnime } = await res.json();
  return (
    <div>
      <Home data={data} existingAnime={existingAnime} />
      <Advertize />
    </div>
  );
}
