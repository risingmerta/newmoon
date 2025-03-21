import Script from "next/script";

const BannerAd = () => {
  return (
    <div
      style={{
        width: "468px",
        height: "60px",
        margin: "20px auto",
        textAlign: "center",
        backgroundColor: "#f0f0f0", // Temporary background to check div visibility
      }}
    >
      {/* Adsterra configuration */}
      <Script
        id="adsterra-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            atOptions = {
              'key' : '3e5c0db0e54f3f6872ff8546641e31c0',
              'format' : 'iframe',
              'height' : 60,
              'width' : 468,
              'params' : {}
            };
      
            document.addEventListener("DOMContentLoaded", function() {
              var adContainer = document.getElementById("adsterra-ad");
              if (adContainer) {
                adContainer.style.margin = "20px auto";
                adContainer.style.textAlign = "center";
              }
            });
          `,
        }}
      />

      {/* Adsterra script */}
      <Script
        src="//disgustingmad.com/3e5c0db0e54f3f6872ff8546641e31c0/invoke.js"
        strategy="afterInteractive"
      />
    </div>
  );
};

export default BannerAd;
