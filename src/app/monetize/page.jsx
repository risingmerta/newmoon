import Montiz from "@/component/Montiz/page";
import React from "react";

export default async function page({ searchParams }) {
  const searc = await searchParams;
  return (
    <div>
      <Montiz refer={searc.refer} />
      <Advertize direct={searc.refer} />
    </div>
  );
}
