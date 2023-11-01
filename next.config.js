/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    SEARCH_BASE_URL: process.env.SEARCH_BASE_URL,
    GA_ADSENSE_ID: process.env.GA_ADSENSE_ID,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
    GITHUB_POST_BASE_URL: process.env.GITHUB_POST_BASE_URL,
    GITHUB_APP_CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID,
    GITHUB_APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,
  },
  // basePath: process.env.NODE_ENV === "development" ? "" : "/main", // Sub directory
  // assetPrefix: process.env.NODE_ENV === "development" ? undefined : "/main/", // Nginx
};

module.exports = nextConfig;
