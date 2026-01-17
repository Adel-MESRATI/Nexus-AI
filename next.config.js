/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  // Your existing settings are here:
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withPWA(nextConfig);