"use client";
import React, { useEffect, useState, useRef } from "react";
// import LoadingSpinner from "@/component/loadingSpinner";
import "./AnimeInfo.css";
import Link from "next/link";
import {
  FaClosedCaptioning,
  FaPlay,
  FaPlayCircle,
  FaPlus,
} from "react-icons/fa";
import Share from "../Share/Share";
import { AiFillAudio } from "react-icons/ai";
// import { useLogModal } from "@/context/LogModalContext";
import { useSession } from "next-auth/react";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import { PiBroadcastFill } from "react-icons/pi";
import Script from "next/script";
import { usePathname } from "next/navigation";
import CopyUrlButton from "../CopyUrlButton/CopyUrlButton";

function transformURL(originalURL) {
  if (!originalURL) return null; // Handle null/undefined cases

  // Extract the 32-character hash from the original URL
  const idMatch = originalURL.match(/\/([a-f0-9]{32})\.jpg$/);
  if (!idMatch) return originalURL; // Return original URL if no match

  const id = idMatch[1]; // Full hash ID
  const part1 = id.substring(0, 2); // First 2 characters
  const part2 = id.substring(2, 4); // Next 2 characters

  // Construct the new URL
  return `https://img.flawlessfiles.com/_r/300x400/100/${part1}/${part2}/${id}/${id}.jpg`;
}

export default function Details(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [logIsOpen, setLogIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const localStorageWrapper = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      return {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
        clear: () => localStorage.clear(),
      };
    } else {
      // Handle the case when localStorage is not available
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
      };
    }
  };

  // Usage
  const ls = localStorageWrapper();

  const handleNavigation = () => {};

  const { data: session } = useSession();

  // const { setLogIsOpen } = useLogModal();

  const handleOptionClick = (option) => {
    if (!session) {
      // console.log(setLogIsOpen);
      setLogIsOpen(true);
      // window.location.href = "/user/watch-list";
    }
    console.log(`Selected option: ${option}`);
    setIsOpen(false); // Close the dropdown after selection

    // Create a new object with the selected data and timestamp
    const newObj = {
      id: props?.id,
      poster: props.uiui?.info?.results?.data?.poster,
      duration: props.uiui?.info?.results?.data?.animeInfo?.tvInfo?.duration,
      rating: props.uiui?.info?.results?.data?.animeInfo?.tvInfo?.rating,
      episodes: {
        sub: props.uiui?.info?.results?.data?.animeInfo?.tvInfo?.sub,
        dub: props.uiui?.info?.results?.data?.animeInfo?.tvInfo?.dub
          ? props.uiui?.info?.results?.data?.animeInfo?.tvInfo?.dub
          : "",
      },
      name: props.uiui?.info?.results?.data?.title,

      timestamp: new Date().toISOString(), // Add current time in ISO format
    };

    // Define option keys
    const options = [
      "Watching",
      "On-Hold",
      "Plan to Watch",
      "Dropped",
      "Completed",
    ];

    // Remove the entry from all options' local storage if it exists
    options.forEach((opt) => {
      const key = `animeData_${opt}`;
      let data = JSON.parse(localStorage.getItem(key)) || [];
      data = data.filter((item) => item.id !== newObj.id);
      localStorage.setItem(key, JSON.stringify(data));
    });

    // Create dynamic key for the current option
    const currentKey = `animeData_${option}`;

    // Retrieve existing data from local storage for the current option
    let currentData = JSON.parse(localStorage.getItem(currentKey)) || [];

    // Check if the id already exists in the current option's data
    const index = currentData.findIndex((item) => item.id === newObj.id);

    if (index !== -1) {
      // Update existing entry if it exists
      currentData[index] = newObj;
    } else {
      // Add new entry if it does not already exist
      currentData.push(newObj);
    }

    // Store the updated current data back to local storage
    localStorage.setItem(currentKey, JSON.stringify(currentData));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const gnt = props.uiui.info.results.data;
  // if (props.uiui) {
  //   props.lata(props?.uiui?.recommendedAnimes);
  // }

  const [descIsCollapsed, setDescIsCollapsed] = useState(true);
  const genre = gnt?.animeInfo?.Genres?.map((genre) => {
    return (
      <Link
        className="genre-button"
        key={genre}
        href={`/genre?id=${genre}&name=${genre}`}
        onClick={handleNavigation}
      >
        {genre}
      </Link>
    );
  });

  const producers = gnt?.animeInfo?.Producers?.map((producer) => {
    return (
      <Link
        key={producer}
        href={`/producer?name=${producer}`}
        onClick={handleNavigation}
      >
        {producer + ", "}
      </Link>
    );
  });

  const studios = gnt?.animeInfo?.Studios;
  const synonyms = gnt?.animeInfo.Synonyms;

  const watch2gether = () => {
    if (!session) {
      setLogIsOpen(true);
    }
  };

  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adContainer = document.getElementById("ad-container");
      if (adContainer) {
        adContainer.innerHTML = `
            <iframe
              src="/ad"
              style="width: fit-content; height: 100px; border: none; overflow: hidden;"
              scrolling="no"
            ></iframe>
          `;
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adContainer = document.getElementById("ad-container2");
      if (adContainer) {
        adContainer.innerHTML = `
            <iframe
              src="/ad2"
              style="width: fit-content; height: 100px; border: none; overflow: hidden;"
              scrolling="no"
            ></iframe>
          `;
      }
    } 
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adContainer = document.getElementById("ad-container3");
      if (adContainer) {
        adContainer.innerHTML = `
            <iframe
              src="/ad3"
              style="width: fit-content; height: 100px; border: none; overflow: hidden;"
              scrolling="no"
            ></iframe>
          `;
      }
    }
  }, [pathname]);

  return (
    <>
      <SignInSignUpModal setLogIsOpen={setLogIsOpen} logIsOpen={logIsOpen} />

      <div className="details-container">
        <div
          id="ad-container2"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        ></div>
        <div className="details-header">
          <div className="details-header-primary">
            <img
              className="details-container-background"
              src={gnt?.poster}
              alt="pop"
              isAnimated={false}
            />
            <div className="anime-details d-flex">
              <div className="anime-details-containN">
                <div className="anime-image-wrapper">
                  <img
                    className="anime-details-poster"
                    src={gnt?.poster}
                    alt="pop"
                  />
                </div>
                {gnt?.animeInfo?.Status !== "Not-yet-aired" && (
                  <Link
                    href={
                      session ? `/watch2gether/create?animeId=${props?.id}&refer=${props.refer}` : ""
                    }
                    className="broad-fil"
                    onClick={watch2gether}
                  >
                    <div className="broad-ico">
                      <PiBroadcastFill />
                    </div>
                    <div>Watch2gether</div>
                  </Link>
                )}
              </div>

              <div className="anime-details-content">
                <div className="flex gap-1 items-center specif">
                  <Link href={`/?refer=${props.refer}`} onClick={handleNavigation}>
                    <div className="homo">Home</div>
                  </Link>
                  <div className="dotoi">&#x2022;</div>
                  <div className="homo">{gnt?.animeInfo?.tvInfo?.showType}</div>
                  <div className="doto">&#x2022;</div>
                  <div className="namo">
                    {props.selectL === "en" ? gnt?.title : gnt?.japanese_title}
                  </div>
                </div>
                <h1 className="title-large">
                  {props.selectL === "en" ? gnt?.title : gnt?.japanese_title}
                </h1>

                <div className="newSpice">
                  <div className="innerSpice">
                    <div className="rat">{gnt?.animeInfo?.tvInfo?.rating}</div>
                    <div className="qual">
                      {gnt?.animeInfo?.tvInfo?.quality}
                    </div>
                    <div className="subE">
                      <FaClosedCaptioning size={14} />{" "}
                      {gnt?.animeInfo?.tvInfo?.sub || "Unknown"}
                    </div>
                    {gnt?.animeInfo?.tvInfo?.dub ? (
                      <div className="dubE">
                        <AiFillAudio size={14} />{" "}
                        {gnt?.animeInfo?.tvInfo?.dub || "Unknown"}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="doto">&#x2022;</div>
                  <div className="typo">{gnt?.animeInfo?.tvInfo?.showType}</div>
                  <div className="doto">&#x2022;</div>
                  <div className="duran">
                    {gnt?.animeInfo?.tvInfo?.duration}
                  </div>
                </div>
                <div className="button-wrapper">
                  {gnt?.animeInfo?.Status !== "Not-yet-aired" && (
                    <Link
                      href={`${
                        ls.getItem(`Rewo-${props?.id}`)
                          ? `/watch/${ls.getItem(`Rewo-${props?.id}`)}?refer=${props.refer}`
                          : `/watch/${props?.id}?refer=${props.refer}`
                      }`}
                      className="btn-primary hero-button"
                      onClick={handleNavigation}
                    >
                      <div>
                        <FaPlay size={12} />
                      </div>
                      <div>Watch Now</div>
                    </Link>
                  )}
                  <div className="dropdown-container" ref={dropdownRef}>
                    <button
                      className="btn-secondary-list hero-button"
                      onClick={() => {
                        toggleDropdown();
                      }}
                    >
                      <div>
                        <FaPlus size={12} />
                      </div>
                      <div>{props.rand ? "Details" : "Add to List"}</div>
                    </button>
                    {isOpen && (
                      <ul className="dropdown-menu">
                        {[
                          "Watching",
                          "On-Hold",
                          "Plan to Watch",
                          "Dropped",
                          "Completed",
                        ].map((option) => (
                          <li
                            key={option}
                            onClick={() => handleOptionClick(option)}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <p>
                  {descIsCollapsed
                    ? gnt?.animeInfo?.Overview?.slice(0, 350) + "..."
                    : gnt?.animeInfo?.Overview}
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => setDescIsCollapsed((prev) => !prev)}
                  >
                    [ {descIsCollapsed ? "More" : "Less"} ]
                  </span>
                </p>
                <p>
                  Animoon is the best site to watch{" "}
                  {props.selectL === "en" ? gnt?.title : gnt?.japanese_title}{" "}
                  SUB online, or you can even watch{" "}
                  {props.selectL === "en" ? gnt?.title : gnt?.japanese_title}{" "}
                  DUB in HD quality. You can also find {gnt?.animeInfo?.Studios}{" "}
                  anime on Animoon website.
                </p>
                <Share
                  style={{ padding: 0, margin: 0 }}
                  ShareUrl={props.ShareUrl}
                  arise={props.arise}
                />
                <CopyUrlButton url={props.ShareUrl}/>
              </div>
            </div>
          </div>

          <div className="details-header-secondary">
            <div className="details-header-statistics">
              <p>
                <b>Japanese: </b> {gnt?.japanese_title}
              </p>
              <p>
                <b>Synonyms: </b>{" "}
                {gnt?.animeInfo?.Synonyms
                  ? gnt?.animeInfo?.Synonyms?.length > 0
                    ? synonyms
                    : "N/A"
                  : ""}
              </p>
              <p>
                <b>Aired: </b>
                {gnt?.animeInfo?.Aired || "?"}
              </p>
              <p>
                <b>Duration: </b> {gnt?.animeInfo?.tvInfo?.duration || "NA"}
              </p>
              <p>
                <b>Score: </b> {gnt?.animeInfo["MAL Score"]}
              </p>
              <p>
                <b>Status: </b> {gnt?.animeInfo?.Status}
              </p>
              <p>
                <b>Premiered: </b>{" "}
                {gnt?.animeInfo?.Premiered || "Season: ?" + " "}
              </p>
            </div>
            <div className="details-header-genre">
              <p>
                <b>Genre: </b>
                {genre}
              </p>
            </div>
            <p>
              <b>Producers: </b>
              {producers}
            </p>
            <p>
              <b>Studios: </b>
              {studios}
            </p>
          </div>
        </div>
      </div>
      {/* <div style={{ width: "fit-content", height: "100px", overflow: "hidden" }}> */}
      {/* Ad container */}
      <div
        id="ad-container"
        style={{ 
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      ></div>
      {/* </div> */}
      <div
        id="ad-container3"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      ></div>
    </>
  );
}
