"use client";
import React, { useEffect, useState } from "react";

import AnimeCollection from "@/component/MainContainer/AnimeCollectionJikan";

import "./az.css";
import LoadingSpinner from "@/component/loadingSpinner";
import { SessionProvider } from "next-auth/react";
import Navbar from "../Navbar/Navbar";
import Profilo from "../Profilo/Profilo";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import Footer from "../Footer/Footer";
import { usePathname } from "next/navigation";

export default function SearchResults(props) {
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
      const adContainer = document.getElementById("ad-container2");
      if (adContainer) {
        adContainer.innerHTML = `
              <iframe
                src="/ad2"
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
          <div id="ad-container2"></div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="contA">
              <div className="collections-W">
                <AnimeCollection
                  collectionName="Sort By Letters"
                  IsLoading={IsLoading}
                  selectL={selectL}
                  data={props.el}
                  totalPages={props.totalPages}
                  sort={props.sort}
                  page={props.page}
                  para={props.para}
                />
              </div>
            </div>
          )}

          <div id="ad-container2"></div>

          <div>
            <Footer />
          </div>
        </SessionProvider>
      </div>
    </>
  );
}
