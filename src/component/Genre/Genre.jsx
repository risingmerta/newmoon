"use client";
import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/component/loadingSpinner";
import "./genre.css";
import Link from "next/link";
export default function Genre(props) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const list = isCollapsed ? props.data?.slice(0, 18) : props.data;
  const handleNavigation = () => {};

  function replaceAndCapitalize(str) {
    return str
      .replace(/-/g, " ") // Replace hyphens with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  }

  const genreList = list?.map((el, idx) => {
    return (
      <Link
        key={idx}
        href={`/genre?id=${el}&name=${el}&refer=${props.refer}`}
        onClick={handleNavigation}
      >
        <div>{replaceAndCapitalize(el)}</div>
      </Link>
    );
  });

  return (
    <div className="genre-wrapper ">
      <h2>Genre</h2>
      {!props.data ? (
        <LoadingSpinner />
      ) : (
        <div className="genre-list d-flex a-center j-center" style={{}}>
          {genreList}

          <button
            className="f-poppins trans-03"
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            {isCollapsed ? "Show More" : "Show Less"}
          </button>
        </div>
      )}
    </div>
  );
}
