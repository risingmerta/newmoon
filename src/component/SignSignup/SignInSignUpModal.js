"use client";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { imageData } from "@/data/imageData"; // Import images
import "./signmodal.css";
import { useRouter } from "next/navigation";

// Function to get a random avatar
const getRandomImage = () => {
  const categories = Object.keys(imageData.hashtags);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const images = imageData.hashtags[randomCategory].images;
  return images[Math.floor(Math.random() * images.length)];
};

const SignInSignUpModal = (props) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { data: session } = useSession();

  // Load stored credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    const savedUsername = localStorage.getItem("username");

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
    if (savedUsername) setUsername(savedUsername);
  }, []);

  useEffect(() => {
    if (isSignUp) {
      setAvatar(getRandomImage());
    }
  }, [isSignUp]);

  const router = useRouter();

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    router.refresh(); // This will reload the current page
  };

  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username, avatar }),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.message);

    // Store credentials locally
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("username", username);

    await signIn("credentials", { email, password, redirect: false });
  };

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) setError(result.error);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) return setError("Enter your email to reset password");
  
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.message);
  
    setMessage("Password reset email sent! Check your inbox.");
  };

  return (
    <div
      className="modal"
      style={{
        zIndex: props.logIsOpen ? 100 : -100,
        opacity: props.logIsOpen ? 1 : 0,
      }}
      onClick={() => props.setLogIsOpen(false)}
    >
      <div
        className="modal-content"
        style={{
          transform: props.logIsOpen ? "translateX(0px)" : "translateX(1000px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {session ? (
          <>
            <p className="heddio">Welcome, {session.user.username}!</p>
            <img
              src={session.user.avatar.replace(
                "https://cdn.noitatnemucod.net/avatar/100x100/",
                "https://img.flawlessfiles.com/_r/100x100/100/avatar/"
              )}
              alt="Profile"
              className="profile-avatar"
            />
            <button onClick={handleSignOut} disabled={loading}>
              {loading ? "Signing Out..." : "Sign Out"}
            </button>
          </>
        ) : (
          <>
            <div className="heddp">
              <h2 className="heddio">
                {isSignUp ? "Create an Account" : "Welcome back!"}
              </h2>
            </div>

            {isSignUp && (
              <div className="midO">
                <div className="midOT">USERNAME</div>
                <input
                  type="text"
                  className="midOI"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}
            <div className="midO">
              <div className="midOT">EMAIL ADDRESS</div>
              <input
                type="email"
                className="midOI"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="midO">
              <div className="midOT">PASSWORD</div>
              <input
                type="password"
                className="midOI"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="midI">
              <label className="kinto">
                <input
                  type="checkbox"
                  className="checki"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <button
                  onClick={handleForgotPassword}
                  className="kinto forget-pass"
                >
                  Forgot Password?
              </button>
            </div>

            {error && <p style={{ color: "#ff9999" }}>{error}</p>}

            <div
              className="btiom"
              onClick={isSignUp ? handleSignUp : handleSignIn}
            >
              <button className="btio" disabled={loading}>
                {loading ? "Hang in there..." : isSignUp ? "Register" : "Login"}
              </button>
            </div>

            <div className="line-up">
              <div className="kinto">
                <div>
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </div>
                <div className="forget-pass" onClick={toggleMode}>
                  {isSignUp ? "Login" : "Register"}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignInSignUpModal;
