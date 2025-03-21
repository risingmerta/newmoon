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
        <Link href={"/user/profile"} className="profD">
          <FaUser />
          Profile
        </Link>
        <Link href={"/user/continue-watching"} className="profD">
          <FaHistory />
          Continue Watching
        </Link>
        <Link href={"/user/watch-list"} className="profD">
          <FaHeart />
          Watch List
        </Link>
        <Link href={"/user/notification"} className="profD">
          <FaBell />
          Notification
        </Link>
        <Link href={"/user/settings"} className="profD">
          <FaCog />
          Settings
        </Link>
        <div className="logD" onClick={handleSignOut} disabled={loading}>
          {loading ? "Loging Out..." : "Logout"}
          <FaArrowRight />
        </div>
      </div>
    </div>
  );
}
