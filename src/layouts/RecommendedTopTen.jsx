"use client";
import React, { useEffect, useState } from "react";
import TopTenAnime from "@/component/TopTen/TopTenAnime";
import AnimeCollection from "../component/MainContainer/AnimeCollection";
import Genre from "@/component/Genre/Genre";
import Details from "@/component/AnimeInfo/AnimeInfoRandom";
import "./recom.css";
import LoadingSpinner from "@/component/loadingSpinner";
import { SessionProvider } from "next-auth/react";
import Profilo from "@/component/Profilo/Profilo";
import Navbar from "@/component/Navbar/Navbar";
import SignInSignUpModal from "@/component/SignSignup/SignInSignUpModal";
import Footer from "@/component/Footer/Footer";
import { usePathname } from "next/navigation";

export default function RecommendedTopTen(props) {
  // const [dlta, setDlta] = useState([]);
  // const getData = (data) => {
  //   console.log("API DATA IS HERE", data);
  //   setDlta(data);
  //   return data;
  // };
  // if (dlta) {
  //   console.log("ANIME", dlta);
  // }
  const [selectL, setSelectL] = useState("en");
  const [profiIsOpen, setProfiIsOpen] = useState(false);
  const [logIsOpen, setLogIsOpen] = useState(false);
  const sign = (sign) => {
    setLogIsOpen(sign);
  };

  const lang = (lang) => {
    setSelectL(lang);
    props.omin(lang);
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
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {props.doIt ? (
              ""
            ) : (
              <Details
                // lata={getData}
                uiui={props.uiui}
                rand={props.rand}
                ShareUrl={props.ShareUrl}
                arise={props.arise}
                selectL={selectL}
                id={props.id || ""}
                // firstName={props.firstName}
                IsLoading={IsLoading}
              />
            )}

            <div className=" main-container jik d-flex">
              <div className="sidebar-wrapper d-flex-fd-column">
                <Genre
                  data={props.data.genres}
                  IsLoading={props.IsLoading ? props.IsLoading : IsLoading}
                />
                <TopTenAnime
                  data={props.data.topTen}
                  selectL={selectL}
                  IsLoading={props.IsLoading ? props.IsLoading : IsLoading}
                />
              </div>
              <div className=" collections-wrapper jik d-flex  ">
                <AnimeCollection
                  collectionName="Recommended for you"
                  data={
                    props.doIt
                      ? props.datap?.results.data.recommended_data
                      : props?.uiui?.info?.results?.data?.recommended_data
                  }
                  selectL={selectL}
                  IsLoading={props.IsLoading ? props.IsLoading : IsLoading}
                  isInGrid={"true"}
                />
              </div>
            </div>
          </>
        )}
        <div id="ad-container2" style={{ margin: "0 auto" }}></div>
        <div id="ad-container3" style={{ margin: "0 auto" }}></div>
        <div>
          <Footer />
        </div>
      </SessionProvider>
    </>
  );
}
