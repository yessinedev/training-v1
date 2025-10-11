/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // {
          //   key: 'Content-Security-Policy',
          //   // Start with a basic policy and adjust as needed for your specific application
          //   // This example allows resources from self, inline styles/scripts, and data URIs for images.
          //   // For production, aim to remove 'unsafe-inline' and 'unsafe-eval' if possible.
          //   value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none';"
          // },
        ],
      },
    ];
  }
  

  
};

export default nextConfig;
