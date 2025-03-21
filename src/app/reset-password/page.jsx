import Advertize from "@/component/Advertize/Advertize";
import ResetPass from "@/component/ResetPass/page";
import React from "react";

export default async function page({ params }) {
  const param = await params;
  return (
    <div>
      <ResetPass token={param.token} />
      <Advertize/>
    </div>
  );
}
