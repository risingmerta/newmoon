import Script from "next/script";
import React from "react";

const Page = () => {
  return (
    <div>
      {/* Ad Script */}
      <Script
        src="//disgustingmad.com/a8364aeaeff99fac8326528d16cd0941/invoke.js"
        strategy="afterInteractive"
        async
        // data-cfasync="false"
      />

      {/* Ad Container */}
      <div id="container-a8364aeaeff99fac8326528d16cd0941" />
    </div>
  );
};

export default Page;
