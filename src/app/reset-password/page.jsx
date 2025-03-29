import ResetPass from "@/component/ResetPass/page";
import React from "react";

export default async function Page({ params }) {
  const { token } = await params; // Await the params Promise
  console.log("token:", token);

  return (
    <div>
      <ResetPass token={token} />
    </div>
  );
}
