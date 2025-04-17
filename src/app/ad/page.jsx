import Script from "next/script";
import React from "react";

const page = () => {
  return (
    <div>
      <Script
        src="//disgustingmad.com/b29918b4e5fbf3e4c13e32f24c7c143c/invoke.js"
        strategy="afterInteractive"
        async
        // data-cfasync="false"
      />
      {/* Ad container */}
      <div id="container-b29918b4e5fbf3e4c13e32f24c7c143c"></div>
    </div>
  );
};

export default page;
