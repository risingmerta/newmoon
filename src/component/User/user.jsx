"use client";
import React, { useState } from "react";
import Slab from "@/component/Slab/Slab";
import Profito from "@/component/Profito/Profito";
import MyComponent from "@/component/ContinueWatching/ContinueWatching";
import WatchList from "@/component/WatchList/WatchList";
import Settings from "@/component/Settings/Settings";
import Notification from "@/component/Notification/Notification";
import { SessionProvider } from "next-auth/react";
import Navbar from "../Navbar/Navbar";
import Profilo from "../Profilo/Profilo";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import Footer from "../Footer/Footer";

export default function User(props) {
  const slabId = props.id.replace("-", " ");

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
        <div>
          <Slab slabId={slabId} />
        </div>
        {props.id === "profile" ? <Profito /> : ""}
        {props.id === "continue-watching" ? <MyComponent /> : ""}
        {props.id === "watch-list" ? <WatchList type={props.type} /> : ""}
        {props.id === "settings" ? <Settings /> : ""}
        {props.id === "notification" ? <Notification /> : ""}
        <div>
          <Footer />
        </div>
      </SessionProvider>
    </>
  );
}
