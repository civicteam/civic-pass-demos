// Following the advice at https://github.com/vercel/vercel/discussions/5848 for handling rewrites/** @type {import('next').NextConfig} */
const nextConfig = process.env.NODE_ENV === 'production' ? {
    basePath: '/next/solana',
    assetPrefix: "/next/solana",
    trailingSlash: false
} : {};

export default nextConfig;
