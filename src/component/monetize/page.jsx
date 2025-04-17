"use client";

import "./monetize.css";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Profilo from "../Profilo/Profilo";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import Navbar from "../Navbar/Navbar";

export default function MonetizePage() {
  const { data: session } = useSession();
  const [selectL, setSelectL] = useState("en");
  const [directLink, setDirectLink] = useState("");
  const [refLink, setRefLink] = useState("");
  const [status, setStatus] = useState("");

  const [profiIsOpen, setProfiIsOpen] = useState(false);
  const [logIsOpen, setLogIsOpen] = useState(false);
  const sign = (sign) => {
    setLogIsOpen(sign);
  };

  const lang = (lang) => {
    setSelectL(lang);
  };

  const handleSave = async () => {
    if (!directLink && !refLink) {
      return alert("Please fill at least one link.");
    }

    if (!session) {
      return;
    }

    try {
      const res = await fetch("/api/save-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          directLink,
          refLink,
          userId: session?.user?.id,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setStatus("✅ Your links have been saved.");
      } else {
        setStatus("❌ Failed to save links.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error saving links.");
    }
  };

  return (
    <>
      <Navbar
        lang={lang}
        sign={sign}
        setProfiIsOpen={setProfiIsOpen}
        profiIsOpen={profiIsOpen}
      />
      {profiIsOpen ? (
        <Profilo setProfiIsOpen={setProfiIsOpen} profiIsOpen={profiIsOpen} />
      ) : (
        ""
      )}
      {logIsOpen ? (
        <SignInSignUpModal
          logIsOpen={logIsOpen}
          setLogIsOpen={setLogIsOpen}
          sign={sign}
        />
      ) : (
        ""
      )}
      <div className="container">
        <h1 className="heading">💸 Start Earning with Animoon + Adsterra</h1>
        <p className="text">
          Earn from your streams + refer friends to earn even more!
        </p>

        <div className="box">
          <h2 className="boxTitle">🎥 1. Earn from Live Streaming</h2>
          <p className="text">
            Share your live stream link anywhere — the more people watch, the
            more you earn!
          </p>
        </div>

        <div className="box">
          <h2 className="boxTitle">🔗 2. Add Your Direct Adsterra Link</h2>
          <label>Your Adsterra Direct Link:</label>
          <input
            type="text"
            value={directLink}
            onChange={(e) => setDirectLink(e.target.value)}
            placeholder="Paste your direct ad link here"
            className="input"
          />
        </div>

        <div className="box">
          <h2 className="boxTitle">🤝 3. Refer Friends and Earn More</h2>
          <label>Your Adsterra Referral Link:</label>
          <input
            type="text"
            value={refLink}
            onChange={(e) => setRefLink(e.target.value)}
            placeholder="Paste your referral link here"
            className="input"
          />
        </div>

        <button className="saveButton" onClick={handleSave}>
          💾 Save My Links
        </button>

        {status && <p className="status">{status}</p>}

        <a
          className="button"
          href="https://publishers.adsterra.com/referral"
          target="_blank"
        >
          🚀 Join Adsterra & Get Your Link
        </a>

        <p className="note">
          Save your links above. Share live streams with your audience or
          friends to start earning!
        </p>

        <div className="footer">
          Made with ❤️ by <strong style={{ color: "#c084fc" }}>Animoon</strong>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}
