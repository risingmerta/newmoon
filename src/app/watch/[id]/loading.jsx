"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import SpotlightLoader from "@/component/Loader/SpotlightLoader";

// Your Loading Component
function Loading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;

    const startLoading = () => {
      setLoading(true);
      setProgress(30);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
    };

    const stopLoading = () => {
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    };

    startLoading();

    // Simulate page finish loading
    const timeout = setTimeout(() => {
      stopLoading();
    }, 800); // adjust based on your app's speed

    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, [pathname, searchParams]); // every time path or query changes

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: "4px",
        backgroundColor: "#00f2fe",  // Updated to your theme color
        zIndex: 9999,
        transition: "width 0.3s ease",
      }}
    />
  );
}

// Wrap the Loading component inside Suspense
export default function PageComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Loading />
    </Suspense>
  );
}
