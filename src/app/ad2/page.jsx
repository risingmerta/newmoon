import Script from "next/script";
import React from "react";

const Page = () => {
  return (
    <div>
      {/* Ad Script */}
      <Script
        src="//pl26400286.profitableratecpm.com/5d494585d0e04105f2b8a95589379c5d/invoke.js"
        strategy="afterInteractive"
        async
      />

      {/* Ad Container */}
      <div id="container-5d494585d0e04105f2b8a95589379c5d" />
    </div>
  );
};

export default Page;
