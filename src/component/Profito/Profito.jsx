"use client";
import React, { useState } from "react";
import { FaKey, FaPen, FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { imageData } from "@/data/imageData";
import { signIn } from "next-auth/react";
import "./profito.css";

export default function Profito() {
  const { data: session } = useSession();
  const [newEmail, setNewEmail] = useState(session?.user?.email || "");
  const [newUsername, setNewUsername] = useState(session?.user?.username || "");
  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState(session?.user?.avatar || "");
  const [showModal, setShowModal] = useState(false);

  const date = new Date(session?.user?.timeOfJoining);
  const dated = date.getDate();
  const month = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];
  const monthi = month[date.getMonth()];
  const year = date.getFullYear();

  const handleSave = async () => {
    const userId = session?.user?.id;
    const updatedFields = {};

    if (newEmail !== session?.user?.email) updatedFields.email = newEmail;
    if (newUsername !== session?.user?.username) updatedFields.username = newUsername;
    if (newPassword) updatedFields.password = newPassword; 
    if (newAvatar !== session?.user?.avatar) updatedFields.avatar = newAvatar;

    if (Object.keys(updatedFields).length === 0) {
      alert("No changes detected");
      return;
    }

    updatedFields.userId = userId;

    const response = await fetch("/api/updateProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFields),
    });

    const data = await response.json();

    if (response.ok) {
      if (updatedFields.email || updatedFields.password) {
        await signIn("credentials", {
          email: newEmail,
          password: newPassword || "",
          redirect: false,
        });
      }

      alert("Profile updated successfully");
      setShowModal(false);
    } else {
      alert(data.message || "Something went wrong");
    }
  };

  return (
    <div className="comAll">
      <div className="profile-header">
        <FaUser /> Edit Profile
      </div>
      <div className="profile-content">
        <div className="cofs">
          <div className={`profile-image`}>
            <img
              src={newAvatar || session?.user.avatar.replace(
                "https://cdn.noitatnemucod.net/avatar/100x100/",
                "https://img.flawlessfiles.com/_r/100x100/100/avatar/"
              )}
              className="profile-img"
              alt="Profile"
            />
            <div className="cof-pen" onClick={() => setShowModal(true)}>
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
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              name="email"
            />
          </div>
          <div className="profile-field">
            <div className="field-label">YOUR NAME</div>
            <input
              className="field-input"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
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
            <FaKey /> Change Password
          </div>
          <div className="profile-field">
            <div className="field-label">NEW PASSWORD</div>
            <input
              className="field-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              name="password"
            />
          </div>
          <div className="save-button" onClick={handleSave}>
            Save
          </div>
        </div>

        {showModal && (
          <div className="avatar-modal">
            <div className="modal-content">
              <h3>Select an Avatar</h3>
              <div className="avatar-selection">
                {Object.keys(imageData.hashtags).map((category) => (
                  <div key={category} className="avatar-category">
                    <h4>{category}</h4>
                    <div className="avatar-images">
                      {imageData.hashtags[category].images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={category}
                          onClick={() => setNewAvatar(img)}
                          className="avatar-image"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowModal(false)}>Close</button>
                <button onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
