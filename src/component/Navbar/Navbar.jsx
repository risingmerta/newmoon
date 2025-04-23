"use client";
import React, { useEffect, useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import SearchInput from "./SearchInput";
import Social from "./Social";
import Action from "./Action";
import "./NavCss/nav.css";
import logo from "../../../public/logo.png";
import Image from "next/image";
import Link from "next/link";
import NavSidebar from "../NavSidebar/NavSidebar";
import { useSession } from "next-auth/react";

const Navbar = ({ lang, sign, setProfiIsOpen, refer }) => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFloat, setShowFloat] = useState(false);

  const { data: session } = useSession();

  const showTogg = () => {
    if (showFloat) {
      setShowFloat(false);
    } else {
      setShowFloat(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      if (scrollPosition > 0 && isScrolled === false) {
        setIsScrolled(true);
      } else if (scrollPosition === 0) {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  const toggleProfile = () => setProfiIsOpen(true);

  // const [siteName, setSiteName] = useState("Animoon");

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const hostname = window.location.hostname; // Get the full domain
  //     const subdomain = hostname.split(".")[0]; // Extract subdomain

  //     // Change text based on subdomain
  //     setSiteName(subdomain)
  //   }
  // }, []);

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing

  return (
    <div>
      <NavSidebar
        sidebarIsOpen={sidebarIsOpen}
        setSidebarIsOpen={setSidebarIsOpen}
        lang={lang}
      />
      <div className={`nav-1 ${isScrolled ? "darkio" : ""}`}>
        <div className="nav-in">
          <div onClick={() => setSidebarIsOpen(true)} className="barr">
            <FaBars size={25} />
          </div>
          <div>
            <Link href={`/?refer=${refer}`}>
              <div className="logo-container">
                <div className="logo-icon"></div>
                <div className="logo-text">{siteName}</div>
              </div>
            </Link>
          </div>
          <div className="searc">
            <SearchInput refer={refer} />
          </div>
          <div className="social-links">
            <Social refer={refer} />
          </div>
          <div className="nav-action">
            <Action lang={lang} refer={refer} />
          </div>
        </div>
        <div className="nav-end">
          <div className="nav-ser" onClick={() => showTogg()}>
            <FaSearch />
          </div>
          {session ? (
            <img
              src={
                session.user.avatar.replace(
                  "https://cdn.noitatnemucod.net/avatar/100x100/",
                  "https://img.flawlessfiles.com/_r/100x100/100/avatar/"
                ) || "userData?.randomImage"
              }
              className="profile-ico"
              onClick={toggleProfile}
              alt={session.user.username || "userData?.username" || "user"}
            />
          ) : (
            <div className="nav-log" onClick={() => sign(true)}>
              Login
            </div>
          )}
        </div>
      </div>
      {showFloat && (
        <div className="float-ser">
          <SearchInput float={true} refer={refer} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
