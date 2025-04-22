import Script from "next/script";
import React from "react";

const Page = () => {
  return (
    <div>
      <Script
        src="//abackdamstubborn.com/b29918b4e5fbf3e4c13e32f24c7c143c/invoke.js"
        strategy="afterInteractive"
        data-cfasync="false"
        async
      />
      <div id="container-b29918b4e5fbf3e4c13e32f24c7c143c" />
    </div>
  );
};

export default Page;
