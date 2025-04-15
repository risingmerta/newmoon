"use client";
import React, { useState, useEffect } from "react";
import { FaKey, FaPen, FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { imageData } from "@/data/imageData";
import { signIn } from "next-auth/react";
import "./profito.css";

export default function Profito() {
  const { data: session } = useSession();
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setNewEmail(session.user.email || "");
      setNewUsername(session.user.username || "");
      setNewAvatar(session.user.avatar || "");
    }
  }, [session]);

  const date = new Date(session?.user?.timeOfJoining);
  const formattedDate = `${date.getDate()}-${date.toLocaleString("default", { month: "long" })}-${date.getFullYear()}`;

  const handleSave = async () => {
    const userId = session?.user?.id;
    const updatedFields = {};

    if (newEmail !== session?.user?.email) updatedFields.email = newEmail;
    if (newUsername !== session?.user?.username) updatedFields.username = newUsername;
    if (newAvatar !== session?.user?.avatar) updatedFields.avatar = newAvatar;
    if (newPassword.trim() !== "") updatedFields.password = newPassword; // Only send if password is entered

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
          <div className={`rofile-image`}>
            <img
              src={newAvatar || session?.user?.avatar}
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
            <div className="field-value">{formattedDate}</div>
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
              placeholder="Leave empty to keep current password"
            />
          </div>
          <div className="save-button" onClick={handleSave}>
            Save
          </div>
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
