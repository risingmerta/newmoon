import {NextResponse } from "next/server";

export async function GET(
  req,
) {
  const episode = await fetch(`https://hianimes.animoon.me/anime/random?page=1`, {cache: 'no-store'});
  return NextResponse.json(episode);
}
 
export const revalidate = 0