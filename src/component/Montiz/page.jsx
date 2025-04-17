import React from "react";
import MonetizePage from "../monetize/page";
import { SessionProvider } from "next-auth/react";

export default function Montiz() {
  return (
    <div>
      <SessionProvider>
        <MonetizePage />
      </SessionProvider>
    </div>
  );
}
