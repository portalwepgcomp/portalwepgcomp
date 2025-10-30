/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src', '__tests__'], 
  },
  output: "standalone",
  images: {
    domains: ['proext.ufba.br'],
  },
};



export default nextConfig;
