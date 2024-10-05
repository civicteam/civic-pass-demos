// Following the advice at https://github.com/vercel/vercel/discussions/5848 for handling rewrites/** @type {import('next').NextConfig} */
const nextConfig = process.env.NODE_ENV === 'production' ? {
    basePath: '/next/evm',
    assetPrefix: "/next/evm",
    trailingSlash: false
} : {};

export default nextConfig;
