"use client";
import { useEffect } from "react";

export default function Page() {
  const changeUrl = () => {
    window.history.pushState(null, "", "/new-url"); // Change URL without navigating
  };

  return (
    <div>
      <p>Check the URL in the browser!</p>
      <button onClick={changeUrl}>Change URL</button>
    </div>
  );
}
