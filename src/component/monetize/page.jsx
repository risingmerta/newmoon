"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import styles from "./monetize.module.css";

export default function MonetizePage() {
  const { data: session } = useSession();
  const [directLink, setDirectLink] = useState("");
  const [refLink, setRefLink] = useState("");
  const [status, setStatus] = useState("");

  const handleSave = async () => {
    if (!directLink && !refLink) {
      return alert("Please fill at least one link.");
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
    <div className={styles.container}>
      <h1>💸 Start Earning with Animoon + Adsterra</h1>
      <p>Earn from your streams + refer friends to earn even more!</p>

      <div className={styles.box}>
        <h2>🎥 1. Earn from Live Streaming</h2>
        <p>Share your live stream link anywhere — the more people watch, the more you earn!</p>
      </div>

      <div className={styles.box}>
        <h2>🔗 2. Add Your Direct Adsterra Link</h2>
        <label>Your Adsterra Direct Link:</label>
        <input
          type="text"
          value={directLink}
          onChange={(e) => setDirectLink(e.target.value)}
          placeholder="Paste your direct ad link here"
        />
      </div>

      <div className={styles.box}>
        <h2>🤝 3. Refer Friends and Earn More</h2>
        <label>Your Adsterra Referral Link:</label>
        <input
          type="text"
          value={refLink}
          onChange={(e) => setRefLink(e.target.value)}
          placeholder="Paste your referral link here"
        />
      </div>

      <button className={styles.saveButton} onClick={handleSave}>
        💾 Save My Links
      </button>

      {status && <p className={styles.status}>{status}</p>}

      <a
        className={styles.button}
        href="https://publishers.adsterra.com/referral"
        target="_blank"
      >
        🚀 Join Adsterra & Get Your Link
      </a>

      <p className={styles.note}>
        Save your links above. Share live streams with your audience or friends to start earning!
      </p>

      <div className={styles.footer}>
        Made with ❤️ by <strong style={{ color: "#c084fc" }}>Animoon</strong>
      </div>
    </div>
  );
}
