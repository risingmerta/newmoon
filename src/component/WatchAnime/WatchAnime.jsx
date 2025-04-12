"use client";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import "./watch-anime.css";
import RecommendedTopTen from "@/layouts/RecommendedTopTen";
import Share from "@/component/Share/Share";
import Link from "next/link";
import { AiFillAudio } from "react-icons/ai";
import loading from "../../../public/placeholder.gif";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import {
  FaAngleDown,
  FaBackward,
  FaClosedCaptioning,
  FaForward,
  FaList,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import Comments from "@/component/Comments/Comments";
import { HiOutlineSignal } from "react-icons/hi2";
import ArtPlayer from "@/component/Artplayer";
import { usePathname, useRouter } from "next/navigation";
import LoadingSpinner from "@/component/loadingSpinner";
import Image from "next/image";
import { SessionProvider, useSession } from "next-auth/react";
import { FaCirclePlay } from "react-icons/fa6";
import SignInSignUpModal from "@/component/SignSignup/SignInSignUpModal";
import { Lily_Script_One } from "next/font/google";
import { PiBroadcastFill } from "react-icons/pi";

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

export default function WatchAnime(props) {
  const router = useRouter();
  const dropdownRef = useRef(null); // Reference for the dropdown
  const dropdownSecRef = useRef(null); // Reference for the dropdown
  const [isLoading, setIsLoading] = useState(false);
  const IsLoading = (data) => {
    if (data) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, [20000]);
    }
  };
  const handleNavigation = () => {};
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

  const [clickedId, setClickedId] = useState(props.epId);
  const [serverName, setServerName] = useState("Vidstreaming");
  const [descIsCollapsed, setDescIsCollapsed] = useState(true);
  const [quality, setQuality] = useState("");

  const [subIsSelected, setSubIsSelected] = useState(() => {
    const isDubSelected = ls.getItem("subordub") === "false";
  
    const hasDubEpisodes = props.datao?.results.data.animeInfo.tvInfo.dub > 0;
    const hasDubData = props.datajDub?.results;
    const hasSubData = props.datajSub?.results;
  
    // If sub data is not available, force false (aka: dub)
    if (!hasSubData) {
      return false;
    }
  
    if (isDubSelected) {
      if (hasDubEpisodes && hasDubData) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  });
  

  const [selectedServer, setSelectedServer] = useState(0);
  const [bhaiLink, setBhaiLink] = useState(() => {
    const isDubSelected = ls.getItem("subordub") === "false";

    // If props.dataj is empty, use props.dubPri for dub or props.subPri for sub
    // Check if dub episodes exist in `props.datao`
    const hasDubEpisodes = props.datao?.results.data.animeInfo.tvInfo.dub > 0;

    // Check if dub data exists in `props.dataStr`
    const hasDubData = props.datajDub?.results;

    // Handle Dub selection
    if (isDubSelected) {
      if (hasDubEpisodes && hasDubData) {
        // Check if there's a dub available in props.dataj
        const dubLink = props.datajDub?.results?.streamingLink.link?.file;

        // If not found in dataj, fallback to gogoDub
        if (dubLink) {
          return dubLink;
        }
      } else {
        const subLink = props.datajSub?.results?.streamingLink.link?.file;

        // If not found in dataj, fallback to gogoSub
        if (subLink) {
          return subLink;
        }
      }
    }
    // Handle Sub/Raw selection
    else {
      const subLink = props.datajSub?.results?.streamingLink.link?.file;

      // If not found in dataj, fallback to gogoSub
      if (subLink) {
        return subLink;
      }
    }

    // Default to an empty string if nothing is found
    return "";
  });

  const [introd, setIntrod] = useState(
    ls.getItem("subordub") === "false" && props.datajDub?.results
      ? props.datajDub?.results?.streamingLink.intro
      : props.datajSub?.results?.streamingLink.intro
  );
  const [outrod, setOutrod] = useState(
    ls.getItem("subordub") === "false" && props.datajDub?.results
      ? props.datajDub?.results?.streamingLink.outro
      : props.datajSub?.results?.streamingLink.outro
  );
  const [subtitles, setSubtitles] = useState(
    props.datajSub?.results?.streamingLink.tracks
  );
  const [onn1, setOnn1] = useState(
    ls.getItem("Onn1") ? ls.getItem("Onn1") : "Off"
  );
  const [onn2, setOnn2] = useState(
    ls.getItem("Onn2") ? ls.getItem("Onn2") : "Off"
  );
  const [onn3, setOnn3] = useState(
    ls.getItem("Onn3") ? ls.getItem("Onn3") : "Off"
  );
  ls.setItem(`Rewo-${props.anId}`, props.epId);

  let epiod = props.epiod;

  const handleOn1 = () => {
    if (onn1 === "Off") {
      ls.setItem("Onn1", "On");
      ls.setItem("autoPlay", "true");
      setOnn1("On");
    }
    if (onn1 === "On") {
      ls.setItem("Onn1", "Off");
      ls.setItem("autoPlay", "false");
      setOnn1("Off");
    }
  };

  const handleOn2 = () => {
    if (onn2 === "Off") {
      ls.setItem("Onn2", "On");
      ls.setItem("autoNext", "true");
      setOnn2("On");
    }
    if (onn2 === "On") {
      ls.setItem("Onn2", "Off");
      ls.setItem("autoNext", "false");
      setOnn2("Off");
    }
  };

  ls.setItem(`Epnum-${props.anId}`, epiod.toString());

  const getData = (data) => {
    if (data) {
      if (epiod < props.data.episodes.length) {
        setEpNumb(props.data.episodes[epiod].number);
        router.push(`/watch/${props.data.episodes[epiod].episodeId}`);
        setClickedId(props.data.episodes[epiod].episodeId);
      }
    }
  };

  const handleOn3 = () => {
    if (onn3 === "Off") {
      ls.setItem("Onn3", "On");
      ls.setItem("autoSkipIntro", "true");
      setOnn3("On");
    }
    if (onn3 === "On") {
      ls.setItem("Onn3", "Off");
      ls.setItem("autoSkipIntro", "false");
      setOnn3("Off");
    }
  };
  const sub = subIsSelected === true ? "sub" : "dub";
  // let uu = [];
  // let o = 0;
  // for (o > 0; o < props.datao?.results.data.animeInfo.tvInfo?.dub; o++) {
  //   uu.push(props.data?.results.episodes[o]);
  // }

  /**
   * Based on the inforamtion from useAnimeInfo hook, the episodes array is stored in a variable
   * with 'id' of each episode
   */

  if (ls.getItem(`Watched-${props.anId.toString()}`)) {
    // split the existing values into an array
    let vals = localStorage
      .getItem(`Watched-${props.anId.toString()}`)
      .split(",");

    // if the value has not already been added
    if (!vals.includes(props.epId.toString())) {
      // add the value to the array
      vals.push(props.epId).toString();

      // sort the array

      // join the values into a delimeted string and store it
      ls.setItem(`Watched-${props.anId.toString()}`, vals.join(","));
    }
  } else {
    // the key doesn't exist yet, add it and the new value
    ls.setItem(`Watched-${props.anId.toString()}`, props.epId.toString());
  }

  let episodeList =
    props?.data?.results.episodes?.length > 0
      ? props?.data?.results.episodes
      : null;

  const [value, setValue] = useState("");

  const chunks = [];
  for (let i = 0; i < episodeList.length; i += 100) {
    chunks.push(episodeList.slice(i, i + 100));
  }

  const epNi = Math.ceil(props.epiod / 100);

  const [epList, setEpList] = useState(epNi - 1);

  useEffect(() => {
    if (value) {
      setEpList(Math.ceil(value / 100) - 1);
    } else setEpList(Math.ceil(props.epiod / 100) - 1);
  }, [value]);

  const [lang, setLang] = useState("en");

  const omin = (daat) => {
    setLang(daat);
  };

  // Change this to the desired index
  const [epLisTitle, setEpLisTitle] = useState("");

  useEffect(() => {
    if (episodeList.length > 0) {
      const initialStart = epList * 100 + 1;
      const initialEnd = Math.min((epList + 1) * 100, episodeList.length);
      setEpLisTitle(
        `EPS: ${initialStart.toString().padStart(3, "0")}-${initialEnd
          .toString()
          .padStart(3, "0")}`
      );
    }
  }, [epList, episodeList]);

  useEffect(() => {
    setSubIsSelected(() => {
      // If subtitle data is not available, force dub selection
      if (!props.datajSub) return false;
  
      const isDubSelected = ls.getItem("subordub") === "false";
  
      const hasDubEpisodes =
        props.datao?.results.data.animeInfo.tvInfo?.dub > 0;
  
      const hasDubData = props.datajDub?.results;
  
      if (isDubSelected) {
        return hasDubEpisodes && hasDubData ? false : true;
      } else {
        return true;
      }
    });
  }, [props.datao, props.datajSub, props.datajDub]);
  

  const [epNumb, setEpNumb] = useState(epiod);
  const backward = () => {
    router.push(`/watch/${props.data.results.episodes[epiod - 2]?.id}`);
    setEpNumb(props.data.results.episodes[epiod - 2].number);
  };
  const forward = () => {
    router.push(`/watch/${props.data.results.episodes[epiod]?.id}`);
    setEpNumb(props.data.results.episodes[epiod].episode_no);
  };

  ls.setItem("subordub", subIsSelected ? "true" : "false");

  let speciEp = episodeList.length > 100 ? chunks[epList] : episodeList;

  const episodeButtons = speciEp?.map((el, idx) => {
    const title = lang === "en" ? el.title : el.japanese_title;
    const len = el.episode_no === epiod ? 20 : 30;
    return (
      <Link
        href={`/watch/${el.id}`}
        title={el.title}
        className={`${
          episodeList.length <= 24 ? "episode-tile" : `episode-tile-blocks`
        } ${el.episode_no === epiod ? "selected" : ""} ${
          episodeList.length <= 24
            ? episodeList.length % 2 === 0
              ? idx % 2 === 0
                ? ""
                : "evenL"
              : idx % 2 === 0
              ? "evenL"
              : ""
            : `${el.filler ? "fillero" : "evenL"}`
        } ${
          ls.getItem(`Watched-${props.anId.toString()}`)
            ? ls
                .getItem(`Watched-${props.anId.toString()}`)
                .split(",")
                .includes(el.id)
              ? "idk"
              : "common"
            : "common"
        } ${parseInt(value) === el.episode_no ? "glow-container" : ""}`}
        key={el.id}
        style={
          episodeList.length <= 24
            ? { minWidth: "100%", borderRadius: 0 }
            : null
        }
        onClick={() => setEpNumb(el.episode_no) & setClickedId(el.id)}
      >
        <div>
          {episodeList.length <= 24 ? (
            <div className="eptile">
              {" "}
              <div className="inner-ep">
                <div className="epnumb">{el.episode_no}</div>{" "}
                <div className="eptit">
                  {title.length < len ? title : title.slice(0, len) + "..."}
                </div>
              </div>
              {el.episode_no === epiod ? (
                <div className="cir-p">
                  <FaCirclePlay />
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div className="sing-ep">{el.episode_no}</div>
          )}
        </div>
      </Link>
    );
  });

  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adContainer = document.getElementById("ad-container");
      if (adContainer) {
        adContainer.innerHTML = `
        <iframe
          src="/ad"
          style="width: 100%; height: 100px; border: none; overflow: hidden;"
          scrolling="no"
        ></iframe>
      `;
      }
    }
  }, [pathname]);

  const err = (data) => {
    if (data) {
      if (serverName === "Vidstreaming") {
        const foundLink = props.dataj.results.streamingInfo.find((info) => {
          const isSubOrRaw =
            info.value.decryptionResult?.type === "sub" ||
            info.value.decryptionResult?.type === "raw";
          const isServerHD2 = info.value.decryptionResult.server === "Vidcloud";

          if (subIsSelected) {
            return isSubOrRaw && isServerHD2;
          } else {
            return info.value.decryptionResult?.type === "dub" && isServerHD2;
          }
        });

        setBhaiLink(foundLink?.value.decryptionResult.source.sources[0].file);
        setSelectedServer(1);
        setServerName("Vidcloud");
      }
    }
  };

  let trutie = clickedId === props.epId ? "yaso yaso" : "";
  useEffect(() => {
    if (trutie) {
      if (props.dataj) {
        setBhaiLink(() => {
          const isDubSelected = ls.getItem("subordub") === "false";

          // If props.dataj is empty, use props.dubPri for dub or props.subPri for sub
          // Check if dub episodes exist in `props.datao`
          const hasDubEpisodes =
            props.datao?.results.data.animeInfo.tvInfo?.dub > 0;

          // Check if dub data exists in `props.dataStr`
          const hasDubData = props.datajDub?.results;

          // Handle Dub selection
          if (isDubSelected) {
            if (hasDubEpisodes && hasDubData) {
              // Check if there's a dub available in props.dataj
              const dubLink = props.datajDub?.results?.streamingLink.link?.file;

              // If not found in dataj, fallback to gogoDub
              if (dubLink) {
                return dubLink;
              }
            } else {
              const subLink = props.datajSub?.results?.streamingLink.link?.file;

              // If not found in dataj, fallback to gogoSub
              if (subLink) {
                return subLink;
              }
            }
          }
          // Handle Sub/Raw selection
          else {
            const subLink = props.datajSub?.results?.streamingLink.link?.file;

            // If not found in dataj, fallback to gogoSub
            if (subLink) {
              return subLink;
            }
          }

          // Default to an empty string if nothing is found
          return "";
        });
        setSubtitles(props.datajSub?.results?.streamingLink.tracks);
        setIntrod(
          ls.getItem("subordub") === "false" &&
            // !Array.isArray(props.datajDub)) ||
            props.datajDub?.results
            ? props.datajDub?.results?.streamingLink.intro
            : props.datajSub?.results?.streamingLink.intro
        );
        setOutrod(
          ls.getItem("subordub") === "false" &&
            // !Array.isArray(props.datajDub)) ||
            props.datajDub?.results
            ? props.datajDub?.results?.streamingLink.outro
            : props.datajSub?.results?.streamingLink.outro
        );
      }
    }
  }, [trutie]);

  // Retrieve the value from local storage
  // const valu = ls.getItem("vc_129285_time");
  // console.log("Value:", valu);

  const [isOpen, setIsOpen] = useState(false);

  const [currIdx, setCurrIdx] = useState("");

  const [trigger, setTrigger] = useState(false); // Used to trigger useEffect

  const report = () => {
    setTrigger((prev) => !prev); // Toggle state to trigger API call
  };

  const [resul, setResul] = useState("");

  useEffect(() => {
    if (!trigger) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/reported?id=${props.epId}&cate=${
            props.raw === "yes" ? "raw" : subIsSelected ? "sub" : "dub"
          }`
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        console.log(result);
        setResul(result);
        // Store sub/dub preference
        // const isDubSelected = ls.getItem("subordub") === "false";
        // const hasDubEpisodes = props.datao?.results.data.animeInfo.tvInfo?.dub > 0;
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [trigger]);

  useEffect(() => {
    if (!resul) return;
    const hasDubData = resul?.results;
    const streamingLink = hasDubData?.streamingLink?.link?.file;

    setBhaiLink(streamingLink || "");

    setSubtitles(resul?.results?.streamingLink?.tracks || []);
    setIntrod(resul?.results?.streamingLink?.intro || null);
    setOutrod(resul?.results?.streamingLink?.outro || null);
  }, [resul]);

  const title =
    lang === "en"
      ? props.datao?.results.data.title
      : props.datao?.results.data.japanese_title;
  const [logIsOpen, setLogIsOpen] = useState(false);

  const { data: session } = useSession();

  const [isOpeni, setIsOpeni] = useState(false);

  const handleOptionClick = (option) => {
    if (!session) {
      // console.log(setLogIsOpen);
      setLogIsOpen(true);
      // window.location.href = "/user/watch-list";
    }
    console.log(`Selected option: ${option}`);
    setIsOpeni(false); // Close the dropdown after selection

    // Create a new object with the selected data and timestamp
    const newObj = {
      id: props.datao?.results?.data?.id,
      poster: props.datao?.results?.data?.poster,
      duration: props.datao?.results?.data?.animeInfo?.tvInfo?.duration,
      rating: props.datao?.results?.data?.animeInfo?.tvInfo?.rating,
      episodes: {
        sub: props.datao?.results?.data?.animeInfo?.tvInfo?.sub,
        dub: props.datao?.results?.data?.animeInfo?.tvInfo?.dub
          ? props.datao?.results?.data?.animeInfo?.tvInfo?.dub
          : "",
      },
      name: props.datao?.results?.data?.title,

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
      let data = JSON.parse(ls.getItem(key)) || [];
      data = data.filter((item) => item.id !== newObj.id);
      ls.setItem(key, JSON.stringify(data));
    });

    // Create dynamic key for the current option
    const currentKey = `animeData_${option}`;

    // Retrieve existing data from local storage for the current option
    let currentData = JSON.parse(ls.getItem(currentKey)) || [];

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
    ls.setItem(currentKey, JSON.stringify(currentData));
  };

  const toggleDropdown = () => {
    setIsOpeni(!isOpeni);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickSecOutside = (event) => {
    if (
      dropdownSecRef.current &&
      !dropdownSecRef.current.contains(event.target)
    ) {
      setIsOpeni(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickSecOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickSecOutside);
    };
  }, []);

  const watch2gether = () => {
    if (!session) {
      setLogIsOpen(true);
    }
  };

  return (
    <>
      <SessionProvider>
        <SignInSignUpModal setLogIsOpen={setLogIsOpen} logIsOpen={logIsOpen} />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <div style={{ marginTop: "65px" }} className="watch-container">
              <div className="flex gap-1 items-center pecif">
                <Link href={"/"} onClick={handleNavigation}>
                  <div className="omo">Home</div>
                </Link>
                <div className="otoi">&#x2022;</div>
                <div className="omo">
                  {props.datao?.results.data.animeInfo.tvInfo.showType}
                </div>
                <div className="oto">&#x2022;</div>
                <div className="amo">Watching {title}</div>
              </div>
              <div className="d-flex new-con">
                <img
                  className="watch-container-background"
                  src={props.datao.results.data.poster}
                  alt="pop"
                />
                <div className="media-center d-flex">
                  <div
                    className={`${
                      episodeList?.length <= 24
                        ? "episode-container"
                        : "episode-container-blocks"
                    }`}
                  >
                    <div className="epTop">
                      <div className="lisT">
                        <div>List of Episodes:</div>
                        {episodeList.length > 100 ? (
                          <div className="dropdownEp" ref={dropdownRef}>
                            <div
                              onClick={() => setIsOpen(!isOpen)}
                              className="dropdown-btn-ep"
                            >
                              <div>
                                <FaList />
                              </div>
                              <div>{epLisTitle}</div>
                              <div>
                                <FaAngleDown />
                              </div>
                            </div>
                            {isOpen && (
                              <div className="dropdown-content-ep">
                                <div className="scrollable-container">
                                  {Array.from(
                                    {
                                      length: Math.ceil(
                                        episodeList.length / 100
                                      ),
                                    },
                                    (_, index) => {
                                      const start = index * 100 + 1;
                                      const end = Math.min(
                                        (index + 1) * 100,
                                        episodeList.length
                                      );
                                      return (
                                        <div
                                          key={index}
                                          className={`episode-group-ep ${
                                            epList === index
                                              ? "selected-grep"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            setEpList(index);
                                            setEpLisTitle(
                                              `EPS: ${start
                                                .toString()
                                                .padStart(3, "0")}-${end
                                                .toString()
                                                .padStart(3, "0")}`
                                            );
                                            setIsOpen(false);
                                          }}
                                        >
                                          <div>
                                            EPS:{" "}
                                            {start.toString().padStart(3, "0")}-
                                            {end.toString().padStart(3, "0")}
                                          </div>
                                          {epList === index ? (
                                            <div>
                                              <IoMdCheckmarkCircleOutline />
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="searEp">
                        <div>
                          <FaSearch />
                        </div>
                        <div className="inpEp">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            // onKeyDown={handleEnterPress}
                            // onFocus={() => setIsFocused(true)}
                            // onBlur={() =>
                            //   setTimeout(() => setIsFocused(false), 300)
                            // } // Slight delay for clicking dropdown
                            placeholder="Number of Ep"
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${
                        episodeList?.length <= 24
                          ? "episode-tiles-wrapper"
                          : "episode-tiles-wrapper-blocks"
                      } d-flex a-center`}
                    >
                      {episodeButtons}
                    </div>
                  </div>
                  <div className="video-player">
                    <div className="hls-container">
                      {clickedId === props.epId &&
                      (props.datajSub || props.datajDub) ? (
                        <ArtPlayer
                          data={props.data}
                          epId={props.epId}
                          anId={props.anId}
                          epNumb={epNumb}
                          bhaiLink={
                            "https://proxy.animoon.me/m3u8-proxy?url=" +
                            bhaiLink
                          }
                          trutie={trutie}
                          epNum={epiod}
                          selectedServer={selectedServer}
                          onn1={onn1}
                          onn2={onn2}
                          onn3={onn3}
                          getData={getData}
                          currIdx={currIdx}
                          err={err}
                          subtitles={subtitles}
                          introd={introd}
                          outrod={outrod}
                          durEp={
                            props.datao?.results.data.animeInfo.tvInfo.duration
                          }
                          subEp={props.datao?.results.data.animeInfo.tvInfo.sub}
                          dubEp={
                            props.datao?.results.data.animeInfo.tvInfo?.dub
                          }
                          ratUra={
                            props.datao?.results.data.animeInfo.tvInfo?.rating
                          }
                          imgUra={props.datao?.results.data.poster}
                          nameUra={title}
                          quality={quality}
                          sub={sub}
                          IsLoading={IsLoading}
                        />
                      ) : (
                        <div
                          className="d-flex a-center j-center"
                          style={{ height: "100%" }}
                        >
                          <Image
                            src={loading}
                            style={{
                              display: "block",
                              height: 100,
                              width: 100,
                              margin: "auto",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="server-container d-flex-fd-column">
                      <div className="server-tile-wrapper d-flex-fd-column">
                        <div className="flex items-center allum">
                          <div className="flex gap-x-3 flex-wrap allum-1">
                            <div className="flex gap-2 allum-2">
                              <div className="autoo flex gap-1">
                                <span>Auto</span>
                                <span>Play</span>
                              </div>
                              <div
                                onClick={handleOn1}
                                className={`ress ${
                                  onn1 === "On" ? "ressOn" : "ressOff"
                                }`}
                              >
                                {onn1}
                              </div>
                            </div>
                            <div className="flex gap-2 allum-2">
                              <div className="autoo flex gap-1">
                                <span>Auto</span>
                                <span>Next</span>
                              </div>
                              <div
                                onClick={handleOn2}
                                className={`ress ${
                                  onn2 === "On" ? "ressOn" : "ressOff"
                                }`}
                              >
                                {onn2}
                              </div>
                            </div>
                            <div className="flex gap-2 allum-2">
                              <div className="autoo flex gap-1">
                                <span>Auto</span>
                                <span>Skip</span>
                                <span>OP/ED</span>
                              </div>
                              <div
                                onClick={handleOn3}
                                className={`ress ${
                                  onn3 === "On" ? "ressOn" : "ressOff"
                                }`}
                              >
                                {onn3}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 items-center allum-3">
                            <Link
                              href={`/watch/${
                                props.data.results.episodes[epiod - 2]?.id
                              }`}
                            >
                              <div
                                className="backw"
                                onClick={() =>
                                  backward() &
                                  setClickedId(
                                    props.data.results.episodes[epiod - 2]?.id
                                  )
                                }
                              >
                                <FaBackward />
                              </div>
                            </Link>
                            <Link
                              href={`/watch/${props.data.results.episodes[epiod]?.id}`}
                            >
                              <div
                                className="fordw"
                                onClick={() =>
                                  forward() &
                                  setClickedId(
                                    props.data.results.episodes[epiod]?.id
                                  )
                                }
                              >
                                <FaForward />
                              </div>
                            </Link>
                            <div
                              className="dropdown-container"
                              ref={dropdownSecRef}
                            >
                              <div
                                className="plusa"
                                onClick={() => {
                                  toggleDropdown();
                                }}
                              >
                                <FaPlus />
                              </div>

                              {isOpeni && (
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
                            <Link
                              href={
                                session
                                  ? `/watch2gether/create?animeId=${props.datao.results.data?.id}`
                                  : ""
                              }
                              onClick={watch2gether}
                              className="signo"
                            >
                              <PiBroadcastFill />
                            </Link>
                          </div>
                        </div>
                        <div className="allum rep-all">
                          <div className="rep-tex">
                            If wrong episode is playing then click report button
                          </div>
                          <div className="rep-butt" onClick={() => report()}>
                            REPORT
                          </div>
                        </div>
                        <div className="flex compIno">
                          <div className="flex flex-col items-center epIno containIno flex-wrap">
                            <div className="ino1">You are watching</div>
                            <div className="ino2">{`${
                              props.data?.results.episodes[epiod]?.filler ===
                              true
                                ? "Filler"
                                : ""
                            } Episode ${epiod}`}</div>
                            <div className="ino3">
                              If current server doesn't work please try other
                              servers beside.
                            </div>
                          </div>
                          <div className=" flex flex-col serves">
                            <>
                              <>
                                {props.datajSub?.results ? (
                                  <div
                                    className={`serveSub ${
                                      // !Array.isArray(props.datajDub) ||
                                      props.datajDub?.results ? "borderDot" : ""
                                    } flex gap-5 items-center`}
                                  >
                                    <div className="subb flex gap-1 items-center">
                                      <div>SUB</div>
                                      <div>:</div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 subb-1">
                                      <div
                                        className={`subDub ${
                                          subIsSelected
                                            ? selectedServer === 0
                                              ? "selected"
                                              : ""
                                            : ""
                                        }`}
                                        onClick={() =>
                                          setSelectedServer(0) &
                                          setSubIsSelected(true) &
                                          setServerName("Vidstreaming") &
                                          setBhaiLink(
                                            props.datajSub?.results
                                              ?.streamingLink.link.file
                                          ) &
                                          // setQuality("")
                                          setSubtitles(
                                            props.datajSub?.results
                                              ?.streamingLink.tracks
                                          ) &
                                          setIntrod(
                                            props.datajSub?.results
                                              ?.streamingLink.intro
                                          ) &
                                          setOutrod(
                                            props.datajSub?.results
                                              ?.streamingLink.outro
                                          )
                                        }
                                      >
                                        Vidstreaming
                                      </div>
                                      <div
                                        className={`subDub ${
                                          subIsSelected
                                            ? selectedServer === 1
                                              ? "selected"
                                              : ""
                                            : ""
                                        }`}
                                        onClick={() =>
                                          setSelectedServer(1) &
                                          setSubIsSelected(true) &
                                          setServerName("Vidcloud") &
                                          setBhaiLink(
                                            props.datajSub?.results
                                              ?.streamingLink.link.file
                                          ) &
                                          // setQuality("")
                                          setSubtitles(
                                            props.datajSub?.results
                                              ?.streamingLink.tracks
                                          ) &
                                          setCurrIdx(1) &
                                          setIntrod(
                                            props.datajSub?.results
                                              ?.streamingLink.intro
                                          ) &
                                          setOutrod(
                                            props.datajSub?.results
                                              ?.streamingLink.outro
                                          )
                                        }
                                      >
                                        Vidcloud
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {
                                  // !Array.isArray(props.datajDub) ||
                                  props.datajDub?.results ? (
                                    <div
                                      className={`serveSub flex gap-5 items-center`}
                                    >
                                      <div className="subb flex gap-1 items-center">
                                        <div>DUB</div>
                                        <div>:</div>
                                      </div>
                                      <div className="flex flex-wrap gap-2 subb-1">
                                        <div
                                          className={`subDub ${
                                            !subIsSelected
                                              ? selectedServer === 0
                                                ? "selected"
                                                : ""
                                              : ""
                                          }`}
                                          onClick={() =>
                                            setSelectedServer(0) &
                                            setSubIsSelected(false) &
                                            setServerName("Vidstreaming") &
                                            setBhaiLink(
                                              props.datajDub?.results
                                                ?.streamingLink.link.file
                                            ) &
                                            // setQuality("")

                                            setSubtitles(
                                              props.datajSub?.results
                                                ?.streamingLink.tracks
                                            ) &
                                            setIntrod(
                                              props.datajDub?.results
                                                ?.streamingLink.intro
                                            ) &
                                            setOutrod(
                                              props.datajDub?.results
                                                ?.streamingLink.outro
                                            )
                                          }
                                        >
                                          Vidstreaming
                                        </div>
                                        <div
                                          className={`subDub ${
                                            !subIsSelected
                                              ? selectedServer === 1
                                                ? "selected"
                                                : ""
                                              : ""
                                          }`}
                                          onClick={() =>
                                            setSelectedServer(1) &
                                            setSubIsSelected(false) &
                                            setServerName("Vidcloud") &
                                            setBhaiLink(
                                              props.datajDub?.results
                                                ?.streamingLink.link.file
                                            ) &
                                            // setQuality("")
                                            setCurrIdx(1) &
                                            setSubtitles(
                                              props.datajSub?.results
                                                ?.streamingLink.tracks
                                            ) &
                                            setIntrod(
                                              props.datajDub?.results
                                                ?.streamingLink.intro
                                            ) &
                                            setOutrod(
                                              props.datajDub?.results
                                                ?.streamingLink.outro
                                            )
                                          }
                                        >
                                          Vidcloud
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                }
                              </>
                            </>
                          </div>
                        </div>

                        {props?.datao?.results?.seasons?.length > 0 ? (
                          <>
                            <div className="seasonal-advice">
                              Watch more seasons of this anime:
                            </div>
                            <div className="seasonal">
                              {props?.datao?.results.seasons?.map((sea) => (
                                <>
                                  <Link
                                    href={`/${sea.id}`}
                                    onClick={handleNavigation}
                                  >
                                    <div
                                      className={`season h-[70px] ${
                                        sea.id ===
                                        props?.datao?.results?.data.id
                                          ? "currento"
                                          : ""
                                      }`}
                                    >
                                      <img
                                        className="seasonal-background"
                                        src={sea.season_poster}
                                        alt="pop"
                                      />
                                      {sea.season.length < 15
                                        ? sea.season
                                        : sea.season.slice(0, 15) + "..."}
                                    </div>
                                  </Link>
                                </>
                              ))}
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="current-anime-details ">
                  <img
                    className="details-container-background"
                    src={props.datao.results.data.poster}
                    alt="pop"
                  />
                  <div className="anime-details d-flex-fd-column">
                    <img
                      className="anime-details-poster"
                      src={props.datao.results.data.poster}
                      alt="pop"
                    />

                    <div className="anime-details-content d-flex-fd-column">
                      <h1
                        style={{ textAlign: "center" }}
                        className={
                          title.length < 30 ? `title-large` : `title-large-long`
                        }
                      >
                        {title.length < 50 ? title : title.slice(0, 50) + "..."}
                      </h1>

                      <div className="flex m-auto gap-2 items-center cpice-1">
                        <div className="flex gap-1 cpice-2">
                          {" "}
                          <div className="rat">
                            {props.datao.results.data.animeInfo.tvInfo.rating}
                          </div>
                          <div className="qual">
                            {props.datao.results.data.animeInfo.tvInfo.quality}
                          </div>
                          <div className="subE">
                            <FaClosedCaptioning size={14} />{" "}
                            {props.datao.results.data.animeInfo.tvInfo?.sub ||
                              "Unknown"}
                          </div>
                          {props.datao.results.data.animeInfo.tvInfo?.dub ? (
                            <div className="dubE">
                              {" "}
                              <AiFillAudio size={14} />{" "}
                              {props.datao.results.data.animeInfo.tvInfo?.dub ||
                                "Unknown"}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="doto">&#x2022;</div>
                        <div className="typo">
                          {props.datao.results.data.animeInfo.tvInfo.showType}
                        </div>
                        <div className="doto">&#x2022;</div>
                        <div className="duran">
                          {props.datao.results.data.animeInfo.tvInfo.duration}
                        </div>
                      </div>

                      <p className="descp">
                        {descIsCollapsed
                          ? props.datao.results.data.animeInfo.Overview?.slice(
                              0,
                              150
                            ) + "..."
                          : props.datao.results.data.animeInfo.Overview}
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => setDescIsCollapsed((prev) => !prev)}
                        >
                          [ {descIsCollapsed ? "More" : "Less"} ]
                        </span>
                      </p>
                      <p>
                        Animoon is the best site to watch {title} SUB online, or
                        you can even watch {title} DUB in HD quality. You can
                        also find {props.datao.results.data.animeInfo.Studios}{" "}
                        anime on Animoon website.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ width: "100%", height: "100px", overflow: "hidden" }}>
              {/* Ad container */}
              <div id="ad-container"></div>
            </div>

            <Share
              style={{
                paddingInline: 20,
              }}
              ShareUrl={props.ShareUrl}
              arise={props.arise}
            />

            <Comments
              epiod={props.epiod}
              epId={props.epId}
              anId={props.anId}
              IsLoading={IsLoading}
            />

            <RecommendedTopTen
              doIt={"doit"}
              datap={props.datao}
              data={props.datapp}
              isInGrid={"true"}
              IsLoading={IsLoading}
              omin={omin}
            />
          </div>
        )}
      </SessionProvider>
    </>
  );
}
