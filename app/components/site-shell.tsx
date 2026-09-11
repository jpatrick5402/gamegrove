"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

export default function SiteShell({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<"dark" | "light">("dark");

	useEffect(() => {
		const storedTheme = window.localStorage.getItem("gamegrove-theme");
		const nextTheme = storedTheme === "light" ? "light" : "dark";
		document.documentElement.dataset.theme = nextTheme;
		window.localStorage.setItem("gamegrove-theme", nextTheme);
		setTheme(nextTheme);
	}, []);

	function toggleTheme() {
		const nextTheme = theme === "dark" ? "light" : "dark";
		document.documentElement.dataset.theme = nextTheme;
		window.localStorage.setItem("gamegrove-theme", nextTheme);
		setTheme(nextTheme);
	}

	return (
		<div className="site-shell">
			<nav className="site-nav" aria-label="Main navigation">
				<Link className="site-brand" href="/">
					<img src="/gamegrove-mark.svg" alt="" />
					<span className="site-brand-text">
						Game<span>Grove</span>
					</span>
				</Link>
				<div className="site-nav-links">
					<Link href="/games">Catalogue</Link>
					<button
						className="theme-toggle"
						type="button"
						onClick={toggleTheme}
						aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
					>
						{theme === "dark" ? "Light mode" : "Dark mode"}
					</button>
				</div>
			</nav>
			<main className="site-main">{children}</main>
		</div>
	);
}
