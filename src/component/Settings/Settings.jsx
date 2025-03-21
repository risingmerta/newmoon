"use client";
import React, { useEffect, useState } from "react";
import "./settings.css";
import { FaCog } from "react-icons/fa";

const Settings = () => {
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
  const getInitialState = (key, defaultValue) =>
    JSON.parse(ls.getItem(key)) ?? defaultValue;

  const [autoNext, setAutoNext] = useState(getInitialState("autoNext", false));
  const [autoPlay, setAutoPlay] = useState(getInitialState("autoPlay", false));
  const [autoSkipIntro, setAutoSkipIntro] = useState(
    getInitialState("autoSkipIntro", false)
  );
  const [enableDub, setEnableDub] = useState(
    getInitialState("enableDub", false)
  );
  const [playOriginalAudio, setPlayOriginalAudio] = useState(
    getInitialState("playOriginalAudio", false)
  );
  const [language, setLanguage] = useState(
    getInitialState("language", "english")
  );
  const [showComments, setShowComments] = useState(
    getInitialState("showComments", false)
  );
  const [publicWatchList, setPublicWatchList] = useState(
    getInitialState("publicWatchList", false)
  );
  const [notificationFolders, setNotificationFolders] = useState(
    getInitialState("notificationFolders", {
      watching: false,
      onHold: false,
      planToWatch: false,
      dropped: false,
      completed: false,
    })
  );
  const [notificationLanguage, setNotificationLanguage] = useState(
    getInitialState("notificationLanguage", "none")
  );

  useEffect(() => {
    ls.setItem("autoNext", JSON.stringify(autoNext));
  }, [autoNext]);

  useEffect(() => {
    ls.setItem("autoPlay", JSON.stringify(autoPlay));
  }, [autoPlay]);

  useEffect(() => {
    ls.setItem("autoSkipIntro", JSON.stringify(autoSkipIntro));
  }, [autoSkipIntro]);

  useEffect(() => {
    ls.setItem("enableDub", JSON.stringify(enableDub));
  }, [enableDub]);

  useEffect(() => {
    ls.setItem(
      "playOriginalAudio",
      JSON.stringify(playOriginalAudio)
    );
  }, [playOriginalAudio]);

  useEffect(() => {
    ls.setItem("language", JSON.stringify(language));
  }, [language]);

  useEffect(() => {
    ls.setItem("showComments", JSON.stringify(showComments));
  }, [showComments]);

  useEffect(() => {
    ls.setItem("publicWatchList", JSON.stringify(publicWatchList));
  }, [publicWatchList]);

  useEffect(() => {
    ls.setItem(
      "notificationFolders",
      JSON.stringify(notificationFolders)
    );
  }, [notificationFolders]);

  useEffect(() => {
    ls.setItem(
      "notificationLanguage",
      JSON.stringify(notificationLanguage)
    );
  }, [notificationLanguage]);

  const handleCheckboxChange = (folder) => {
    setNotificationFolders((prevState) => ({
      ...prevState,
      [folder]: !prevState[folder],
    }));
  };

  

  return (
    <div>
      <div className="settFa">
        <div className="settMidd">
          <div className="settPro">
            <FaCog />
            Settings
          </div>
        </div>
      </div>
      <div className="settings-container">
        <div className="settings">
          <div className="setting-item">
            <div className="setting-label">Auto Next</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={autoNext}
                  onChange={() => setAutoNext(!autoNext) & ls.setItem("Onn2","Off")}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-label">Auto Play</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={() => setAutoPlay(!autoPlay) & ls.setItem("Onn1","Off")}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-label">Auto Skip Intro</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={autoSkipIntro}
                  onChange={() => setAutoSkipIntro(!autoSkipIntro) & ls.setItem("Onn3","Off")}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-label">Enable DUB</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={enableDub}
                  onChange={() => setEnableDub(!enableDub)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-label">Play Original Audio</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={playOriginalAudio}
                  onChange={() => setPlayOriginalAudio(!playOriginalAudio)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="setting-description">
            If enabled, the player will play original audio by default.
          </div>
          <div className="setting-item">
            <div className="setting-label">Language for anime name</div>
            <div>
              <select
                className="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="english">English</option>
                <option value="japanese">Japanese</option>
              </select>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-label">Show comments at home</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={showComments}
                  onChange={() => setShowComments(!showComments)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-label">Public Watch List</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={publicWatchList}
                  onChange={() => setPublicWatchList(!publicWatchList)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-label">Notification ignore folders</div>
            <div>
              <label className="checkbox-container">
                Watching
                <input
                  type="checkbox"
                  checked={notificationFolders.watching}
                  onChange={() => handleCheckboxChange("watching")}
                />
                <span className="checkmark"></span>
              </label>
              <label className="checkbox-container">
                On-Hold
                <input
                  type="checkbox"
                  checked={notificationFolders.onHold}
                  onChange={() => handleCheckboxChange("onHold")}
                />
                <span className="checkmark"></span>
              </label>
              <label className="checkbox-container">
                Plan to watch
                <input
                  type="checkbox"
                  checked={notificationFolders.planToWatch}
                  onChange={() => handleCheckboxChange("planToWatch")}
                />
                <span className="checkmark"></span>
              </label>
              <label className="checkbox-container">
                Dropped
                <input
                  type="checkbox"
                  checked={notificationFolders.dropped}
                  onChange={() => handleCheckboxChange("dropped")}
                />
                <span className="checkmark"></span>
              </label>
              <label className="checkbox-container">
                Completed
                <input
                  type="checkbox"
                  checked={notificationFolders.completed}
                  onChange={() => handleCheckboxChange("completed")}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-label">Notification ignore language</div>
            <div>
              <label className="radio-container">
                None
                <input
                  type="radio"
                  name="notificationLanguage"
                  value="none"
                  checked={notificationLanguage === "none"}
                  onChange={() => setNotificationLanguage("none")}
                />
                <span className="radio-checkmark"></span>
              </label>
              <label className="radio-container">
                SUB
                <input
                  type="radio"
                  name="notificationLanguage"
                  value="sub"
                  checked={notificationLanguage === "sub"}
                  onChange={() => setNotificationLanguage("sub")}
                />
                <span className="radio-checkmark"></span>
              </label>
              <label className="radio-container">
                DUB
                <input
                  type="radio"
                  name="notificationLanguage"
                  value="dub"
                  checked={notificationLanguage === "dub"}
                  onChange={() => setNotificationLanguage("dub")}
                />
                <span className="radio-checkmark"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
