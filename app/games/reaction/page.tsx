"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ReactionPhase = "idle" | "waiting" | "ready" | "result" | "tooSoon";

export default function Reaction() {
	const [phase, setPhase] = useState<ReactionPhase>("idle");
	const [reactionTime, setReactionTime] = useState<number | null>(null);
	const signalTime = useRef(0);
	const timer = useRef<number | null>(null);

	useEffect(
		() => () => {
			if (timer.current) window.clearTimeout(timer.current);
		},
		[],
	);

	function startRound() {
		if (timer.current) window.clearTimeout(timer.current);
		setReactionTime(null);
		setPhase("waiting");
		timer.current = window.setTimeout(
			() => {
				signalTime.current = performance.now();
				setPhase("ready");
			},
			1200 + Math.random() * 2200,
		);
	}

	function handleTap() {
		if (phase === "idle" || phase === "result" || phase === "tooSoon") {
			startRound();
			return;
		}

		if (phase === "waiting") {
			if (timer.current) window.clearTimeout(timer.current);
			timer.current = null;
			setPhase("tooSoon");
			return;
		}

		const result = Math.round(performance.now() - signalTime.current);
		setReactionTime(result);
		setPhase("result");
	}

	const message = {
		idle: "Tap start, then wait for the signal.",
		waiting: "Hold... do not tap yet.",
		ready: "TAP NOW",
		result: `${reactionTime} ms`,
		tooSoon: "Too soon. Your finger jumped the gun.",
	}[phase];

	return (
		<div className="arcade-game reaction-game">
			<div className="arcade-topbar">
				<Link className="arcade-back" href="/games">
					← All games
				</Link>
			</div>
			<div className="arcade-heading">
				<p className="arcade-kicker">Reflex test</p>
				<h1>Reaction window</h1>
				<p>How quickly can you catch the moment?</p>
			</div>
			<button
				className={`reaction-pad ${phase}`}
				type="button"
				onClick={handleTap}
				aria-label={phase === "ready" ? "Tap now" : "Start reaction test"}
			>
				<span>{phase === "idle" ? "Start" : message}</span>
			</button>
			<p className="arcade-hint">
				{phase === "result" ? "Tap to run it again." : message}
			</p>
		</div>
	);
}
