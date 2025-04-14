"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { PiBroadcastFill } from "react-icons/pi";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase";
import "./live.css";
import Link from "next/link";
import Image from "next/image";
import {
  FaClock,
  FaClosedCaptioning,
  FaCopy,
  FaEye,
  FaInfoCircle,
} from "react-icons/fa";
import Comments from "@/component/Comments/Comments";
import Chat from "@/component/Chat/Chat";
import CountdownTimer from "@/component/CountDown/CountDown";
import { AiFillAudio } from "react-icons/ai";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import Navbar from "../Navbar/Navbar";
import Profilo from "../Profilo/Profilo";
import Footer from "../Footer/Footer";
import ArtPlayer from "../LivePlayer";
import { IoMdSettings } from "react-icons/io";
import Eplist from "../Eplist/Eplist";

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

function useTimer(date, time) {
  const [timeElapsed, setTimeElapsed] = useState("");

  useEffect(() => {
    if (!date || !time) return;

    const startTime = new Date(`${date} ${time}`).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const difference = now - startTime;

      if (difference < 0) {
        setTimeElapsed("Not started yet!");
        return;
      }

      const seconds = Math.floor((difference / 1000) % 60);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      const formatTime = (value) => (value < 10 ? `0${value}` : value);

      if (days > 0) {
        setTimeElapsed(
          `${formatTime(days)} : ${formatTime(hours)} : ${formatTime(
            minutes
          )} : ${formatTime(seconds)}`
        );
      } else {
        setTimeElapsed(
          `${formatTime(hours)} : ${formatTime(minutes)} : ${formatTime(
            seconds
          )}`
        );
      }
    };

    updateTimer(); // Initialize the timer immediately
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId); // Cleanup interval on unmount
  }, [date, time]);
  console.log(timeElapsed);
  return timeElapsed;
}

// function useSeconTimer(date, time) {
//   const [secondsElapsed, setSecondsElapsed] = useState(0);

//   useEffect(() => {
//     if (!date || !time) {
//       console.log("No date and time provided.");
//       return;
//     }

//     console.log("useEffect Triggered");

//     const startTime = new Date(`${date} ${time}`).getTime();
//     console.log('start', startTime);

//     const now = Date.now();
//     console.log('now', now);

//     const difference = Math.floor((now - startTime) / 1000); // Convert to seconds
//     console.log('difference', difference);

//     setSecondsElapsed(difference >= 0 ? difference : 0);
//   }, [date, time]); // ✅ Trigger when `date` or `time` changes

//   console.log('secondsElapsed', secondsElapsed);
//   return secondsElapsed;
// }

export default function LivePage(props) {
  const { data: session } = useSession();
  const [selectedEpId, setSelectedEpId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const IsLoading = (data) => {
    if (data) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, [20000]);
    }
  };
  const handleNavigation = () => {
    IsLoading(true);
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

  const [cachedData, setCachedData] = useState(null);
  const fetchCachedData = async (id) => {
    try {
      const response = await fetch(`/api/liveRoom?id=${id}`);

      if (response.status === 404) {
        console.log("No cached data found.");
        return null;
      }

      const data = await response.json();
      setCachedData(data);
      console.log("Cached data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching cached data:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchCachedData(props.id);
  }, []);

  const getTimeDifference = () => {
    if (!cachedData?.createTime) return "N/A";

    const createdTime = new Date(cachedData.createTime).getTime(); // Convert ISO string to timestamp
    const currentTime = Date.now();
    const difference = currentTime - createdTime;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `- Created ${seconds} seconds ago`;
    if (minutes < 60) return `- Created ${minutes} minutes ago`;
    if (hours < 24) return `- Created ${hours} hours ago`;
    if (days < 30) return `- Created ${days} days ago`;
    if (months < 12) return `- Created ${months} months ago`;
    return `- Created ${years} years ago`;
  };

  const message = useTimer(props.data?.date, props.data?.time);

  function ViewerCounter() {
    const [viewers, setViewers] = useState(0);

    useEffect(() => {
      const viewerId = `viewer_${Date.now()}`;
      const viewerDoc = doc(db, "activeViewers", viewerId);

      const updateViewerCount = async () => {
        // Add the current viewer with a timestamp
        await setDoc(viewerDoc, {
          joinedAt: serverTimestamp(),
        });

        // Remove the viewer on disconnect
        window.addEventListener("beforeunload", async () => {
          await setDoc(viewerDoc, null); // Clean up on page close
        });
      };

      updateViewerCount();

      // Listen for real-time updates to the activeViewers collection
      const unsubscribe = onSnapshot(
        collection(db, "activeViewers"),
        (snapshot) => {
          setViewers(snapshot.size); // Count all active documents
        }
      );

      // Cleanup: remove listener and document on unmount
      return async () => {
        unsubscribe();
        await setDoc(viewerDoc, null);
      };
    }, []);

    return (
      <div>
        <h3>{viewers} viewers</h3>
      </div>
    );
  }

  const [subIsSelected, setSubIsSelected] = useState(() => {
    const isDubSelected = props.data?.sub === false;
    // Check if dub episodes exist in `props.datao`
    const hasDubEpisodes = props.datao?.anime?.info?.stats?.episodes?.dub > 0;

    // Check if dub data exists in `props.dataStr`
    const hasDubData = props.dataStr?.dub?.length > 0;

    // Return the initial state
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
    const isDubSelected = props.data?.sub === false;

    // If props.dataj is empty, use props.dubPri for dub or props.subPri for sub
    // Check if dub episodes exist in `props.datao`
    const hasDubEpisodes = props.data.episodes?.dub > 0;

    // Check if dub data exists in `props.dataStr`
    const hasDubData = props.datajDub.results;

    // Handle Dub selection
    if (isDubSelected) {
      if (hasDubEpisodes && hasDubData) {
        // Check if there's a dub available in props.dataj
        const dubLink = props.datajDub.results?.streamingLink.link?.file;

        // If not found in dataj, fallback to gogoDub
        if (dubLink) {
          return dubLink;
        }
      } else {
        const subLink = props.datajSub.results?.streamingLink.link?.file;

        // If not found in dataj, fallback to gogoSub
        if (subLink) {
          return subLink;
        }
      }
    }
    // Handle Sub/Raw selection
    else {
      const subLink = props.datajSub.results?.streamingLink.link?.file;

      // If not found in dataj, fallback to gogoSub
      if (subLink) {
        return subLink;
      }
    }

    // Default to an empty string if nothing is found
    return "";
  });

  const [introd, setIntrod] = useState(
    props.data?.sub === false && props.datajDub.results
      ? props.datajDub.results?.streamingLink.intro
      : props.datajSub.results?.streamingLink.intro
  );
  const [outrod, setOutrod] = useState(
    props.data?.sub === false && props.datajDub.results
      ? props.datajDub.results?.streamingLink.outro
      : props.datajSub.results?.streamingLink.outro
  );
  const [subtitles, setSubtitles] = useState(
    props.datajSub.results?.streamingLink.tracks
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
  const inputRef = useRef(null);

  const copyText = () => {
    if (inputRef.current) {
      const text = inputRef.current.innerText; // Get text inside the div
      navigator.clipboard.writeText(text).then(() => {
        alert("Copied the text: " + text);
      });
    }
  };

  const [logIsOpen, setLogIsOpen] = useState(false);

  const isLog = (dta) => {
    setLogIsOpen(dta);
  };

  const [selectL, setSelectL] = useState("en");
  const [profiIsOpen, setProfiIsOpen] = useState(false);
  const sign = (sign) => {
    setLogIsOpen(sign);
  };

  const [quality, setQuality] = useState("");

  const [show, setShow] = useState(false);

  const lang = (lang) => {
    setSelectL(lang);
  };

  const getData = () => {};

  const err = () => {};
  const secon = props.secon;

  const [gtri, setGtri] = useState("");

  const [pio, setPio] = useState(false);
  const [lio, setLio] = useState(props?.data?.episodeNo);
  const chang = async (epi, epId) => {
    try {
      const response = await fetch(
        `/api/liveUpdate?id=${props.id}&epId=${epId}&episodeNo=${epi}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      console.log(data.message || data.error);
    } catch (error) {
      console.error("Error creating room:", error);
    }

    try {
      const response = await fetch(`/api/liveRoom?id=${props.id}`);

      if (response.status === 404) {
        console.log("No cached data found.");
        return null;
      }

      const data = await response.json();
      setGtri(data);
    } catch (error) {
      console.error("Error fetching cached data:", error);
      return null;
    }
  };

  useEffect(() => {
    if (pio) {
      chang(lio,selectedEpId);

      // Update `bhaiLink` safely
      setBhaiLink(() => {
        const isDubSelected = props.data?.sub === false;
        const hasDubEpisodes = props.data?.episodes?.dub > 0;
        const hasDubData = datajDub?.results;

        if (isDubSelected && hasDubEpisodes && hasDubData) {
          return dubLink || ""; // Return dub link if available
        }
        return subLink || ""; // Return sub link if available
      });

      // Update subtitles
      setSubtitles(datajSub?.results?.streamingLink?.tracks || []);

      // Update intro and outro safely
      setIntrod(
        props.data?.sub === false && datajDub?.results
          ? datajDub?.results?.streamingLink?.intro
          : datajSub?.results?.streamingLink?.intro || ""
      );

      setOutrod(
        props.data?.sub === false && datajDub?.results
          ? datajDub?.results?.streamingLink?.outro
          : datajSub?.results?.streamingLink?.outro || ""
      );
    }
  }, [pio, gtri]);

  console.log("***",lio,selectedEpId)

  return (
    <>
      {/* <div>{JSON.stringify(gtri)}</div> */}
      {show && (
        <Eplist
          data={props.data.episodesList}
          epiod={lio}
          anId={props.data.animeId}
          onClose={() => setShow(false)}
          setSelectedEpId={setSelectedEpId}
          // chang={chang}
          setPio={setPio}
          setLio={setLio}
        />
      )}
      <Navbar
        lang={lang}
        sign={sign}
        setProfiIsOpen={setProfiIsOpen}
        profiIsOpen={profiIsOpen}
      />
      {profiIsOpen ? (
        <Profilo setProfiIsOpen={setProfiIsOpen} profiIsOpen={profiIsOpen} />
      ) : (
        ""
      )}
      {logIsOpen ? (
        <SignInSignUpModal
          logIsOpen={logIsOpen}
          setLogIsOpen={setLogIsOpen}
          sign={sign}
        />
      ) : (
        ""
      )}
      <div className="foundati">
        <div className="inen">
          <div>
            <div className="al-33">
              <div className="five-str five-stn">
                <div className="kilO">
                  <PiBroadcastFill size={20} />
                </div>
                <div>{props.data?.roomName}</div>
              </div>
              <div className="five-str five-22">
                <div className="opt-11">{props.data?.name}</div>
                <div className="opt-2">&#x2022;</div>
                <div className="opt-22">
                  <div>
                    <FaClosedCaptioning size={14} />
                  </div>
                  <div className="oppt-22">
                    {props.data?.sub ? "SUB" : "DUB"}
                  </div>
                </div>
                <div className="opt-2">&#x2022;</div>
                <div className="opt-33">
                  {"Episode" + " " + lio?.toString()}
                </div>
              </div>
            </div>
            <div>
              <div className="video-playerN">
                <div className="hls-container">
                  {message === "Not started yet!" ? (
                    <div className="timl-P">
                      <img
                        src={props.data?.poster}
                        alt="Background"
                        className="background-image"
                      />
                      <div className="content">
                        <div className="timl-1">The show will start in</div>
                        <div className="timl-2">
                          <CountdownTimer
                            targetDate={props.data?.date}
                            targetTime={props.data?.time}
                          />
                        </div>
                        <div className="timl-3">
                          <div className="timl-31">Share live to friends</div>
                          <div className="timl-32">
                            <div
                              className="timl-321"
                              onClick={copyText}
                              ref={inputRef}
                            >
                              {`https://animoon.me/watch2gether/${props.id}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ArtPlayer
                      data={props.data}
                      epId={props.data?.episodesList?.results?.episodes[0]?.id}
                      anId={props.data.animeId}
                      epNumb={1}
                      bhaiLink={
                        "https://khiv.animoon.me/m3u8-proxy?url=" + bhaiLink
                      }
                      // trutie={trutie}
                      epNum={1}
                      selectedServer={selectedServer}
                      onn1={onn1}
                      onn2={onn2}
                      onn3={onn3}
                      getData={getData}
                      err={err}
                      subtitles={subtitles}
                      date={props.data?.date}
                      time={props.data?.time}
                      introd={introd}
                      outrod={outrod}
                      id={props.id}
                      durEp={props.data?.duration}
                      subEp={props.data?.episodes?.sub}
                      dubEp={props.data?.episodes?.dub}
                      ratUra={props.data?.rating}
                      imgUra={props.data?.poster}
                      nameUra={props.data?.name}
                      episodes={props.data?.episodesList}
                      episodeNo={props.data?.episodeNo}
                      quality={quality}
                      secon={secon}
                      live={"yes"}
                      sub={props.data?.sub === true ? "sub" : "dub"}
                      IsLoading={IsLoading}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="bit-co">
              <div className="biit-1">
                <div>
                  <img
                    className="biit-img"
                    src={props.data?.randomImage.replace(
                      "https://cdn.noitatnemucod.net/avatar/100x100/",
                      "https://img.flawlessfiles.com/_r/100x100/100/avatar/"
                    )}
                    alt=""
                  />
                </div>
                <div>
                  <div className="user-N">{props.data?.userName}</div>
                  <div className="time-N">{getTimeDifference()}</div>
                </div>
              </div>
              <div className="biit-more">
                <div className="biit-view">
                  <div>
                    <FaEye />
                  </div>
                  <div>{ViewerCounter()}</div>
                </div>
                <div className="biit-time">
                  <div>
                    <FaClock />
                  </div>
                  <div className="temari">
                    {useTimer(props.data?.date, props.data?.time)}
                  </div>
                </div>
                {session?.user?.id === props.id?.split("_")[0] && (
                  <div className="biit-set" onClick={() => setShow(true)}>
                    <IoMdSettings />
                  </div>
                )}
              </div>
            </div>

            <div className="chatC">
              <Chat liveId={props.id} session={session} isLog={isLog} />
            </div>

            <div className="kenpa-1">
              <div>
                <img className="kenpa-img" src={props.data?.poster} alt="" />
              </div>
              <div className="kenpa-soul">
                <div className="kenpa-name">{props.data?.name}</div>
                <div className="kenpa-sts">
                  <div className="kenpa-sts-1">{props.data?.rating}</div>
                  <div className="kenpa-sts-2">{props.data?.quality}</div>
                  <div className="kenpa-sts-3">
                    <div>
                      <FaClosedCaptioning />
                    </div>
                    <div>{props.data?.episodes.sub}</div>
                  </div>
                  <div className="kenpa-sts-4">
                    <div>
                      <AiFillAudio />
                    </div>
                    <div>{props.data?.episodes.dub}</div>
                  </div>
                  <div className="opt-2 spec">&#x2022;</div>
                  <div className="kenpa-sts-6">{props.data?.type}</div>
                  <div className="opt-2">&#x2022;</div>
                  <div className="kenpa-sts-8">{props.data?.duration}</div>
                </div>
                <div className="decro">
                  {props.data?.description.length < 300
                    ? props.data?.description
                    : props.data?.description.slice(0, 300)}
                </div>
                <div className="decrol">
                  {props.data?.description.length < 100
                    ? props.data?.description
                    : props.data?.description.slice(0, 100)}
                </div>
                <div className="fin-buut">
                  <div>
                    <FaInfoCircle />
                  </div>
                  <div>More detail</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="chatB">
          <Chat liveId={props.id} session={session} isLog={isLog} />
        </div>
      </div>
    </>
  );
}
