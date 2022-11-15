/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-43-200-117-200.ap-northeast-2.compute.amazonaws.com",
      "ec2-43-200-117-200.ap-northeast-2.compute.amazonaws.com:3000",
      "43.200.117.200",
      "43.200.117.200:3000",
    ]
  }
}

module.exports = nextConfig
