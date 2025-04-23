"use client";
import React, { useState } from "react";
import { FaComments, FaRandom } from "react-icons/fa";
import { PiBroadcastFill } from "react-icons/pi";
import { BsBroadcast } from "react-icons/bs";
import "./NavCss/action.css";
import Link from "next/link";

const Action = (props) => {
  const [selectedLang, setSelectedLang] = useState("en");

  const toggle = () => {
    if (selectedLang === 'en') {
      setSelectedLang('jp')
      props.lang('jp')
    } 
    if (selectedLang === 'jp') {
      setSelectedLang('en')
      props.lang('en')
    }
  }
  return (
    <div className={`action-comb ${props.isInSidebar ? 'action-new-c' : ''}`}>
      <Link href={`/watch2gether?refer=${props.refer}`} className={`action-bloc ${props.isInSidebar ? 'action-bS' : ''}`}>
        <div className={`action-ico ${props.isInSidebar ? 'action-iS' : ''}`}>
          <PiBroadcastFill/>
        </div>
        <div>Watch2gether</div>
      </Link>

      <div className={`action-bloc ${props.isInSidebar ? 'action-bS' : ''}`}>
        <div className={`action-ico ${props.isInSidebar ? 'action-iS' : ''}`}>
          <FaRandom/>
        </div>
        <div>Random</div>
      </div>

      <div className={`action-bloc ${props.isInSidebar ? 'action-bS' : ''} special-C`}>
        <div className={`action-ico ${props.isInSidebar ? 'action-iS' : ''}`}>
          <button
            className={`engJ ${selectedLang === "en" ? "selEJ" : ""}`}
            onClick={() => toggle()}
          >
            EN
          </button>
          <button
            className={`JpE ${selectedLang === "jp" ? "selEJ" : ""}`}
            onClick={() => toggle()}
          >
            JP
          </button>
        </div>
        <div>Anime Name</div>
      </div>

      {!props.isInSidebar && (
        <div className="action-bloc">
          <div className="action-ico">
            <FaComments />
          </div>
          <div>Community</div>
        </div>
      )}
    </div>
  );
};

export default Action;
