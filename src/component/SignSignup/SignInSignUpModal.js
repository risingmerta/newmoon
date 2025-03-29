"use client";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { imageData } from "@/data/imageData"; // Import images
import "./signmodal.css";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// Function to get a random avatar
const getRandomImage = () => {
  const categories = Object.keys(imageData.hashtags);
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
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
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isSignUp) {
      setAvatar(getRandomImage());
    }
  }, [isSignUp]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    router.refresh();
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
                className="midOI midN"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="midO">
              <div className="midOT">PASSWORD</div>
              <div className="relati">
                <input
                  type={showPassword ? "text" : "password"}
                  className="midOI pr-10"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
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
