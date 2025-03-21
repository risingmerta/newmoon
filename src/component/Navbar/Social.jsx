import React from "react";
import {
  FaDiscord,
  FaRedditAlien,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";
import './NavCss/social.css'
export default function Social() {
  return (
    <div className="social-links-wrapper">
      <span
        style={{ backgroundColor: "#6f85d5" }}
        className="d-flex a-center j-center"
      >
        <a
          href="https://discord.com/invite/X696ThuZp9"
          target="_blank"
          rel="noreferrer"
        >
          <FaDiscord />
        </a>
      </span>
      <span
        style={{ backgroundColor: "#ff3c1f" }}
        className="d-flex a-center j-center"
      >
        <a
          href="https://t.me/+FGUOP60pSGphZWNl"
          target="_blank"
          rel="noreferrer"
        >
          <FaRedditAlien />
        </a>
      </span>
      <span
        style={{ backgroundColor: "#08c" }}
        className="d-flex a-center j-center"
      >
        <a
          href="https://t.me/+FGUOP60pSGphZWNl"
          target="_blank"
          rel="noreferrer"
        >
          <FaTelegramPlane />
        </a>
      </span>
      <span
        style={{ backgroundColor: "#1d9bf0" }}
        className="d-flex a-center j-center"
      >
        <a
          href="https://t.me/+FGUOP60pSGphZWNl"
          target="_blank"
          rel="noreferrer"
        >
          <FaTwitter />
        </a>
      </span>
    </div>
  );
}
