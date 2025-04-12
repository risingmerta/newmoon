"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import CreateLive from "../CreateLive/CreateLive";
import LivePage from "../LivePage/LivePage";

const WatchLive = (props) => {
  return (
    <>
      <SessionProvider>
        <div>
          {props.animeId ? (
            <CreateLive
              data={props.data}
              episodeId={props.episodeId}
              episodes={props.episodes}
              id={props.animeId}
            />
          ) : (
            <LivePage
              data={props.datal}
              // dataEpi={props.dataEpi}
              secon={props.secon}
              datajSub={props.datajSub}
              datajDub={props.datajDub}
              id={props.id}
            />
          )}
        </div>
      </SessionProvider>
    </>
  );
};

export default WatchLive;
