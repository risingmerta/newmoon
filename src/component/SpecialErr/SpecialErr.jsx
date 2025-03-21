import React from "react";
import "./specialErr.css";
import Image from "next/image";
export default function Error() {
  return (
    <div
      style={{ marginTop: "65px" }}
      className="gogoanime-error d-flex-fd-column a-center j-center"
    >
      <img src={'https://cdn.otakugifs.xyz/gifs/cool/d2776011d23a58d9.gif'} alt="error"/>
      <h2>So,you have decided to start a new anime...;)</h2>
    </div>
  );
}