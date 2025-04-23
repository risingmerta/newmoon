"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { PiBroadcastFill } from "react-icons/pi";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase";
import "./live.css";
import {
  FaClock,
  FaClosedCaptioning,
  FaEye,
  FaInfoCircle,
} from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import CountdownTimer from "@/component/CountDown/CountDown";
import Chat from "@/component/Chat/Chat";
import Navbar from "../Navbar/Navbar";
import Profilo from "../Profilo/Profilo";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import ArtPlayer from "../LivePlayer";
import Eplist from "../Eplist/Eplist";

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

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, [date, time]);

  return timeElapsed;
}

export default function LivePage(props) {
  const { data: session } = useSession();
  const [selectedEpId, setSelectedEpId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logIsOpen, setLogIsOpen] = useState(false);
  const [profiIsOpen, setProfiIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [lio, setLio] = useState(props?.data?.episodeNo);
  const [bhaiLink, setBhaiLink] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [introd, setIntrod] = useState("");
  const [outrod, setOutrod] = useState("");
  const [selectedServer, setSelectedServer] = useState(0);
  const [quality, setQuality] = useState("");
  const inputRef = useRef(null);

  const message = useTimer(props.data?.date, props.data?.time);

  const copyText = () => {
    if (inputRef.current) {
      const text = inputRef.current.innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert("Copied the text: " + text);
      });
    }
  };

  const ViewerCounter = () => {
    const [viewers, setViewers] = useState(0);

    useEffect(() => {
      const viewerId = `viewer_${Date.now()}`;
      const viewerDoc = doc(db, "activeViewers", viewerId);

      const updateViewerCount = async () => {
        await setDoc(viewerDoc, {
          joinedAt: serverTimestamp(),
        });

        window.addEventListener("beforeunload", async () => {
          await setDoc(viewerDoc, null);
        });
      };

      updateViewerCount();

      const unsubscribe = onSnapshot(
        collection(db, "activeViewers"),
        (snapshot) => {
          setViewers(snapshot.size);
        }
      );

      return async () => {
        unsubscribe();
        await setDoc(viewerDoc, null);
      };
    }, []);

    return <div>{viewers} viewers</div>;
  };

  const chang = useCallback(
    async (epi, epId) => {
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
    },
    [props.id]
  );

  useEffect(() => {
    if (show) {
      chang(lio, selectedEpId);
    }
  }, [show, lio, selectedEpId, chang]);

  return (
    <>
      {show && (
        <Eplist
          data={props.data.episodesList}
          epiod={lio}
          anId={props.data.animeId}
          onClose={() => setShow(false)}
          setSelectedEpId={setSelectedEpId}
          chang={chang}
          setLio={setLio}
          refer={props.refer}
        />
      )}
      <Navbar
        lang={() => {}}
        sign={() => setLogIsOpen(true)}
        setProfiIsOpen={setProfiIsOpen}
        profiIsOpen={profiIsOpen}
        refer={props.refer}
      />
      {profiIsOpen && (
        <Profilo
          setProfiIsOpen={setProfiIsOpen}
          profiIsOpen={profiIsOpen}
          refer={props.refer}
        />
      )}
      {logIsOpen && (
        <SignInSignUpModal
          logIsOpen={logIsOpen}
          setLogIsOpen={setLogIsOpen}
          sign={() => setLogIsOpen(false)}
          refer={props.refer}
        />
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
                  {"Episode " + lio?.toString()}
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
                      selectedServer={selectedServer}
                      subtitles={subtitles}
                      introd={introd}
                      outrod={outrod}
                      id={props.id}
                      quality={quality}
                      live={"yes"}
                      sub={props.data?.sub === true ? "sub" : "dub"}
                      IsLoading={setIsLoading}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="chatC">
              <Chat liveId={props.id} session={session} isLog={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}