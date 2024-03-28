/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            hostname: 'media.licdn.com',
          },
        ],
      },
};

export default nextConfig;
