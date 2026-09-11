"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HigherLower() {
	const [current, setCurrent] = useState(50);
	const [score, setScore] = useState(0);
	const [best, setBest] = useState(0);
	const [attempts, setAttempts] = useState(0);
	const [correctGuesses, setCorrectGuesses] = useState(0);
	const [message, setMessage] = useState(
		"Will the next number be higher or lower?",
	);

	useEffect(() => {
		setCurrent(Math.floor(Math.random() * 90) + 10);
	}, []);

	function guess(direction: "higher" | "lower") {
		const candidate = Math.floor(Math.random() * 90) + 10;
		const next =
			candidate === current ? (current === 99 ? 98 : current + 1) : candidate;
		const correct = direction === "higher" ? next > current : next < current;

		setCurrent(next);
		setAttempts((value) => value + 1);
		if (correct) {
			setScore((value) => {
				const nextScore = value + 1;
				setBest((currentBest) => Math.max(currentBest, nextScore));
				return nextScore;
			});
			setCorrectGuesses((value) => value + 1);
			setMessage(`Correct. The number was ${next}.`);
		} else {
			setScore(0);
			setMessage(`It was ${next}. Your streak reset.`);
		}
	}

	const accuracy =
		attempts === 0 ? 0 : Math.round((correctGuesses / attempts) * 100);
	const hint =
		current < 50
			? "Hint: higher is statistically more likely below 50."
			: current > 50
				? "Hint: lower is statistically more likely above 50."
				: "Hint: at 50, both choices are equally likely.";

	return (
		<div className="arcade-game">
			<div className="arcade-topbar">
				<Link className="arcade-back" href="/games">
					← All games
				</Link>
			</div>
			<div className="arcade-heading">
				<p className="arcade-kicker">Probability practice · Streak {score}</p>
				<h1>Higher or lower</h1>
				<p>Use the midpoint and your growing accuracy to sharpen your calls.</p>
			</div>
			<div className="number-card" aria-live="polite">
				{current}
			</div>
			<div className="guess-actions">
				<button
					className="arcade-button"
					type="button"
					onClick={() => guess("higher")}
				>
					Higher ↑
				</button>
				<button
					className="arcade-button"
					type="button"
					onClick={() => guess("lower")}
				>
					Lower ↓
				</button>
			</div>
			<p className="arcade-hint">{message}</p>
			<div className="number-stats">
				<span>
					Accuracy <strong>{accuracy}%</strong>
				</span>
				<span>
					Best streak <strong>{best}</strong>
				</span>
			</div>
			<p className="number-hint">{hint}</p>
		</div>
	);
}
