/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  staticPageGenerationTimeout: 3000,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.noitatnemucod.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.zorores.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*", // Apply to all paths
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow", // Allow indexing for all pages
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },
};

export default nextConfig;
