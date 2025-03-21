"use client";
import React, { useEffect, useRef } from "react";

const BannerAd = () => {
  const adRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && adRef.current) {
      // Clear previous content to avoid duplication
      adRef.current.innerHTML = "";

      // Inject Adsterra's JavaScript snippet
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "//disgustingmad.com/3e5c0db0e54f3f6872ff8546641e31c0/invoke.js";
      script.async = true;

      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={adRef}
      style={{
        width: "468px",
        height: "60px",
        margin: "20px auto",
        textAlign: "center",
        backgroundColor: "#f0f0f0", // Temporary background to check div visibility
      }}
    >
      {/* Adsterra should load here */}
    </div>
  );
};

export default BannerAd;
