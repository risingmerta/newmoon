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
import MonetizePage from "../monetize/page";

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
          refer={props.refer}
        />
        {profiIsOpen ? (
          <Profilo setProfiIsOpen={setProfiIsOpen} profiIsOpen={profiIsOpen} refer={props.refer}/>
        ) : (
          ""
        )}
        {logIsOpen ? (
          <SignInSignUpModal
            logIsOpen={logIsOpen}
            setLogIsOpen={setLogIsOpen}
            sign={sign}
            refer={props.refer}
          />
        ) : (
          ""
        )}
        <div>
          <Slab slabId={slabId} refer={props.refer}/>
        </div>
        {props.id === "profile" ? <Profito refer={props.refer}/> : ""}
        {props.id === "continue-watching" ? <MyComponent page={props.page} refer={props.refer}/> : ""}
        {props.id === "watch-list" ? <WatchList type={props.type} ipage={props.page} refer={props.refer}/> : ""}
        {props.id === "settings" ? <Settings refer={props.refer}/> : ""}
        {props.id === "notification" ? <Notification refer={props.refer}/> : ""}
        {/* {props.id === "monetize" ? <MonetizePage/> : ""} */}
        <div>
          <Footer refer={props.refer}/>
        </div>
      </SessionProvider>
    </>
  );
}
