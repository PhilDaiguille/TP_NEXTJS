import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	reactStrictMode: true,
	compiler: {
		styledComponents: true,
	},
	compress: true,
};

export default nextConfig;
