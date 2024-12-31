/** @type {import('next').NextConfig} */

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)', // 適用於所有路徑
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; connect-src 'self' https://wade-personal.de.r.appspot.com; script-src 'self'; style-src 'self';"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
