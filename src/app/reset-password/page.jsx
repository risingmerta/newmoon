import ResetPass from "@/component/ResetPass/page";
import React from "react";

export default async function Page({ searchParams }) {
  const searchParam = await searchParams; // Await the params Promise

  return (
    <div>
      <ResetPass token={searchParam.token} />
    </div>
  );
}
