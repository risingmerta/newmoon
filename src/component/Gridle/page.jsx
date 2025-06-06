"use client";
import React, { useEffect, useState } from "react";
import Genre from "@/component/Genre/Genre";
import TopTenAnime from "@/component/TopTen/TopTenAnime";
import Share from "@/component/Share/Share";
import "./gridle.css";
import AnimeCollection from "@/component/MainContainer/AnimeCollection";
import LoadingSpinner from "@/component/loadingSpinner";
import { SessionProvider } from "next-auth/react";
import Navbar from "../Navbar/Navbar";
import Profilo from "../Profilo/Profilo";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import Footer from "../Footer/Footer";
import { usePathname } from "next/navigation";
import CopyUrlButton from "../CopyUrlButton/CopyUrlButton";
export default function GenreSidebar(props) {
  const [selectL, setSelectL] = useState("en");
  const [profiIsOpen, setProfiIsOpen] = useState(false);
  const [logIsOpen, setLogIsOpen] = useState(false);
  const sign = (sign) => {
    setLogIsOpen(sign);
  };

  const lang = (lang) => {
    setSelectL(lang);
  };
  const [isLoading, setIsLoading] = useState(false);
  const IsLoading = (data) => {
    if (data) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, [20000]);
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
              style="width: 100%; height: 100px; border: none; overflow: hidden;"
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
              style="width: 100%; height: 100px; border: none; overflow: hidden;"
              scrolling="no"
            ></iframe>
          `;
      }
    }
  }, [pathname]);
  return (
    <>
      <div>
        <SessionProvider>
          <Navbar
            lang={lang}
            sign={sign}
            setProfiIsOpen={setProfiIsOpen}
            profiIsOpen={profiIsOpen}
            refer={props.refer}
          />
          {profiIsOpen ? (
            <Profilo
              setProfiIsOpen={setProfiIsOpen}
              profiIsOpen={profiIsOpen}
              refer={props.refer}
            />
          ) : (
            ""
          )}
          {logIsOpen ? (
            <SignInSignUpModal
              logIsOpen={logIsOpen}
              setLogIsOpen={setLogIsOpen}
              sign={sign}
            refer={props.refer}
            />
          ) : (
            ""
          )}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* <div
                style={{ width: "100%", height: "100px", overflow: "hidden" }}
              > */}
              {/* Ad container */}
              <div id="ad-container"></div>
              {/* </div> */}
              <div id="ad-container3"></div>
              <Share
                style={{
                  paddingTop: 40,
                  paddingBottom: 0,
                  paddingInline: 20,
                  marginTop: 80 + "px",
                  marginBottom: 0,
                }}
                ShareUrl={props.ShareUrl}
                arise={props.arise}
              />
              <CopyUrlButton url={props.ShareUrl}/>
              <div className=" main-container d-flex  ">
                <div className="sidebar-wrapper d-flex-fd-column">
                  <Genre data={props.datal.genres} IsLoading={IsLoading} refer={props.refer}/>
                  <TopTenAnime
                    data={props.datal.topTen}
                    selectL={selectL}
                    IsLoading={IsLoading}
                    refer={props.refer}
                  />
                </div>
                <div className="collections-wrapper">
                  <AnimeCollection
                    collectionName={props.fiki || props.name + " Anime"}
                    filterName={props.cate}
                    fiki={props.fiki}
                    selectL={selectL}
                    page={props.page}
                    data={props.data.data}
                    IsLoading={IsLoading}
                    totalPages={props.totalPages}
                    genre={props?.genre || ""}
                    isInGrid={"true"}
                    refer={props.refer}
                  />
                </div>
              </div>
            </>
          )}
          <div>
            <Footer refer={props.refer}/>
          </div>
        </SessionProvider>
      </div>
    </>
  );
}
