"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import MouseOverCard from "./MouseOverCard";
import { FaClosedCaptioning, FaPlayCircle } from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import Image from "next/image";
import "./card.css";

// Loading Component
function Loading({ loading, progress }) {
  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: "4px",
        backgroundColor: "#00f2fe",
        zIndex: 9999,
        transition: "width 0.3s ease",
      }}
    />
  );
}

// Card Component
function Card({
  data,
  collectionName,
  IsLoading,
  keepIt,
  itsMe,
  selectL,
  length,
  datr,
  refer,
}) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { id, name, poster, rating, episodes, duration, Secds, epNo } =
    data || {};
  const totalSeconds = duration || 0;
  const totalSecondsTimo = Secds || 0;

  const formatTime = (total) => {
    const minutes = Math.floor(total / 60);
    const seconds = Math.floor(total % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const percentage = totalSecondsTimo
    ? (totalSecondsTimo / totalSeconds) * 100
    : 0;

  const handleNavigation = () => {
    if (pathname.includes("/watch/")) return; // Already on a watch page
    let timer;

    setLoading(true);
    setProgress(30);

    timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    }, 800);
  };

  const title = selectL === "en" ? data.title : data.japanese_title;
  let columns = 6;
  if (length < 6) {
    columns = length;
  }

  return (
    <>
      <Loading loading={loading} progress={progress} />
      <div
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        className={`anime-card-wrapper ${
          length < 6 ? `anime-card-wrapper${columns}` : ""
        }`}
      >
        <Link
          href={`${
            collectionName !== "Top Upcoming"
              ? `/watch/${data.id}${refer ? `?refer=${refer}` : ""}`
              : `/${data.id}${refer ? `?refer=${refer}` : ""}`
          }`}
          onClick={handleNavigation}
          className="anime-card d-flex"
        >
          <div className="anime-card-img-wrapper">
            {screenWidth > 1150 && isHovered && (
              <div className="img-blur d-flex a-center j-center">
                <FaPlayCircle color="white" size={70} />
              </div>
            )}
            {data.adultContent ||
              (data?.tvInfo?.rating && (
                <span className="rating">
                  {datr === "yes"
                    ? data?.tvInfo?.rating
                      ? "18+"
                      : ""
                    : data?.adultContent
                    ? "18+"
                    : ""}
                </span>
              ))}
            <div className="tick-item">
              {(data?.tvInfo?.sub || data?.episodes?.sub) && (
                <span
                  className={`episode-count ${
                    data?.tvInfo?.dub || data?.episodes?.dub
                      ? "extra-epi-co"
                      : ""
                  }`}
                >
                  <FaClosedCaptioning size={14} />{" "}
                  {data?.tvInfo?.sub || data?.episodes?.sub}
                </span>
              )}
              {(itsMe === "true" && data?.episodes?.dub > 0) ||
              (itsMe !== "true" && data?.tvInfo?.dub > 0) ? (
                <span className="episode-count-dub d-flex a-center j-center">
                  <AiFillAudio size={14} />{" "}
                  {itsMe === "true" ? data?.episodes?.dub : data?.tvInfo?.dub}
                </span>
              ) : null}
            </div>
            <img
              src={data.poster}
              alt="anime-card"
              className="anime-card-img"
            />
          </div>
          <div className="card-details">
            <span className="card-title">
              {title?.length > 15 ? `${title.slice(0, 15)}...` : title}
            </span>
            {keepIt ? (
              <div className="card-statK">
                <div className="timoInfo">
                  <div className="epnt">
                    <div>EP</div>
                    <div>{epNo}</div>
                  </div>
                  <div className="durnt">
                    <div className="durntS">{formatTime(totalSecondsTimo)}</div>
                    <div className="durntM">/</div>
                    <div className="durntL">{formatTime(totalSeconds)}</div>
                  </div>
                </div>
                <div className="scaling">
                  <div
                    className="inlino"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="card-statistics">
                <span>
                  {datr === "yes"
                    ? data?.duration
                    : data.tvInfo?.duration || "23m"}
                </span>
                <div className="dot">&#x2022;</div>
                <span>{data.tvInfo?.showType || "TV"}</span>
              </div>
            )}
          </div>
        </Link>
        {screenWidth > 1150 && isHovered && data && (
          <MouseOverCard
            data={data}
            id={
              datr === "yes" || itsMe === "true"
                ? data.id.split("-").pop()
                : data.data_id
            }
          />
        )}
      </div>
    </>
  );
}

export default Card;
