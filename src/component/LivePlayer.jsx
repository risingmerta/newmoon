"use client";
import Artplayer, { html } from "artplayer";
import artplayerPluginChapter from "artplayer-plugin-chapter";
import Hls from "hls.js";
import React, { useRef, useEffect, useState } from "react";

import "@/component/artplayer.css";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";
import { IoSyncCircle } from "react-icons/io5";

function ArtPlayer(props) {
  const artRef = useRef(null);
  const [gtri, setGtri] = useState("");
  const filteredCaptions = props.subtitles
    ? props.subtitles.filter((sub) => sub.kind === "captions")
    : "";
  // Create the subtitle selector based on available subtitles
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
  let FinalUrl;
  FinalUrl = props.bhaiLink;
  console.log(FinalUrl);

  function setPlat() {
    ls.setItem(`newW-${props.epId}`, props.bhaiLink);
  }
  if (!ls.getItem(`newFa-${props.epId}`)) {
    setTimeout(setPlat, 10000);
  }
  ls.setItem(`subEp-${props.anId}`, props.subEp);
  ls.setItem(`dubEp-${props.anId}`, props.dubEp);
  ls.setItem(`epNumo-${props.anId}`, props.epNum);
  ls.setItem(`subLang-${props.anId}`, props.sub);
  ls.setItem(`subEp-${props.epId}`, props.sub);
  ls.setItem(`imgUra-${props.anId}`, props.imgUra);
  ls.setItem(`ratUra-${props.anId}`, props.ratUra);
  ls.setItem(`dura-${props.anId}`, props.durEp);
  ls.setItem(`nameUra-${props.anId}`, props.nameUra);
  ls.setItem(`subLang`, props.sub);

  console.log("1000$", props.bhaiLink);

  const dltt = ls.getItem("artplayer_settings");
  const obj = {};
  obj.anId = props.anId;
  obj.epId = props.epId;
  obj.epNum = props.epNum;
  obj.sub = props.sub;
  obj.duration = dltt
    ? JSON.parse(dltt).times[ls.getItem(`newW-${props.epId}`)]
      ? JSON.parse(dltt).times[ls.getItem(`newW-${props.epId}`)]
      : ""
    : "";

  if (dltt) {
    if (JSON.parse(dltt).times[props.bhaiLink]) {
      if (ls.getItem("recent-episodes")) {
        let vals = ls.getItem("recent-episodes").split(",");
        if (!vals.includes(props.epId)) {
          vals.push(props.epId);
          ls.setItem("recent-episodes", vals.join(","));
        }
      } else {
        ls.setItem("recent-episodes", props.epId);
      }
    }
  }

  if (ls.getItem("Recent-animes")) {
    let vals = ls.getItem("Recent-animes").split(",");
    if (vals.includes(props.anId)) {
      vals = vals.filter((val) => val !== props.anId);
    }
    vals.unshift(props.anId);
    ls.setItem("Recent-animes", vals.join(","));
  } else {
    ls.setItem("Recent-animes", props.anId);
  }

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

  if (dltt) {
    if (JSON.parse(dltt).times[props.bhaiLink]) {
      if (ls.getItem(props.anId.toString())) {
        console.log(ls.getItem(props.anId.toString()));
        let vals = ls.getItem(props.anId.toString()).split(",");
        ls.setItem(`Rewatch-${props.anId.toString()}`, props.epId);
        if (!vals.includes(props.epId.toString())) {
          vals.push(props.epId.toString());
          ls.setItem(props.anId.toString(), vals.join(","));
        }
      } else {
        ls.setItem(props.anId.toString(), props.epId.toString());
      }
    }
  }

  const [art, setArt] = useState(null); // Store Artplayer instance
  const [gtr, setGtr] = useState(""); // State to track 'yes' or 'no'

  const startTime = new Date(`${props.date} ${props.time}`).getTime();
  const now = Date.now();
  const diff = Math.floor((now - startTime) / 1000);
  const [timeDifference, setTimeDifference] = useState(diff);

  useEffect(() => {
    const startTime = new Date(`${props.date} ${props.time}`).getTime();
    const now = Date.now();
    const diff = Math.floor((now - startTime) / 1000);

    if (gtr === "yes" && art) {
      if (diff < art.duration) {
        art.currentTime = diff;
        art.play();
        console.log("gtrr", diff);
      } else {
        art.currentTime = art.duration;
        art.pause();
        console.log("gtrr - video ended", diff);
      }
      setTimeDifference(diff);
      setGtr("");
    } else {
      setTimeDifference(diff);
    }
  }, [gtr, art]);

  const getInstance = async (art) => {
    setArt(art);

    art.on("ready", () => {
      setGtr("yes");
      ls.setItem(`duran-${props.anId}`, art.duration);

      if (timeDifference < art.duration) {
        art.currentTime = timeDifference;
        art.play();
      } else {
        art.currentTime = art.duration;
        art.play();
      }
    });
  };

  useEffect(() => {
    const art = new Artplayer({
      title: "hahahaha",
      container: ".artplayer-app",
      url: props.bhaiLink,
      type: "m3u8",
      plugins: [
        artplayerPluginHlsControl({
          quality: {
            control: false,
            setting: true,
            getName: (level) => level.height + "P",
            title: "Quality",
            auto: "Auto",
          },
          audio: {
            control: true,
            setting: true,
            getName: (track) => track.name,
            // I18n
            title: "Audio",
            auto: "Auto",
          },
        }),
        artplayerPluginChapter({ chapters }),
      ],
      customType: {
        m3u8: function playM3u8(video, url, art) {
          if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;

            art.on("destroy", () => hls.destroy());

            // hls.on(Hls.Events.ERROR, (event, data) => {
            //   console.error("HLS.js error:", data);
            // });
            video.addEventListener("timeupdate", () => {
              const currentTime = Math.round(video.currentTime);
              const duration = Math.round(video.duration);
              if (duration > 0) {
                if (currentTime >= duration) {
                  art.pause();
                  if (currentEpisodeIndex < episodes?.length - 1 && autoNext) {
                    playNext(
                      episodes[currentEpisodeIndex + 1].id.match(
                        /ep=(\d+)/
                      )?.[1]
                    );
                  }
                }
              }
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            video.addEventListener("timeupdate", () => {
              const currentTime = Math.round(video.currentTime);
              const duration = Math.round(video.duration);
              if (duration > 0) {
                if (currentTime >= duration) {
                  art.pause();
                  if (currentEpisodeIndex < episodes?.length - 1 && autoNext) {
                    playNext(
                      episodes[currentEpisodeIndex + 1].id.match(
                        /ep=(\d+)/
                      )?.[1]
                    );
                  }
                }
              }
            });
          } else {
            console.log("Unsupported playback format: m3u8");
          }
        },
      },
      volume: 3,
      isLive: false,
      muted: false,
      autoplay: false,
      autoOrientation: true,
      pip: true,
      autoSize: false,
      lock: true,
      autoMini: false,
      screenshot: false,
      setting: true,
      loop: false,
      flip: false,
      playbackRate: true,
      aspectRatio: false,
      fullscreen: true,
      fullscreenWeb: false,
      subtitleOffset: false,
      miniProgressBar: false,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: "#00f2fe",
      whitelist: ["*"],
      moreVideoAttr: {
        crossOrigin: "anonymous",
      },
      controls: [
        {
          index: 1,
          position: "right",
          tooltip: "Backward 10 Seconds",
          html: `<svg viewBox="0 0 32 32" class="size-4 vds-icon w-3 h-3" width="10" height="10" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M16.6667 10.3452C16.6667 10.8924 16.0439 11.2066 15.6038 10.8814L11.0766 7.5364C10.7159 7.26993 10.7159 6.73054 11.0766 6.46405L15.6038 3.11873C16.0439 2.79356 16.6667 3.10773 16.6667 3.6549V5.22682C16.6667 5.29746 16.7223 5.35579 16.7927 5.36066C22.6821 5.76757 27.3333 10.674 27.3333 16.6667C27.3333 22.9259 22.2592 28 16 28C9.96483 28 5.03145 23.2827 4.68601 17.3341C4.66466 16.9665 4.96518 16.6673 5.33339 16.6673H7.3334C7.70157 16.6673 7.99714 16.9668 8.02743 17.3337C8.36638 21.4399 11.8064 24.6667 16 24.6667C20.4183 24.6667 24 21.085 24 16.6667C24 12.5225 20.8483 9.11428 16.8113 8.70739C16.7337 8.69957 16.6667 8.76096 16.6667 8.83893V10.3452Z" fill="#fff"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M17.0879 19.679C17.4553 19.9195 17.8928 20.0398 18.4004 20.0398C18.9099 20.0398 19.3474 19.9205 19.7129 19.6818C20.0803 19.4413 20.3635 19.0938 20.5623 18.6392C20.7612 18.1847 20.8606 17.6373 20.8606 16.9972C20.8625 16.3608 20.764 15.8192 20.5652 15.3722C20.3663 14.9252 20.0822 14.5853 19.7129 14.3523C19.3455 14.1175 18.908 14 18.4004 14C17.8928 14 17.4553 14.1175 17.0879 14.3523C16.7224 14.5853 16.4402 14.9252 16.2413 15.3722C16.0443 15.8173 15.9449 16.3589 15.943 16.9972C15.9411 17.6354 16.0396 18.1818 16.2385 18.6364C16.4373 19.089 16.7205 19.4366 17.0879 19.679ZM19.1362 18.4262C18.9487 18.7349 18.7034 18.8892 18.4004 18.8892C18.1996 18.8892 18.0226 18.8211 17.8691 18.6847C17.7157 18.5464 17.5964 18.3372 17.5112 18.0568C17.4279 17.7765 17.3871 17.4233 17.389 16.9972C17.3909 16.3684 17.4847 15.9025 17.6703 15.5995C17.8559 15.2945 18.0993 15.1421 18.4004 15.1421C18.603 15.1421 18.7801 15.2093 18.9316 15.3438C19.0832 15.4782 19.2015 15.6828 19.2868 15.9574C19.372 16.2301 19.4146 16.5767 19.4146 16.9972C19.4165 17.6392 19.3237 18.1156 19.1362 18.4262Z" fill="#fff"></path><path d="M13.7746 19.8978C13.8482 19.8978 13.9079 19.8381 13.9079 19.7644V14.2129C13.9079 14.1393 13.8482 14.0796 13.7746 14.0796H12.642C12.6171 14.0796 12.5927 14.0865 12.5716 14.0997L11.2322 14.9325C11.1931 14.9568 11.1693 14.9996 11.1693 15.0457V15.9497C11.1693 16.0539 11.2833 16.1178 11.3722 16.0635L12.464 15.396C12.4682 15.3934 12.473 15.3921 12.4779 15.3921C12.4926 15.3921 12.5045 15.404 12.5045 15.4187V19.7644C12.5045 19.8381 12.5642 19.8978 12.6378 19.8978H13.7746Z" fill="#fff"></path></svg>`,
          click: function () {
            art.backward = 10;
          },
        },
        {
          index: 2,
          position: "right",
          tooltip: "Forward 10 Seconds",
          html: `<svg viewBox="0 0 32 32" class="size-4 vds-icon w-3 h-3" width="10" height="10" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M15.3333 10.3452C15.3333 10.8924 15.9561 11.2066 16.3962 10.8814L20.9234 7.5364C21.2841 7.26993 21.2841 6.73054 20.9235 6.46405L16.3962 3.11873C15.9561 2.79356 15.3333 3.10773 15.3333 3.6549V5.22682C15.3333 5.29746 15.2778 5.35579 15.2073 5.36066C9.31791 5.76757 4.66667 10.674 4.66667 16.6667C4.66667 22.9259 9.74078 28 16 28C22.0352 28 26.9686 23.2827 27.314 17.3341C27.3354 16.9665 27.0348 16.6673 26.6666 16.6673H24.6666C24.2984 16.6673 24.0029 16.9668 23.9726 17.3337C23.6336 21.4399 20.1937 24.6667 16 24.6667C11.5817 24.6667 8 21.085 8 16.6667C8 12.5225 11.1517 9.11428 15.1887 8.70739C15.2663 8.69957 15.3333 8.76096 15.3333 8.83893V10.3452Z" fill="#fff"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M17.0879 19.679C17.4553 19.9195 17.8928 20.0398 18.4004 20.0398C18.9099 20.0398 19.3474 19.9205 19.7129 19.6818C20.0803 19.4413 20.3635 19.0938 20.5623 18.6392C20.7612 18.1847 20.8606 17.6373 20.8606 16.9972C20.8625 16.3608 20.764 15.8192 20.5652 15.3722C20.3663 14.9252 20.0822 14.5853 19.7129 14.3523C19.3455 14.1175 18.908 14 18.4004 14C17.8928 14 17.4553 14.1175 17.0879 14.3523C16.7224 14.5853 16.4402 14.9252 16.2413 15.3722C16.0443 15.8173 15.9449 16.3589 15.943 16.9972C15.9411 17.6354 16.0396 18.1818 16.2385 18.6364C16.4373 19.089 16.7205 19.4366 17.0879 19.679ZM19.1362 18.4262C18.9487 18.7349 18.7034 18.8892 18.4004 18.8892C18.1996 18.8892 18.0225 18.8211 17.8691 18.6847C17.7157 18.5464 17.5964 18.3372 17.5112 18.0568C17.4278 17.7765 17.3871 17.4233 17.389 16.9972C17.3909 16.3684 17.4847 15.9025 17.6703 15.5995C17.8559 15.2945 18.0992 15.1421 18.4004 15.1421C18.603 15.1421 18.7801 15.2093 18.9316 15.3438C19.0831 15.4782 19.2015 15.6828 19.2867 15.9574C19.372 16.2301 19.4146 16.5767 19.4146 16.9972C19.4165 17.6392 19.3237 18.1156 19.1362 18.4262Z" fill="#fff"></path><path d="M13.7746 19.8978C13.8482 19.8978 13.9079 19.8381 13.9079 19.7644V14.2129C13.9079 14.1393 13.8482 14.0796 13.7746 14.0796H12.642C12.6171 14.0796 12.5927 14.0865 12.5716 14.0997L11.2322 14.9325C11.1931 14.9568 11.1693 14.9996 11.1693 15.0457V15.9497C11.1693 16.0539 11.2833 16.1178 11.3722 16.0635L12.464 15.396C12.4682 15.3934 12.473 15.3921 12.4779 15.3921C12.4926 15.3921 12.5045 15.404 12.5045 15.4187V19.7644C12.5045 19.8381 12.5642 19.8978 12.6378 19.8978H13.7746Z" fill="#fff"></path></svg>`,
          click: function () {
            art.forward = 10;
          },
        },
        {
          index: 3,
          position: "right",
          tooltip: "Sync",
          html: `
            <div class="sync">
              <img src="https://megacloud.tv/images/sync.png?v=0.1" width="24" height="24" alt="Sync" />
            </div>
          `,
          click: function () {
            setGtr("yes");
          },
        },
      ],

      subtitle: {
        url:
          filteredCaptions && filteredCaptions.length > 0
            ? filteredCaptions.find((sub) => sub.default)?.file || ""
            : "", // Set the default subtitle or first subtitle if default is not found,
        type: "srt",
        className: "subtitle-text",
        encoding: "utf-8",
      },
      settings: [
        {
          width: 200,
          html: "Subtitle",
          tooltip: "English",
          icon: '<img width="22" heigth="22" src="https://artplayer.org/assets/img/subtitle.svg">',
          selector: [
            {
              html: "Display",
              tooltip: "Show",
              switch: true,
              onSwitch: function (item) {
                item.tooltip = item.switch ? "Hide" : "Show";
                art.subtitle.show = !item.switch;
                return !item.switch;
              },
            },
            ...(filteredCaptions && filteredCaptions.length > 0
              ? filteredCaptions.map((sub) => ({
                  default: sub.default || false,
                  html: sub.label,
                  url: sub.file,
                }))
              : []),
          ],
          onSelect: function (item) {
            art.subtitle.switch(item.url, {
              name: item.html,
            });
            return item.html;
          },
        },
      ],
      icons: {
        state:
          '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"> \
<path fill="#00f2fe" d="M9.5 9.325v5.35q0 .575.525.875t1.025-.05l4.15-2.65q.475-.3.475-.85t-.475-.85L11.05 8.5q-.5-.35-1.025-.05t-.525.875ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"></path> \
</svg> \
',
        loading: `
          <svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" fill="none"></rect>
            <path
              fill="white"
              d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
              opacity="0.3"
            ></path>
            <path fill="white" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        `,
      },
    });

    setArt(art);

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }
    art.on("video:ended", () => {
      if (props.onn2 === "On") {
        props.getData("YES");
      } else {
        art.stop();
      }
      art.stop();
    });
    const dltr = ls.getItem("artplayer_settings");
    if (dltr) {
      let currentT = JSON.parse(dltr).times[ls.getItem(`newW-${props.epId}`)]
        ? JSON.parse(dltr).times[ls.getItem(`newW-${props.epId}`)]
        : 0;

      art.on("video:timeupdate", () => {
        if (props.onn3 === "On") {
          if (
            art.currentTime > props.introd?.start &&
            art.currentTime < props.introd?.end
          ) {
            art.seek = props.introd?.end;
          }
          if (
            art.currentTime > props.outrod?.start &&
            art.currentTime < props.outrod?.end
          ) {
            art.seek = props.outrod?.end;
          }
        }
      });
      art.on("subtitleAfterUpdate", (cue) => {
        const subtitleContainer = art.template.$subtitle;
        console.info(subtitleContainer.innerHTML);
        let subtitleLines = document.querySelectorAll(
          '.art-subtitle-line[data-group="0"]'
        );
        subtitleContainer.innerHTML = "";
        subtitleLines.forEach((line) => {
          const newDiv = document.createElement("div");
          const txt = document.createElement("textarea");
          txt.innerHTML = line.innerHTML.trim(); // Decode HTML entities
          newDiv.innerHTML = txt.value; // Set decoded content
          newDiv.classList.add("art-subtitle-line");
          newDiv.style.display = "inline-block"; // Make it fit text width
          newDiv.style.background = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black
          newDiv.style.padding = "4px 0";
          newDiv.style.margin = "2px 0"; // Spacing between lines
          subtitleContainer.appendChild(newDiv); // Append the div
        });
        console.log(
          "Updated Subtitle with Background:",
          subtitleContainer.innerHTML
        );
      });
      art.on("resize", () => {
        art.subtitle.style({
          fontSize: art.height * 0.05 + "px",
          color: "#ffffff",
        });
      });
      art.on("video:ended", () => {
        if (props.onn2 === "On") {
          props.getData("YES");
        } else {
          art.pause();
        }
      });
      let isPlaying = false;
      let errorOccurred = false;
      const timeoutDuration = 10000; // 10 seconds
      const loadingTimeout = setTimeout(() => {
        if (!isPlaying && (art.duration === 0 || isNaN(art.duration))) {
          console.error(
            "The video is stuck loading or failed to play the HLS URL, and the duration is not available."
          );
          props.err("yes happened");
        }
      }, timeoutDuration);
      art.on("playing", () => {
        isPlaying = true;
        clearTimeout(loadingTimeout);
      });
      art.on("video:canplay", () => {
        console.log("Video is ready, no need to switch URL");
      });
    }
    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [
    props.bhaiLink,
    props.sub,
    props.epId,
    props.trutie,
    props.currIdx,
    props.selectedServer,
  ]);

  return (
    <>
      <div className="artplayer-app md:h-[800px] h-[250px] w-full absolute top-0 left-0"></div>
    </>
  );
}
export default ArtPlayer;
