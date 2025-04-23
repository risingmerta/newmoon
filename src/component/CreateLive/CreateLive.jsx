"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./createLive.css";
import {
  FaCircle,
  FaClosedCaptioning,
  FaInfoCircle,
  FaPlayCircle,
} from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import { FaCircleCheck } from "react-icons/fa6";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSession } from "next-auth/react";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore"; // Import Firestore instance and methods
import { db } from "../../../firebase"; // Import Firestore instance
import Footer from "../Footer/Footer";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import Profilo from "../Profilo/Profilo";
import Navbar from "../Navbar/Navbar";

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

const CreateLive = (props) => {
  const { data: session } = useSession();

  // Helper for localStorage wrapper
  const localStorageWrapper = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      return {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
        clear: () => localStorage.clear(),
      };
    } else {
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
      };
    }
  };

  const ls = localStorageWrapper();
  const [subIsSelected, setSubIsSelected] = useState(true);
  const [byTime, setByTime] = useState(true);
  const [openCal, setOpenCal] = useState(false);
  const [newTime, setNewTime] = useState(false);
  const [cachedData, setCachedData] = useState(null);
  const [userData, setUserData] = useState(
    ls.getItem("user-animoon")
      ? JSON.parse(ls.getItem("user-animoon")).user
      : null
  );
  const [roomName, setRoomName] = useState(
    `Watch ${props.data?.results?.data.title} together`
  );

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  const [selectedHourIndex, setSelectedHourIndex] = useState(currentHour);
  const [selectedMinuteIndex, setSelectedMinuteIndex] = useState(currentMinute);
  const [value, setValue] = useState(currentDate);

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const handleHourScroll = (direction) => {
    setSelectedHourIndex((prev) =>
      direction === "up"
        ? Math.max(prev - 1, 0)
        : Math.min(prev + 1, hours.length - 1)
    );
  };

  const handleMinuteScroll = (direction) => {
    setSelectedMinuteIndex((prev) =>
      direction === "up"
        ? Math.max(prev - 1, 0)
        : Math.min(prev + 1, minutes.length - 1)
    );
  };

  const saveObject = async () => {
    const myObject = {
      id: session
        ? `${
            session?.user.id +
            `_${props.data?.results?.data?.id?.match(/\d+$/)?.[0]}`
          }`
        : `guest-${Date.now()}`,
      poster: props.data?.results?.data.poster || "defaultPoster.jpg",
      episode: "Episode 1",
      name: props.data?.results?.data.title,
      animeId: props?.id || "unknownAnimeId",
      userName: session?.user.username || userData?.username || "Anonymous",
      randomImage:
        session?.user?.avatar || userData?.randomImage || "defaultPoster.jpg",
      createTime: new Date().toISOString(), // Use Date instead of serverTimestamp()
      time: `${hours[selectedHourIndex]}:${minutes[selectedMinuteIndex]}`,
      date: value?.toDateString(),
      sub: subIsSelected || false,
      selectedByTime: byTime,
      roomName: roomName,
      rating: props.data?.results?.data.animeInfo.tvInfo.rating,
      quality: props.data?.results?.data.animeInfo.tvInfo.quality,
      episodes: {
        sub: props.data?.results?.data.animeInfo?.tvInfo?.sub,
        dub: props.data?.results?.data.animeInfo?.tvInfo?.dub,
      },
      type: props.data?.results?.data.animeInfo.tvInfo.showType,
      duration: props.data?.results?.data.animeInfo.tvInfo.duration,
      description: props.data?.results?.data.animeInfo.Overview,
      episodesList: props.episodes,
      episodeId: props.episodeId,
      episodeNo: 1,
    };

    try {
      const response = await fetch("/api/liveRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(myObject),
      });

      const data = await response.json();
      console.log(data.message || data.error);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const fetchCachedData = async () => {
    try {
      const userId =
        session?.user.id +
          `_${props.data?.results?.data?.id?.match(/\d+$/)?.[0]}` ||
        userData?.id;
      if (!userId) return null; // Prevent API call if userId is missing

      const response = await fetch(`/api/liveRoom?id=${userId}`);

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

  const [clickedCreate, setClickedCreate] = useState(false);

  useEffect(() => {
    if (!clickedCreate) return;

    const checkAndSaveObject = async () => {
      try {
        const existingData = await fetchCachedData();
        if (!existingData) {
          await saveObject(); // Ensure it's awaited if it's async
        }
      } catch (error) {
        console.error("Error checking and saving object:", error);
      }
    };

    checkAndSaveObject();
  }, [
    clickedCreate,
    value,
    selectedHourIndex,
    selectedMinuteIndex,
    subIsSelected,
    props.id,
    roomName,
  ]); // Ensure dependencies are included

  const handleInputChange = (e) => {
    setRoomName(e.target.value);
    ls.setItem("roomName", roomName);
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

  const lang = (lang) => {
    setSelectL(lang);
  };

  return (
    <>
      {" "}
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
      <div className="kinj-Fa">
        <div className="kinj">
          <div>
            <div className="flex gap-1 items-center specif">
              <Link href={`/?refer=${props.refer}`}>
                <div className="homo">Home</div>
              </Link>
              <div className="dotoi">&#x2022;</div>
              <div className="homo">Watch together</div>
              <div className="doto">&#x2022;</div>
              <div className="namo">Create a new room</div>
            </div>
          </div>
          <div className="crt-bt">Create a new room</div>
          <div className="flex dtoP">
            <div className="anime-container">
              {/* Blurred Background Image */}
              <div
                className="background-image"
                style={{
                  backgroundImage: `
            linear-gradient(rgba(93, 93, 93, 0.701), rgba(93, 93, 93, 0.701)), /* Color overlay */
            url('https://www.transparenttextures.com/patterns/dots.png'), /* Dotted pattern */
            url(${transformURL(props.data?.results?.data.poster)}) /* Background image */
          `,
                }}
              ></div>

              {/* Foreground Content */}
              <div className="anime-content">
                <div className="anime-pos">
                  <img
                    src={transformURL(props.data?.results?.data.poster)}
                    alt="anime poster"
                  />
                </div>
                <div className="anime-namik">
                  {props.data?.results?.data.title}
                </div>
                <div className="third-reich">
                  <div className="inner-reich">
                    <div className="inner-texi rat">
                      {props.data?.results?.data.animeInfo.tvInfo.rating}
                    </div>
                    <div className="inner-texi qual">
                      {props.data?.results?.data.animeInfo.tvInfo.quality}
                    </div>
                    <div className="inner-texi subE">
                      <div>
                        <FaClosedCaptioning size={14} />{" "}
                      </div>
                      <div>
                        {props.data?.results?.data.animeInfo?.tvInfo?.sub}
                      </div>
                    </div>
                    <div className="inner-texi dubE">
                      <div>
                        <AiFillAudio size={14} />{" "}
                      </div>
                      <div>
                        {props.data?.results?.data.animeInfo?.tvInfo?.dub}
                      </div>
                    </div>
                  </div>
                  <div className="doto">&#x2022;</div>
                  <div className="inner-texi">
                    {props.data?.results?.data.animeInfo.tvInfo.showType}
                  </div>
                  <div className="doto">&#x2022;</div>
                  <div className="inner-texi">
                    {props.data?.results?.data.animeInfo.tvInfo.duration}
                  </div>
                </div>
                <div className="descriptol">
                  {props.data?.results?.data.animeInfo.Overview.length < 216
                    ? props.data?.results?.data.animeInfo.Overview
                    : props.data?.results?.data.animeInfo.Overview.slice(
                        0,
                        216
                      ) + "..."}
                </div>
              </div>
            </div>

            <div className="rn-all">
              <div className="rn1">
                <div className="rn-head">
                  <div className="col-i">
                    <FaInfoCircle />
                  </div>
                  <div>Room Name</div>
                </div>
                <div className="rn-bott">
                  <div className="rn-b1t">
                    <input
                      className="rn-input"
                      type="text"
                      value={roomName} // Controlled input
                      onChange={handleInputChange} // Update state on change
                      name="text"
                    />
                  </div>
                  <div className="rn-sug">
                    You can change its name or just leave it by default
                  </div>
                </div>
              </div>
              <div className="rn1 rn2">
                <div className="rn-head rn-mar">
                  <div className="col-i">
                    <FaPlayCircle />
                  </div>{" "}
                  <div>Sources</div>
                </div>
                <div className="rn-bott rn-ti">
                  <div className="rn-sugg">
                    Chosen source will be played in your room
                  </div>
                  <div className="rn-b2t">
                    <div
                      className={`${subIsSelected ? "subo-col" : "subo"}`}
                      onClick={() => setSubIsSelected(true)}
                    >
                      <div>
                        <FaClosedCaptioning size={14} />{" "}
                      </div>
                      <div>SUB</div>
                    </div>
                    <div
                      className={`${subIsSelected ? "subo" : "subo-col"}`}
                      onClick={() => setSubIsSelected(false)}
                    >
                      <div>
                        <AiFillAudio size={14} />{" "}
                      </div>
                      <div>DUB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rb-all">
              <div className="rb1">
                <div className="upp-bi">
                  <div className="upp-bi1" onClick={() => setByTime(true)}>
                    <div className={`${byTime ? "subi-col" : "subi"}`}>
                      {byTime ? <FaCircleCheck /> : <FaCircle />}
                    </div>
                    <div>Start by time</div>
                  </div>
                  <div className="upp-bi1" onClick={() => setByTime(false)}>
                    <div className={`${byTime ? "subi" : "subi-col"}`}>
                      {byTime ? <FaCircle /> : <FaCircleCheck />}
                    </div>
                    <div>Start manual</div>
                  </div>
                </div>
                {byTime ? (
                  <div>
                    <div className="rn-sugg rn-is">
                      This room will be automatically started, please schedule
                      it
                    </div>
                    <div
                      className="str-t"
                      onClick={() => setOpenCal(true)}
                      style={{ marginTop: "20px" }}
                    >
                      {value
                        ? hours[selectedHourIndex] +
                          ":" +
                          minutes[selectedMinuteIndex] +
                          " " +
                          value.toDateString()
                        : `Start Time`}
                    </div>
                  </div>
                ) : (
                  <div className="rn-sugg rn-is">
                    You can start this room whenever you want
                  </div>
                )}
              </div>
              <div className="rb1">
                <div className="rby">
                  <div>Public</div>
                  <div className="rn-sug tyi">
                    With OFF, only who has the link can see this room.
                  </div>
                </div>
                <div className="upp-bi1">
                  <Link
                    href={
                      session
                        ? `/watch2gether/${
                            session?.user.id +
                            `_${
                              props.data?.results?.data?.id?.match(/\d+$/)?.[0]
                            }`
                          }?refer=${props.refer}`
                        : ""
                    }
                    className="cr1"
                    onClick={() => {
                      if (session) {
                        saveObject();
                        setClickedCreate(true);
                      }
                    }}
                  >
                    Create Room
                  </Link>

                  <div className="cr2">Cancel</div>
                </div>
              </div>
            </div>
          </div>
          {openCal ? (
            <div className="overlay">
              <div className="cal-all">
                <h1>React Calendar</h1>
                <Calendar
                  onChange={(newValue) => {
                    setValue(newValue); // Update state
                    ls.setItem("calendarValue", newValue); // Update localStorage
                  }}
                  value={value}
                />
                <div className="cal-ut">
                  <div className="cal-ut1" onClick={() => setOpenCal(false)}>
                    Cancel
                  </div>
                  <div
                    className="cal-ut1"
                    onClick={() => setNewTime(true) & setOpenCal(false)}
                  >
                    OK
                  </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <h2>Selected Date:</h2>
                  <p>{value.toDateString()}</p>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {newTime ? (
            <div className="overlay">
              <div className="ti-all">
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <h2>Select Time</h2>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    {/* Hour Selector */}
                    <div>
                      <button
                        className="middHo"
                        style={{ marginTop: "20px", marginBottom: "20px" }}
                        onClick={() => handleHourScroll("up")}
                      >
                        ▲
                      </button>
                      <div
                        style={{
                          height: "100px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                        }}
                      >
                        <span className="topHo">
                          {hours[selectedHourIndex - 1] || ""}
                        </span>
                        <span
                          className="middHo"
                          style={{ fontSize: "32px", fontWeight: "bold" }}
                        >
                          {hours[selectedHourIndex]}
                        </span>
                        <span className="topHo">
                          {hours[selectedHourIndex + 1] || ""}
                        </span>
                      </div>
                      <button
                        className="middHo"
                        style={{ marginTop: "20px", marginBottom: "0px" }}
                        onClick={() => handleHourScroll("down")}
                      >
                        ▼
                      </button>
                    </div>
                    <span style={{ fontSize: "32px", fontWeight: "bold" }}>
                      :
                    </span>
                    {/* Minute Selector */}
                    <div>
                      <button
                        className="middHo"
                        style={{ marginTop: "20px", marginBottom: "20px" }}
                        onClick={() => handleMinuteScroll("up")}
                      >
                        ▲
                      </button>
                      <div
                        style={{
                          height: "100px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                        }}
                      >
                        <span className="topHo">
                          {minutes[selectedMinuteIndex - 1] || ""}
                        </span>
                        <span
                          className="middHo"
                          style={{ fontSize: "32px", fontWeight: "bold" }}
                        >
                          {minutes[selectedMinuteIndex]}
                        </span>
                        <span className="topHo">
                          {minutes[selectedMinuteIndex + 1] || ""}
                        </span>
                      </div>
                      <button
                        className="middHo"
                        style={{ marginTop: "20px", marginBottom: "0px" }}
                        onClick={() => handleMinuteScroll("down")}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <h3>
                      Selected Time:{" "}
                      {`${hours[selectedHourIndex]}:${minutes[selectedMinuteIndex]}`}
                    </h3>
                  </div>
                  <div className="cal-ut">
                    <div className="cal-ut1" onClick={() => setNewTime(false)}>
                      Cancel
                    </div>
                    <div className="cal-ut1" onClick={() => setNewTime(false)}>
                      OK
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {/* <div>{JSON.stringify(cachedData)}</div> */}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default CreateLive;
