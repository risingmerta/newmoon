"use client";
import React, { useEffect, useState } from "react";
import "./advertize.css";

const Advertize = (props) => {
  const [time, setTime] = useState(new Date());
  const [adver, setAdver] = useState("false");

  // LocalStorage wrapper
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

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);

    const lastDisplay = ls.getItem("lastDisplay");
    const lastDate = ls.getItem("lastDate");
    const lastHour = ls.getItem("lastHour");

    const currentDate = time.getDate();
    const currentHour = time.getHours();

    const lastDisplayDate = new Date(lastDisplay);
    const secondsSinceLastDisplay = Math.floor((time - lastDisplayDate) / 1000);

    // Show ad every 30 seconds instead of 1 minute
    const shouldShowAd =
      secondsSinceLastDisplay >= 30 ||
      currentDate !== parseInt(lastDate) ||
      currentHour !== parseInt(lastHour);

    if (shouldShowAd) {
      setAdver("true");
    } else {
      setAdver("false");
    }

    return () => clearInterval(interval);
  }, [time]);

  function Newtab() {
    ls.setItem("lastDisplay", new Date().toISOString());
    ls.setItem("lastDate", time.getDate().toString());
    ls.setItem("lastHour", time.getHours().toString());
    ls.setItem("truth", "false");
    window.open(
      props.direct
        ? props.direct
        : "https://www.highrevenuenetwork.com/hnq4sfr7se?key=fa60dc3aeeb0a08aa0476e80986ad233"
    );
  }

  return (
    <div
      className="Advertize"
      style={{ zIndex: adver === "true" ? 100 : -1 }}
      onClick={() => {
        setAdver("false");
        Newtab();
      }}
    ></div>
  );
};

export default Advertize;
