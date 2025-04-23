"use client";
import React, { useEffect, useState } from "react";
import "./footer.css";
import SocialLinks from "../Navbar/Social";
import Link from "next/link";
import Image from "next/image";
export default function Footer(props) {
  const handleNavigation = () => {};
  function getAlphabets() {
    const alphabets = [];
    const startChar = "A".charCodeAt(0);
    const endChar = "Z".charCodeAt(0);
    for (let i = startChar; i <= endChar; i++) {
      alphabets.push(String.fromCharCode(i));
    }
    const links = alphabets.map((el) => {
      return (
        <Link
          href={`/a-z/alpha?sort=${el}&refer=${props.refer}`}
          key={el}
          className="alphabet-tile"
          onClick={handleNavigation}
        >
          {el}
        </Link>
      );
    });
    return [...links];
  }
  const links = getAlphabets();

  // const [siteName, setSiteName] = useState("Animoon");

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const hostname = window.location.hostname; // Get the full domain
  //     const subdomain = hostname.split(".")[0]; // Extract subdomain

  //     // Change text based on subdomain
  //     setSiteName(subdomain);
  //   }
  // }, []);

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing

  return (
    <div className="footer-container d-flex-fd-column j-center">
      <div className="logo-social-links d-flex">
        <div className="main-element">
          <Link href="/?refer=${props.refer}">
            <div className="logo-container">
              <div className="logo-icon"></div>
              <div className="logo-text">{siteName}</div>
            </div>
          </Link>
        </div>
        <SocialLinks />
      </div>
      <div className="help-text d-flex">
        <h2 className="main-element">A-Z List</h2>
        <span>Searching anime order by alphabet name A to Z.</span>
      </div>
      <div className="alphabet-list d-flex">
        <Link href={`/a-z/all?refer=${props.refer}`} onClick={handleNavigation}>
          <div className="alphabet-tile">All</div>
        </Link>
        <Link href={`/a-z/other?sort=other&refer=${props.refer}`} onClick={handleNavigation}>
          <div className="alphabet-tile">#</div>
        </Link>
        <Link href={`/a-z/0-9?sort=0-9&refer=${props.refer}`} onClick={handleNavigation}>
          <div className="alphabet-tile">0-9</div>
        </Link>
        {links}
      </div>
      <div className="copyright-text">
        <p>
          {siteName} does not store any files on our server; we only link to the
          media which is hosted on 3rd party services.
        </p>
        <p>&copy; {siteName} All rights reserved.</p>
      </div>
    </div>
  );
}
