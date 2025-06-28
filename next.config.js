/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    SEARCH_BASE_URL: process.env.SEARCH_BASE_URL,
    GA_ADSENSE_ID: process.env.GA_ADSENSE_ID,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
  },
  // basePath: process.env.NODE_ENV === "development" ? "" : "/main", //  Sub directory
  // assetPrefix: process.env.NODE_ENV === "development" ? undefined : "/main/", // Nginx
};

module.exports = nextConfig;
