import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteShell from "./components/site-shell";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "GameGrove | Where You Pretend You're at Work",
	description: "A tiny arcade for big breaks.",
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
	},
	openGraph: {
		title: "GameGrove",
		description: "A tiny arcade for big breaks.",
		images: ["/gamegrove-social.svg"],
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body>
				<SiteShell>{children}</SiteShell>
			</body>
		</html>
	);
}
