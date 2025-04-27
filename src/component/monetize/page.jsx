"use client";

import "./monetize.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Profilo from "../Profilo/Profilo";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Toast from "../Toast/Toast";

export default function MonetizePage(props) {
  const { data: session } = useSession();
  const [selectL, setSelectL] = useState("en");
  const [directLink, setDirectLink] = useState("");
  const [refLink, setRefLink] = useState("");
  const [status, setStatus] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [profiIsOpen, setProfiIsOpen] = useState(false);
  const [logIsOpen, setLogIsOpen] = useState(false);
  const [alreadyMonetized, setAlreadyMonetized] = useState(false);

  const sign = (sign) => setLogIsOpen(sign);
  const lang = (lang) => setSelectL(lang);

  useEffect(() => {
    const fetchLinks = async () => {
      if (!session) {
        setAlreadyMonetized(false);
        return;
      }

      try {
        const res = await fetch(`/api/get-links?userId=${session?.user?.id}`);
        const result = await res.json();

        if (result?.directLink) {
          setAlreadyMonetized(true);
          setDirectLink(result.directLink); // Pre-fill the existing direct link
        }
        if (result?.refLink) {
          setRefLink(result.refLink); // Pre-fill the existing referral link
        }
      } catch (err) {
        console.error("Error fetching user links:", err);
      }
    };

    fetchLinks();
  }, [session]);

  const handleSave = async () => {
    if (!directLink) {
      setStatus("Please enter your Direct Adsterra Link.");
      return;
    }
    if (!session) {
      setLogIsOpen(true);
      setStatus("Please sign in to save your links.");
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
        setStatus("");
        setShowToast(true);
        setDirectLink("");
        setRefLink("");
        setAlreadyMonetized(true);
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
      {profiIsOpen && (
        <Profilo setProfiIsOpen={setProfiIsOpen} profiIsOpen={profiIsOpen} />
      )}
      {logIsOpen && (
        <SignInSignUpModal
          logIsOpen={logIsOpen}
          setLogIsOpen={setLogIsOpen}
          sign={sign}
        />
      )}

      <div className="container">
        {alreadyMonetized ? (
          <>
            <h1 className="heading">🎉 You Are Monetized!</h1>
            <p className="text">
              Thanks for setting up your Direct Link. Start sharing and earning
              now!
            </p>
            <a
              className="button"
              href="https://beta.publishers.adsterra.com/referral/XbbeibecUR"
              target="_blank"
              rel="noopener noreferrer"
            >
              🚀 Manage Your Adsterra Account
            </a>

            {/* Update Links Form */}
            <div className="box" style={{ marginTop: "2rem" }}>
              <h2 className="boxTitle">✏️ Update Your Links</h2>

              <label>Update Direct Link:</label>
              <input
                type="text"
                value={directLink}
                onChange={(e) => setDirectLink(e.target.value)}
                placeholder="Update your direct link"
                className="input"
              />

              <label>Update Referral Link:</label>
              <input
                type="text"
                value={refLink}
                onChange={(e) => setRefLink(e.target.value)}
                placeholder="Update your referral link"
                className="input"
              />

              <button className="saveButton" onClick={handleSave}>
                🔄 Update Links
              </button>

              {status && <p className="status">{status}</p>}
            </div>
          </>
        ) : (
          <>
            <h1 className="heading">
              💸 Start Earning with Animoon + Adsterra
            </h1>
            <p className="text">
              Earn from your streams + refer friends to earn even more!
            </p>

            <div className="box">
              <h2 className="boxTitle">🎥 1. Earn from Live Streaming</h2>
              <p className="text">
                Share your live stream link anywhere — the more people watch,
                the more you earn!
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
              <div className="videoWrapper">
                <iframe
                  src="https://www.youtube.com/embed/a9RXktchr6o"
                  title="How To Create ADSTERRA DIRECT LINK As A Beginner (2024)"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="box">
              <h2 className="boxTitle">🤝 3. (Optional) Refer Friends</h2>
              <label>Your Adsterra Referral Link:</label>
              <input
                type="text"
                value={refLink}
                onChange={(e) => setRefLink(e.target.value)}
                placeholder="Paste your referral link here"
                className="input"
              />
              {refLink && (
                <iframe
                  src={refLink}
                  width="100%"
                  height="250"
                  frameBorder="0"
                  sandbox="allow-scripts allow-same-origin"
                  title="Referral Link Preview"
                />
              )}
            </div>

            <button className="saveButton" onClick={handleSave}>
              💾 Save My Links
            </button>

            {status && <p className="status">{status}</p>}

            <a
              className="button"
              href="https://beta.publishers.adsterra.com/referral/XbbeibecUR"
              target="_blank"
              rel="noopener noreferrer"
            >
              🚀 Join Adsterra & Get Your Link
            </a>

            <p className="note">
              Save your links above. Share live streams with your audience or
              friends to start earning!
            </p>
          </>
        )}

        <div className="footer">
          Made with ❤️ by <strong style={{ color: "#c084fc" }}>Animoon</strong>
        </div>
      </div>

      {showToast && (
        <Toast
          message="✅ Your links have been saved!"
          onClose={() => setShowToast(false)}
        />
      )}

      <div>
        <Footer refer={props.refer} />
      </div>
    </>
  );
}
