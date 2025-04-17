"use client";
import React from "react";
import { FaBell, FaCog, FaHeart, FaHistory, FaUser } from "react-icons/fa";
import Link from "next/link";
import "./slab.css";
import { useSession } from "next-auth/react";
import { FaSackDollar } from "react-icons/fa6";

export default function Slab(props) {
  const { data: session } = useSession();
  return (
    <div className="allpit">
      <img
        className="allpit-background"
        src={session?.user?.avatar}
        alt="pop"
      />
      <div className="hiik">Hi, {session?.user?.username}</div>
      <div className="linkok">
        <Link
          href={"/user/profile"}
          className={`newPo ${props.slabId === "profile" ? "impot" : ""}`}
        >
          <div className="iconix">
            <FaUser />
          </div>
          <div className="namino">Profile</div>
        </Link>
        <Link
          href={"/user/continue-watching"}
          className={`newPo ${
            props.slabId === "continue watching" ? "impot" : ""
          }`}
        >
          <div className="iconix">
            <FaHistory />
          </div>
          <div className="namino">Continue Watching</div>
        </Link>
        <Link
          href={"/user/watch-list"}
          className={`newPo ${props.slabId === "watch list" ? "impot" : ""}`}
        >
          <div className="iconix">
            <FaHeart />
          </div>
          <div className="namino">Watch List</div>
        </Link>
        <Link
          href={"/user/notification"}
          className={`newPo ${props.slabId === "notification" ? "impot" : ""}`}
        >
          <div className="iconix">
            <FaBell />
          </div>
          <div className="namino">Notification</div>
        </Link>
        <Link
          href={"/user/settings"}
          className={`newPo ${props.slabId === "settings" ? "impot" : ""}`}
        >
          <div className="iconix">
            <FaCog />
          </div>
          <div className="namino">Settings</div>
        </Link>
        {/* <Link
          href={"/user/monetize"}
          className={`newPo ${props.slabId === "monetize" ? "impot" : ""}`}
        >
          <div className="iconix">
            <FaSackDollar />
          </div>
          <div className="namino">Monetize</div>
        </Link> */}
      </div>
    </div>
  );
}
