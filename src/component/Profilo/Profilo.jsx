"use client";
import React, { useState } from "react";
import "./profilo.css";
import {
  FaArrowRight,
  FaBell,
  FaCog,
  FaHeart,
  FaHistory,
  FaUser,
} from "react-icons/fa";
// import useAnime from "@/hooks/useAnime";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaSackDollar } from "react-icons/fa6";

export default function Profilo(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for sign-out
  const router = useRouter();
  const handleSignOut = async () => {
    setLoading(true); // Start loading
    router.refresh(); // This will reload the current page
    try {
      await signOut({ redirect: false }); // Sign out user using NextAuth
    } catch (err) {
      setError("Error signing out: " + err.message); // Handle sign out error
    } finally {
      setLoading(false); // End loading
    }
  };
  const { data: session } = useSession();
  return (
    <div
      className="profi"
      style={{ zIndex: props.profiIsOpen ? 100 : -1 }}
      onClick={() => props.setProfiIsOpen(false)}
    >
      <div
        className="profi-list"
        style={{
          transform: props.profiIsOpen
            ? "translateX(-260px)"
            : "translateX(250px)",
        }}
      >
        <div className="logA logAC">{session?.user.username}</div>
        <div className="logA logAB">{session?.user.email}</div>
        <Link href={`/user/profile${props.refer?'?refer'=props.refer:''}`} className="profD">
          <FaUser />
          Profile
        </Link>
        <Link href={`/user/continue-watching${props.refer?'?refer'=props.refer:''}`} className="profD">
          <FaHistory />
          Continue Watching
        </Link>
        <Link href={`/user/watch-list${props.refer?'?refer'=props.refer:''}`} className="profD">
          <FaHeart />
          Watch List
        </Link>
        <Link href={`/user/notification${props.refer?'?refer'=props.refer:''}`} className="profD">
          <FaBell />
          Notification
        </Link>
        <Link href={`/user/settings${props.refer?'?refer'=props.refer:''}`} className="profD">
          <FaCog />
          Settings
        </Link>
        <Link href={`/monetize${props.refer?'?refer'=props.refer:''}`} className="profD">
          <FaSackDollar />
          Monetize
        </Link>
        <div className="logD" onClick={handleSignOut} disabled={loading}>
          {loading ? "Loging Out..." : "Logout"}
          <FaArrowRight />
        </div>
      </div>
    </div>
  );
}
