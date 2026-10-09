import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  /*
   * standalone bundelt de server plus alleen de gebruikte node_modules, zodat
   * de Docker-image klein blijft. Nodig voor de deploy op de eigen server;
   * de Cloudflare-build negeert deze instelling.
   */
  output: "standalone",
  allowedDevOrigins: ["botmandesign.test"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
