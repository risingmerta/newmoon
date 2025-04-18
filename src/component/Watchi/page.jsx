"use client";
import React from "react";
import WatchAnime from "../WatchAnime/WatchAnime";
import { SessionProvider } from "next-auth/react";

const Watchi = (props) => {
  return (
    <SessionProvider>
      <div>
        <WatchAnime
          data={props.data}
          anId={props.anId}
          schedule={props.schedule}
          subPrio={props.subPrio}
          dataStr={props.dataStr}
          datajDub={props.datajDub}
          datajSub={props.datajSub}
          datao={props.datao}
          epiod={props.epiod}
          epId={props.epId}
          epis={props.epis}
          dataj={props.dataj}
          datapp={props.datapp}
          gogoDub={props.gogoDub}
          gogoSub={props.gogoSub}
          ShareUrl={props.ShareUrl}
          arise={props.arise}
          raw={props.raw}
        />
      </div>
    </SessionProvider>
  );
};

export default Watchi;
