import Advertize from "@/component/Advertize/Advertize";
import ResetPass from "@/component/ResetPass/page";
import React from "react";

export default async function page({ params }) {
  const param = await params;

  console.log("token", param.token);
  return (
    <div>
      <ResetPass token={param.token} />
    </div>
  );
}
