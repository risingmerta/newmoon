import React from "react";

const page = () => {
  return (
    <div>
      <div style={{ width: "100%", height: "100px", overflow: "hidden" }}>
        <Script
          src="//disgustingmad.com/b29918b4e5fbf3e4c13e32f24c7c143c/invoke.js"
          strategy="afterInteractive"
          async
          data-cfasync="false"
        />
        {/* Ad container */}
        <div id="container-b29918b4e5fbf3e4c13e32f24c7c143c"></div>
      </div>
    </div>
  );
};

export default page;
