import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

// const hostname = headers().get("host") || "";
// const siteName = hostname.split('.')[0].toCapitalLize();
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;
const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
export const metadata = {
  title: `${siteName} - Watch free Anime Online English Sub/Dub`,
  description: `${siteName} is the best site to watch Anime SUB online, or you can even watch Anime DUB in HD quality. You can also find UnderRated anime on ${siteName} website.`,
  verification: {
    google: googleVerification,
    "google-adsense-account": adsenseId,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="qwnQljuFScz5pMwy3mHv8BC3aZh5E9J8SYfpKwpgw1E"
        />
      </head>
      <body className={inter.className}>
        {/* Google Analytics Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y81ZRXNW2N"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y81ZRXNW2N');
            `,
          }}
        />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9295326902131480"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          async
        />
        {/* <Script
          strategy="afterInteractive"
          src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
        /> */}
        {children}
      </body>
    </html>
  );
}
