"use client";
import React, { useEffect, useState } from "react";
import Hero from "../Hero/Hero";
import Trending from "../Trending/Trending";
import Share from "../Share/Share";
import Featured from "../Featured/Featured";
import MainContainer from "../MainContainer/MainContainer";
import Navbar from "../Navbar/Navbar";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import { SessionProvider } from "next-auth/react";
import Profilo from "../Profilo/Profilo";
import Footer from "../Footer/Footer";
import BannerAd from "../Banner/Banner";
import Script from "next/script";
import { usePathname } from "next/navigation";

const Home = ({ data, existingAnime }) => {
  const [selectL, setSelectL] = useState("en");
  const [profiIsOpen, setProfiIsOpen] = useState(false);
  const [logIsOpen, setLogIsOpen] = useState(false);
  const sign = (sign) => {
    setLogIsOpen(sign);
  };

  const lang = (lang) => {
    setSelectL(lang);
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
    <div>
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
        <div>
          <Hero
            trendingAnime={data?.spotlights || []}
            existingAnime={existingAnime}
            selectL={selectL}
          />
          {/* "//disgustingmad.com/b29918b4e5fbf3e4c13e32f24c7c143c/invoke.js"*/}
          {/* <div style={{ width: "100%", height: "100px", overflow: "hidden" }}> */}
          {/* Ad container */}
          <div id="ad-container"></div>
          {/* </div> */}
          {/* <div style={{ width: "100%", height: "100px", overflow: "hidden" }}> */}
          {/* Ad container */}
          <div id="ad-container3"></div>
          {/* </div> */}

          <Trending data={data?.trending || []} selectL={selectL} />
          <div id="ad-container2" style={{ margin: '0 auto' }}></div>

          <Share ShareUrl="https://animoon.me/" />
          <div id="ad-container2" style={{ margin: '0 auto' }}></div>

          <Featured data={data || {}} selectL={selectL} />
          <div id="ad-container2" style={{ margin: '0 auto' }}></div>

          <MainContainer data={data || {}} selectL={selectL} />
        </div>
        <div id="ad-container2" style={{ margin: '0 auto' }}></div>

        <div>
          <Footer />
        </div>
      </SessionProvider>
    </div>
  );
};

export default Home;
