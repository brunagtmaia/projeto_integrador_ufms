/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite o Playwright (e o navegador em localhost / 127.0.0.1)
  // carregar os scripts do modo `next dev` sem bloqueio cross-origin.
  allowedDevOrigins: ["localhost", "127.0.0.1"],
};

export default nextConfig;
