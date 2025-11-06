import type React from "react";
import type { ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
}

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div
			className={`${geistSans.className} ${geistMono.className}`}
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<header
				style={{ background: "#222", color: "#fff", padding: "1rem" }}
			>
				<h1>Mon Site Next.js</h1>
			</header>
			<main style={{ flex: 1, padding: "2rem" }}>{children}</main>
			<footer
				style={{
					background: "#eee",
					color: "#333",
					padding: "1rem",
					textAlign: "center",
				}}
			>
				© {new Date().getFullYear()} Mon Site
			</footer>
		</div>
	);
};

export default Layout;
