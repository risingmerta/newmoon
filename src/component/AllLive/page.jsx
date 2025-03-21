"use client";
import React, { useEffect, useState } from "react";
import "./all.css";
import { FaThLarge } from "react-icons/fa";
import Footer from "../Footer/Footer";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import Profilo from "../Profilo/Profilo";
import Navbar from "../Navbar/Navbar";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

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

const Page = (props) => {
  const [cachedData, setCachedData] = useState(props.liveRoom); // State to store fetched data

  const fetchAllDocs = async () => {
    try {
      const response = await fetch("/api/liveRoom"); // Call API to get data
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setCachedData(data);
      console.log("Fetched data:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllDocs();
  }, []);

  const getTimeDifference = (ko) => {
    if (!ko?.createTime) return "N/A";

    const createdTime = new Date(ko.createTime).getTime(); // Convert ISO string to timestamp
    const currentTime = Date.now();
    const difference = currentTime - createdTime;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
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
      <SessionProvider>
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
        <div className="fate-l">
          <div className="found-al">
            <div>
              <div className="topi-l topi-44">
                <div className="opt-1">Home</div>
                <div className="opt-2">&#x2022;</div>
                <div className="opt-3">Watch together</div>
              </div>
              <div className="topi-2">
                <div className="hed-1">Browse</div>
                {/* <div className="topi-l topi-ll">
                <div className="emir">All</div>
                <div className="emir">On-air</div>
                <div className="emir">Scheduled</div>
                <div className="emir">Waiting</div>
                <div className="emir">Ended</div>
                <div className="kirt">
                  <FaThLarge />
                  <div>My Rooms</div>
                </div>
              </div> */}
              </div>
            </div>

            {/* Display Data */}
            <div className="found-l">
              {cachedData.length > 0 ? (
                cachedData.map((ko, index) => (
                  <div className="koil" key={index}>
                    <Link
                      href={`/watch2gether/${ko.id}`}
                      className="container-koil"
                    >
                      <div className="background-koil">
                        <img
                          src={transformURL(ko.poster)}
                          alt="Poster"
                        />
                      </div>
                      <div className="overlay-koil"></div>
                      <div className="content-koil">
                        <div className="tag-koil">
                          <div className="epol-koil">
                            {ko.sub ? "SUB" : "DUB"}
                          </div>
                        </div>
                        <img
                          className="poster-koil"
                          src={transformURL(ko.poster)}
                          alt="Poster"
                        />
                        <div className="episode-koil">
                          <div className="epoy">{ko.episode || "N/A"}</div>
                        </div>
                      </div>
                    </Link>
                    <div className="sec-apt">
                      <div>
                        <img
                          className="rando"
                          src={ko.randomImage.replace(
                            "https://cdn.noitatnemucod.net/avatar/100x100/",
                            "https://img.flawlessfiles.com/_r/100x100/100/avatar/"
                          )}
                          alt="Random"
                          style={{ maxWidth: "100px" }}
                        />
                      </div>
                      <div className="mid0">
                        <div className="an-name">
                          {ko.name || "No Room Name"}
                        </div>
                        <Link
                          href={`/watch2gether/${ko.id}`}
                          className="rn-name"
                        >
                          {ko.roomName || "No Room Name"}
                        </Link>
                        <div className="bott-G">
                          <div className="ott-1">
                            {ko.userName || "Anonymous"}
                          </div>
                          <div className="ott-2">&#x2022;</div>
                          <div className="ott-3">{getTimeDifference(ko)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading or No Data Found...</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </SessionProvider>
    </>
  );
};

export default Page;
