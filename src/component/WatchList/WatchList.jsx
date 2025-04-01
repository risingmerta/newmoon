"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Card from "../Card/Card";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaHeart,
} from "react-icons/fa";
import "./watchList.css";
import { useSession } from "next-auth/react";

const TYPE_MAP = {
  1: "Watching",
  2: "On-Hold",
  3: "Plan to Watch",
  4: "Dropped",
  5: "Completed",
};

const WatchList = ({ type, ipage }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(parseInt(ipage) || 1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(parseInt(ipage) || 1);
  }, [ipage]);

  useEffect(() => {
    if (userId) {
      migrateLocalStorageToMongoDB(userId);
      fetchWatchlist(userId, type, page);
    }
  }, [userId, type, page]);

  const fetchWatchlist = useCallback(async (userId, type, page) => {
    if (!userId) return;

    const typeLabel = TYPE_MAP[type]; // Get the label (e.g., "Watching") based on number

    const url = typeLabel
      ? `/api/watchlist?userId=${userId}&type=${encodeURIComponent(
          typeLabel
        )}&page=${page}&pageSize=24`
      : `/api/watchlist?userId=${userId}&page=${page}&pageSize=24`;

    const res = await fetch(url);
    if (res.ok) {
      const { data, totalPages } = await res.json();
      setData(data);
      setTotalPages(totalPages);
    }
  }, []);

  const migrateLocalStorageToMongoDB = async (userId) => {
    if (!userId) return;
    for (const key in TYPE_MAP) {
      const localData = localStorage.getItem(`animeData_${key}`);
      if (localData) {
        const animeList = JSON.parse(localData);
        for (const anime of animeList) {
          await fetch("/api/watchlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ anime: { ...anime, type: key, userId } }),
          });
        }
        localStorage.removeItem(`animeData_${key}`);
      }
    }
  };

  const currentPage = parseInt(page) || 1;
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
  const getOptionName = (type) => {
    switch (type) {
      case "1":
        return "Watching";
      case "2":
        return "On-Hold";
      case "3":
        return "Plan to Watch";
      case "4":
        return "Dropped";
      case "5":
        return "Completed";
      default:
        return "All";
    }
  };

  return (
    <div className="alltio">
      <div className="allInnr">
        <div className="entFa">
          <div className="watCFa">
            <div className="watC">
              <FaHeart />
              Watch List
            </div>
          </div>
          <div className="butM">
            <div className="butInnM">
              <Link
                href="/user/watch-list"
                className={`namil ${!type ? "selectedNO" : ""}`}
              >
                All
              </Link>
              {Object.keys(TYPE_MAP).map((key) => (
                <Link
                  key={key}
                  href={`/user/watch-list?type=${key}`}
                  className={`oamil ${type === key ? "selectedNO" : ""}`}
                >
                  {TYPE_MAP[key]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="ddidd">
        <div className="drd-col">
          <div className="darg d-flex a-center j-center">
            {data?.length > 0 ? (
              data?.map((anime, idx) => (
                <Card
                  key={anime?.id}
                  data={anime}
                  delay={idx * 0.05}
                  itsMe={"true"}
                />
              ))
            ) : (
              <div className="EmLi">
                  <div className="listEmp">
                    {getOptionName(type)} list is empty
                  </div>
                  <div className="adviso">{'<^ Add some animes to the list ^>'}</div>
                  <div className="flex adviso-1">
                    <div>\__---</div>
                    <div className="adviso">/\/\/\/\/\/\</div>
                    <div>---__/</div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="paginA">
          {currentPage > 1 && (
            <>
              <Link
                href={
                  type ? `/user/watch-list?type=${type}` : `/user/watch-list`
                }
                className="pagin-tile"
              >
                <FaAngleDoubleLeft />
              </Link>
              <Link
                href={
                  type
                    ? `/user/watch-list?type=${type}&page=${currentPage - 1}`
                    : `/user/watch-list?page=${currentPage - 1}`
                }
                className="pagin-tile"
              >
                <FaAngleLeft />
              </Link>
            </>
          )}

          {useArr.map((ii) => (
            <Link
              key={ii}
              href={
                type
                  ? ii === 1
                    ? `/user/watch-list?type=${type}`
                    : `/user/watch-list?type=${type}&page=${ii}`
                  : ii === 1
                  ? `/user/watch-list`
                  : `/user/watch-list?page=${ii}`
              }
              className={`pagin-tile ${ii === currentPage ? "pagin-colo" : ""}`}
            >
              {ii}
            </Link>
          ))}

          {currentPage < totalPages && (
            <>
              <Link
                href={
                  type
                    ? `/user/watch-list?type=${type}&page=${currentPage + 1}`
                    : `/user/watch-list?page=${currentPage + 1}`
                }
                className="pagin-tile"
              >
                <FaAngleRight />
              </Link>
              <Link
                href={
                  type
                    ? `/user/watch-list?type=${type}&page=${totalPages}`
                    : `/user/watch-list?page=${totalPages}`
                }
                className="pagin-tile"
              >
                <FaAngleDoubleRight />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WatchList;
