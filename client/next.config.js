/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-43-200-117-200.ap-northeast-2.compute.amazonaws.com",
      "43.200.117.200",
      "heonpage.com",
      "www.heonpage.com",
    ]
  }
}

module.exports = nextConfig
