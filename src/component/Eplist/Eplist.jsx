"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaList,
  FaSearch,
} from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "../WatchAnime/watch-anime.css";
import "./eplist.css";
import { useRouter } from "next/navigation";

const Eplist = (props) => {
  const router = useRouter()
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

  const dropdownRef = useRef(null); // Reference for the dropdown

  let episodeList =
    props?.data?.results.episodes?.length > 0
      ? props?.data?.results.episodes
      : null;

  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
  let speciEp = episodeList.length > 100 ? chunks[epList] : episodeList;

  const episodeButtons = speciEp?.map((el, idx) => {
    const title = lang === "en" ? el.title : el.japanese_title;
    const len = el.episode_no === props.epiod ? 20 : 30;
    return (
      <div
        onClick={() =>
          props.setSelectedEpId(el.id) &
          props.chang(el.episode_no, el.id) &
          props.onClose() &
          props.setPio(true) &
          props.setLio(el.episode_no) & router.refresh()
        }
        title={el.title}
        className={`${
          episodeList.length <= 24 ? "episode-tile" : `episode-tile-blocks`
        } ${el.episode_no === props.epiod ? "selected" : ""} ${
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
        // onClick={() => setEpNumb(el.episode_no) & setClickedId(el.id)}
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
              {el.episode_no === props.epiod ? (
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
      </div>
    );
  });
  return (
    <div className="modal-overlay" onClick={props.onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* <div className="modal-header">
          <button className="close-btn" onClick={props.onClose}>
            ✖
          </button>
        </div> */}

        <div className="modal-hed">Live Settings</div>

        <div className="hed-lab">
          <div className="hed-vom">
            <div
              className="hed-but-1"
              onClick={() =>
                props.chang(props.epiod - 1, episodeList[props.epiod - 1].id) &
                props.onClose() &
                props.setPio(true) &
                props.setLio(props.epiod - 1) & router.refresh()
              }
            >
              <div>
                <FaAngleLeft />
              </div>
              <div>Prev</div>
            </div>
            <div
              className="hed-but-1"
              onClick={() =>
                props.chang(props.epiod + 1, episodeList[props.epiod + 1].id) &
                props.onClose() &
                props.setPio(true) &
                props.setLio(props.epiod + 1) & router.refresh()
              }
            >
              <div>Next</div>
              <div>
                <FaAngleRight />
              </div>
            </div>
          </div>
          <div className="hed-but-2" onClick={() => props.onClose()}>
            End Live
          </div>
        </div>
        <div
          className={`${
            episodeList?.length <= 24
              ? " episode-containerN"
              : " episode-container-blocksN"
          }`}
        >
          <div className="epTopN">
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
                            length: Math.ceil(episodeList.length / 100),
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
                                  epList === index ? "selected-grep" : ""
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
                                  EPS: {start.toString().padStart(3, "0")}-
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
                ? "episode-tiles-wrapperN"
                : "episode-tiles-wrapper-blocksN"
            } d-flex a-center`}
          >
            {episodeButtons}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eplist;
