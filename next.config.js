/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    SEARCH_BASE_URL: process.env.SEARCH_BASE_URL,
    GA_ADSENSE_ID: process.env.GA_ADSENSE_ID,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
  },
  // basePath: process.env.NODE_ENV === "development" ? "" : "/main", //  Sub directory
  // assetPrefix: process.env.NODE_ENV === "development" ? undefined : "/main/", // Nginx
  
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  
  // Configure build output
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize large dependencies that don't need to be bundled
      config.externals = [...(config.externals || []), 'canvas'];
    }
    return config;
  },
};

module.exports = nextConfig;
