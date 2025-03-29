"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ResetPass = (props) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  // const params = new URLSearchParams(window.location.search);
  const token = props.token;

  const handleReset = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    const res = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.message);

    setMessage("Password updated! Redirecting...");
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <h1>{token}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
};

export default ResetPass;
