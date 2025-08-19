import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{ protocol: 'http', hostname: 'res.cloudinary.com', pathname: '/**' },
			{ protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
			{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
		],
	},
	// Suppress build errors for production deployment
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	// Disable telemetry
	telemetry: false,
}

export default nextConfig
