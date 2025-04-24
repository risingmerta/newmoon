"use client";
import Artplayer from "artplayer";
import artplayerPluginChapter from "artplayer-plugin-chapter";
import Hls from "hls.js";
import React, { useRef, useEffect, useState } from "react";

import "@/component/artplayer.css";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";

function ArtPlayer(props) {
  const artRef = useRef(null);
  const [art, setArt] = useState(null);
  const [timeDifference, setTimeDifference] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredCaptions = props.subtitles
    ? props.subtitles.filter((sub) => sub.kind === "captions")
    : [];

  const localStorageWrapper = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      return {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
        clear: () => localStorage.clear(),
      };
    }
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  };

  const ls = localStorageWrapper();

  // Store chapters for intro and outro
  const chapters = [];
  if (props.introd?.end) {
    chapters.push({
      start: parseInt(props.introd.start),
      end: parseInt(props.introd.end),
      title: "Opening",
    });
  }
  if (props.outrod?.start && props.outrod?.end) {
    chapters.push({
      start: parseInt(props.outrod.start),
      end: parseInt(props.outrod.end),
      title: "Ending",
    });
  }

  useEffect(() => {
    const startTime = new Date(`${props.date} ${props.time}`).getTime();
    const now = Date.now();
    const diff = Math.floor((now - startTime) / 1000);
    setTimeDifference(diff);
  }, [props.date, props.time]);

  useEffect(() => {
    const art = new Artplayer({
      container: ".artplayer-app",
      url: props.bhaiLink,
      type: "m3u8",
      plugins: [
        artplayerPluginHlsControl({
          quality: {
            control: false,
            setting: true,
            getName: (level) => `${level.height}P`,
            title: "Quality",
            auto: "Auto",
          },
          audio: {
            control: true,
            setting: true,
            getName: (track) => track.name,
            title: "Audio",
            auto: "Auto",
          },
        }),
        artplayerPluginChapter({ chapters }),
      ],
      customType: {
        m3u8: (video, url, art) => {
          if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;

            art.on("destroy", () => hls.destroy());
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            console.error("Unsupported playback format: m3u8");
          }
        },
      },
      volume: 0.5,
      isLive: false,
      autoplay: false,
      pip: true,
      lock: true,
      playbackRate: true,
      fullscreen: true,
      subtitle: {
        url:
          filteredCaptions.length > 0
            ? filteredCaptions.find((sub) => sub.default)?.file || ""
            : "",
        type: "srt",
        encoding: "utf-8",
      },
    });

    setArt(art);

    art.on("ready", () => {
      if (timeDifference > 0 && timeDifference < art.duration) {
        art.currentTime = timeDifference;
        art.play();
      }
    });

    art.on("video:timeupdate", () => {
      if (
        props.introd?.start &&
        props.introd?.end &&
        art.currentTime > props.introd.start &&
        art.currentTime < props.introd.end
      ) {
        art.seek = props.introd.end;
      }
      if (
        props.outrod?.start &&
        props.outrod?.end &&
        art.currentTime > props.outrod.start &&
        art.currentTime < props.outrod.end
      ) {
        art.seek = props.outrod.end;
      }
    });

    art.on("video:ended", () => {
      if (props.onn2 === "On") {
        props.getData("YES");
      } else {
        art.stop();
      }
    });

    const timeoutDuration = 10000; // 10 seconds
    const loadingTimeout = setTimeout(() => {
      if (!isPlaying && (art.duration === 0 || isNaN(art.duration))) {
        console.error("The video is stuck loading or failed to play.");
        props.err("yes happened");
      }
    }, timeoutDuration);

    art.on("playing", () => {
      setIsPlaying(true);
      clearTimeout(loadingTimeout);
    });

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [props.bhaiLink, props.introd, props.outrod, timeDifference]);

  return (
    <div className="artplayer-app md:h-[800px] h-[250px] w-full absolute top-0 left-0"></div>
  );
}

export default ArtPlayer;