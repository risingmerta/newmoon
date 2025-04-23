"use client"
import React from "react";
import MonetizePage from "../monetize/page";
import { SessionProvider } from "next-auth/react";

export default function Montiz(props) {
  return (
    <div>
      <SessionProvider>
        <MonetizePage refer={props.refer}/>
      </SessionProvider>
    </div>
  );
}
