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
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(parseInt(ipage) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Debugging: Check when userId becomes available
  useEffect(() => {
    console.log("Updated userId:", userId);
  }, [userId]);

  // Wait until session is fully loaded
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    setPage(parseInt(ipage) || 1);
  }, [ipage]);

  useEffect(() => {
    if (!userId) return; // Ensures userId is available before running migration & fetching

    const migrateAndFetch = async () => {
      await migrateLocalStorageToMongoDB(userId);
      fetchWatchlist(userId, type, page);
    };

    migrateAndFetch();
  }, [userId, type, page]);

  const fetchWatchlist = useCallback(async (userId, type, page) => {
    if (!userId) return;

    const typeLabel = TYPE_MAP[type];

    const url = typeLabel
      ? `/api/watchlist?userId=${userId}&type=${encodeURIComponent(
          typeLabel
        )}&page=${page}&pageSize=24`
      : `/api/watchlist?userId=${userId}&page=${page}&pageSize=24`;

    try {
      const res = await fetch(url);
      if (res.ok) {
        const { data, totalPages } = await res.json();
        setData(data);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  }, []);

  const migrateLocalStorageToMongoDB = async (userId) => {
    if (!userId) return;

    const migrationPromises = [];

    for (const key in TYPE_MAP) {
      const localData = localStorage.getItem(`animeData_${key}`);
      if (localData) {
        try {
          const animeList = JSON.parse(localData);
          const typeLabel = TYPE_MAP[key];

          const uploadPromises = animeList.map((anime) =>
            fetch("/api/watchlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...anime, type: typeLabel, userId }),
            })
          );

          await Promise.all(uploadPromises);
          localStorage.removeItem(`animeData_${key}`);
        } catch (error) {
          console.error("Error migrating data for type", typeLabel, error);
        }
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

  const getOptionName = (type) => TYPE_MAP[type] || "All";

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
              data.map((anime, idx) => (
                <Card key={anime?.id} data={anime} delay={idx * 0.05} itsMe="true" />
              ))
            ) : (
              <div className="EmLi">
                <div className="listEmp">{getOptionName(type)} list is empty</div>
                <div className="adviso">{"<^ Add some animes to the list ^>"}</div>
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
                href={type ? `/user/watch-list?type=${type}` : `/user/watch-list`}
                className="pagin-tile"
              >
                <FaAngleDoubleLeft />
              </Link>
              <Link
                href={type ? `/user/watch-list?type=${type}&page=${currentPage - 1}` : `/user/watch-list?page=${currentPage - 1}`}
                className="pagin-tile"
              >
                <FaAngleLeft />
              </Link>
            </>
          )}

          {useArr.map((ii) => (
            <Link
              key={ii}
              href={type ? `/user/watch-list?type=${type}&page=${ii}` : `/user/watch-list?page=${ii}`}
              className={`pagin-tile ${ii === currentPage ? "pagin-colo" : ""}`}
            >
              {ii}
            </Link>
          ))}

          {currentPage < totalPages && (
            <>
              <Link
                href={type ? `/user/watch-list?type=${type}&page=${currentPage + 1}` : `/user/watch-list?page=${currentPage + 1}`}
                className="pagin-tile"
              >
                <FaAngleRight />
              </Link>
              <Link
                href={type ? `/user/watch-list?type=${type}&page=${totalPages}` : `/user/watch-list?page=${totalPages}`}
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
