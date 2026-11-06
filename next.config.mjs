/** @type {import("next").NextConfig} */
const nextConfig = {
  // Amplify deploys the standard .next output. Container builds opt into the
  // smaller standalone bundle through DEPLOY_TARGET=container.
  ...(process.env.DEPLOY_TARGET === "container" ? { output: "standalone" } : {}),
  async headers() {
    return [
      {
        source: "/dashboard/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Vary", value: "Cookie" },
        ],
      },
    ];
  },
};

export default nextConfig;
