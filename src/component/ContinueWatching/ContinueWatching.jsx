"use client";
import React, { useState, useEffect } from "react";
import "./continueWatching.css";
import Card from "../Card/Card";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaHistory,
} from "react-icons/fa";
import Link from "next/link";

const MyComponent = (props) => {
  const [data, setData] = useState([]);
  const [arr, setArr] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAnimes = localStorage.getItem("Recent-animes");
      const animeArray = storedAnimes ? storedAnimes.split(",") : [];

      setArr(animeArray);
      setTotalPages(Math.ceil(animeArray.length / 24));
    }
  }, []);

  const currentPage = parseInt(props.page) || 1;
  const pageSize = 24;

  const getPage = (pageNumber) => {
    return arr.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  };

  useEffect(() => {
    const datal = [];
    getPage(currentPage)?.forEach((id) => {
      const obj = {
        id,
        poster: localStorage.getItem(`imgUra-${id}`) || "",
        duration: localStorage.getItem(`duran-${id}`) || "",
        rating: localStorage.getItem(`ratUra-${id}`) || "",
        episodes: {
          sub: localStorage.getItem(`subEp-${id}`) || "",
          dub: localStorage.getItem(`dubEp-${id}`) || "",
        },
        name: localStorage.getItem(`nameUra-${id}`) || "",
        episodeId: localStorage.getItem(`Rewo-${id}`) || "",
        epNo: localStorage.getItem(`epNumo-${id}`) || "",
      };
      datal.push(obj);
    });

    setData(datal);
  }, [arr, currentPage]);

  let useArr = [];
  if (totalPages <= 3) {
    useArr = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPage < 3) {
    useArr = [1, 2, 3];
  } else if (currentPage >= totalPages - 1) {
    useArr = [totalPages - 2, totalPages - 1, totalPages];
  } else {
    useArr = [currentPage - 1, currentPage, currentPage + 1];
  }

  return (
    <div className="contiAll">
      <div className="conticFa">
        <div className="contic">
          <FaHistory />
          Continue Watching
        </div>
      </div>

      <div className="midd">
        <div className="crd-col">
          <div className="carg d-flex a-center j-center">
            {data.map((anime, idx) => (
              <Card key={anime.id} data={anime} delay={idx * 0.05} keepIt="true" />
            ))}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="paginA">
          {currentPage > 1 && (
            <>
              <Link href={`/user/continue-watching?refer=${props.refer}`} className="pagin-tile">
                <FaAngleDoubleLeft />
              </Link>
              <Link href={`/user/continue-watching?page=${currentPage - 1}&refer=${props.refer}`} className="pagin-tile">
                <FaAngleLeft />
              </Link>
            </>
          )}

          {useArr.map((pageNum) => (
            <Link
              key={pageNum}
              href={`/user/continue-watching?page=${pageNum}&refer=${props.refer}`}
              className={`pagin-tile ${currentPage === pageNum ? "pagin-colo" : ""}`}
            >
              {pageNum}
            </Link>
          ))}

          {currentPage < totalPages && (
            <>
              <Link href={`/user/continue-watching?page=${currentPage + 1}&refer=${props.refer}`} className="pagin-tile">
                <FaAngleRight />
              </Link>
              <Link href={`/user/continue-watching?page=${totalPages}&refer=${props.refer}`} className="pagin-tile">
                <FaAngleDoubleRight />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MyComponent;
