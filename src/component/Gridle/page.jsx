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
  return (
    <>
      <div>
        <SessionProvider>
          <Navbar
            lang={lang}
            sign={sign}
            setProfiIsOpen={setProfiIsOpen}
            profiIsOpen={profiIsOpen}
          />
          {profiIsOpen ? (
            <Profilo
              setProfiIsOpen={setProfiIsOpen}
              profiIsOpen={profiIsOpen}
            />
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
              <div className=" main-container d-flex  ">
                <div className="sidebar-wrapper d-flex-fd-column">
                  <Genre data={props.datal.genres} IsLoading={IsLoading} />
                  <TopTenAnime
                    data={props.datal.topTen}
                    selectL={selectL}
                    IsLoading={IsLoading}
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
                  />
                </div>
              </div>
            </>
          )}
          <div>
            <Footer />
          </div>
        </SessionProvider>
      </div>
    </>
  );
}
