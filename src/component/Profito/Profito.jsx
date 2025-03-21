"use client";
import React from "react";
import { FaKey, FaPen, FaUser } from "react-icons/fa";
import "./profito.css";
import { useSession } from "next-auth/react";

export default function Profito(props) {
  // Create a new Date object

  const { data: session } = useSession();

  const date = new Date(session?.user.timeOfJoining);

  // Get the date and time in a more readable format
  const dated = date.getDate();
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthi = month[date.getMonth()];
  const year = date.getFullYear();

  return (
    <div className="comAll">
      <div className="profile-header">
        <FaUser /> Edit Profile
      </div>
      <div className="profile-content">
        <div className="cofs">
          <div className={`rofile-image`}>
            <img
              src={session?.user.avatar.replace(
                "https://cdn.noitatnemucod.net/avatar/100x100/",
                "https://img.flawlessfiles.com/_r/100x100/100/avatar/"
              )}
              className="profile-img"
              alt="Profile"
            />
            <div className="cof-pen">
              <FaPen />
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-field">
            <div className="field-label">EMAIL ADDRESS</div>
            <input
              className="field-input"
              type="text"
              placeholder={session?.user.email}
              name="email"
            />
          </div>
          <div className="profile-field">
            <div className="field-label">YOUR NAME</div>
            <input
              className="field-input"
              type="text"
              placeholder={session?.user.username}
              name="name"
            />
          </div>
          <div className="profile-field">
            <div className="field-label">JOINED</div>
            <div className="field-value">
              {dated + "-" + monthi + "-" + year}
            </div>
          </div>
          <div className="paske">
            <FaKey />
            Change Password
          </div>
          <div className="save-button">Save</div>
        </div>

        <div className="cofs">
          <div className={`profile-image`}>
            <img
              src={session?.user.avatar.replace(
                "https://cdn.noitatnemucod.net/avatar/100x100/",
                "https://img.flawlessfiles.com/_r/100x100/100/avatar/"
              )}
              className="profile-img"
              alt="Profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
