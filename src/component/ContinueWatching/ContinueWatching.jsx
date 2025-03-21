"use client";
import React, { useState, useEffect } from "react";
import "./continueWatching.css";
import Card from "../Card/Card";
import { FaHistory } from "react-icons/fa";

const MyComponent = () => {
  const [data, setData] = useState([]);

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

  const datal = [];
  const arr =
    ls.getItem("Recent-animes") &&
    ls.getItem("Recent-animes").split(",");
  arr.map((ii) => {
    let obj = {}; // Create a new object for each iteration
    let newObj = {}; // Create a new object for each iteration

    const id = ii;
    obj.id = id;
    obj.poster = ls.getItem(`imgUra-${id}`)
      ? ls.getItem(`imgUra-${id}`)
      : "";
    obj.duration = ls.getItem(`duran-${id}`)
      ? ls.getItem(`duran-${id}`)
      : "";
    obj.rating = ls.getItem(`ratUra-${id}`)
      ? ls.getItem(`ratUra-${id}`)
      : "";
    newObj.sub = ls.getItem(`subEp-${id}`)
      ? ls.getItem(`subEp-${id}`)
      : "";
    newObj.dub = ls.getItem(`dubEp-${id}`)
      ? ls.getItem(`dubEp-${id}`)
      : "";
    obj.episodes = newObj;
    obj.Secds = JSON.parse(ls.getItem("artplayer_settings")).times[
      ls.getItem(`newW-${ls.getItem(`Rewo-${id}`)}`)
    ]
      ? JSON.parse(ls.getItem("artplayer_settings")).times[
          ls.getItem(`newW-${ls.getItem(`Rewo-${id}`)}`)
        ]
      : "";
    obj.name = ls.getItem(`nameUra-${id}`)
      ? ls.getItem(`nameUra-${id}`)
      : "";
    obj.episodeId = ls.getItem(`Rewo-${id}`)
      ? ls.getItem(`Rewo-${id}`)
      : "";
    obj.epNo = ls.getItem(`epNumo-${id}`)
      ? ls.getItem(`epNumo-${id}`)
      : "";
    datal.push(obj); // Add each obj to the datal array
    console.log(obj);
  });
  useEffect(() => {
    console.log(datal);
    setData(datal);
  }, []);
  const cards = data?.map((data, idx) => {
    return (
      <Card key={data.id} data={data} delay={idx * 0.05} keepIt={"true"} />
    );
  });
  return (
    <div className="contiAll">
      <div className="conticFa">
        <div className="contic">
          {" "}
          <FaHistory />
          Continue Watching
        </div>
      </div>

      <div className="midd">
        <div className="crd-col">
          <div className="carg d-flex a-center j-center">
            {localStorage.getItem("Recent-animes") ? cards : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComponent;
