"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const targets = [
	"#f47d5d",
	"#f2a65a",
	"#55b88a",
	"#62a8d8",
	"#b58bd9",
	"#e6c85c",
	"#d96b8a",
	"#5bb8b1",
	"#ef9b4e",
	"#8aa6d8",
	"#d86f4f",
	"#78c091",
	"#c388c7",
	"#e5b85b",
	"#6ca9c9",
	"#db7f98",
	"#82b7a5",
	"#d6a06d",
	"#9a91d1",
	"#e17b63",
] as const;

function hexToRgb(hex: string) {
	return {
		r: Number.parseInt(hex.slice(1, 3), 16),
		g: Number.parseInt(hex.slice(3, 5), 16),
		b: Number.parseInt(hex.slice(5, 7), 16),
	};
}

function colorScore(target: string, guess: string) {
	const targetRgb = hexToRgb(target);
	const guessRgb = hexToRgb(guess);
	const distance = Math.sqrt(
		(targetRgb.r - guessRgb.r) ** 2 +
			(targetRgb.g - guessRgb.g) ** 2 +
			(targetRgb.b - guessRgb.b) ** 2,
	);
	const maximumDistance = Math.sqrt(3 * 255 ** 2);

	return Math.round((1 - distance / maximumDistance) * 100);
}

function shuffle<T>(items: readonly T[]) {
	const shuffled = [...items];

	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[shuffled[index], shuffled[swapIndex]] = [
			shuffled[swapIndex],
			shuffled[index],
		];
	}

	return shuffled;
}

export default function Colors() {
	const [colorRun, setColorRun] = useState<readonly string[]>(targets);
	const [targetIndex, setTargetIndex] = useState(0);
	const [guess, setGuess] = useState("#ffffff");
	const [score, setScore] = useState(0);
	const [roundScore, setRoundScore] = useState<number | null>(null);

	useEffect(() => {
		setColorRun(shuffle(targets));
	}, []);

	function submitGuess(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const points = colorScore(colorRun[targetIndex], guess);
		setRoundScore(points);
		setScore((current) => current + points);
	}

	function nextTarget() {
		setTargetIndex((current) => (current + 1) % colorRun.length);
		setGuess("#ffffff");
		setRoundScore(null);
	}

	return (
		<div className="arcade-game">
			<div className="arcade-topbar">
				<Link className="arcade-back" href="/games">
					← All games
				</Link>
			</div>
			<div className="arcade-heading">
				<p className="arcade-kicker">RGB precision · {score} points</p>
				<h1>Color match</h1>
				<p>
					Use the picker to recreate the target. Closer color means more points.
				</p>
			</div>
			<div
				className="color-target"
				style={{ backgroundColor: colorRun[targetIndex] }}
			>
				<span>{colorRun[targetIndex]}</span>
			</div>
			<form className="color-picker-form" onSubmit={submitGuess}>
				<label htmlFor="color-guess">Your color</label>
				<div className="color-picker-row">
					<input
						id="color-guess"
						type="color"
						value={guess}
						onChange={(event) => setGuess(event.target.value)}
					/>
					<code>{guess.toUpperCase()}</code>
					<button className="arcade-button" type="submit">
						Score color
					</button>
				</div>
			</form>
			{roundScore !== null ? (
				<div className="color-result">
					<strong>{roundScore}/100</strong>
					<span>points this round</span>
					<button className="arcade-button" type="button" onClick={nextTarget}>
						Next target
					</button>
				</div>
			) : (
				<p className="arcade-hint">
					There are {colorRun.length} target colors in this run.
				</p>
			)}
		</div>
	);
}
