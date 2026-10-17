/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "vikna-royal.com.ua" },
    ],
  },
};

export default nextConfig;
