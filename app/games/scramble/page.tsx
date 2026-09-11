"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { wordBank } from "./word-bank";

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

export default function Scramble() {
	const [wordRun, setWordRun] =
		useState<readonly (readonly [string, string])[]>(wordBank);
	const [wordIndex, setWordIndex] = useState(0);
	const [answer, setAnswer] = useState("");
	const [message, setMessage] = useState("Unscramble the letters.");

	useEffect(() => {
		setWordRun(shuffle(wordBank));
	}, []);

	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const [word] = wordRun[wordIndex];

		if (answer.trim().toLowerCase() === word) {
			setMessage("Solved. Here comes another.");
			setWordIndex((current) => (current + 1) % wordRun.length);
			setAnswer("");
		} else {
			setMessage("Not quite. Try rearranging the letters.");
		}
	}

	return (
		<div className="arcade-game">
			<div className="arcade-topbar">
				<Link className="arcade-back" href="/games">
					← All games
				</Link>
			</div>
			<div className="arcade-heading">
				<p className="arcade-kicker">
					Word puzzle · {wordIndex + 1}/{wordRun.length}
				</p>
				<h1>Word scramble</h1>
				<p>Put the letters back in their proper order.</p>
			</div>
			<div className="scramble-word" aria-label="Scrambled word">
				{wordRun[wordIndex][1]}
			</div>
			<form className="scramble-form" onSubmit={submit}>
				<label htmlFor="scramble-answer">Your answer</label>
				<input
					id="scramble-answer"
					value={answer}
					onChange={(event) => setAnswer(event.target.value)}
					autoComplete="off"
					autoFocus
				/>
				<button className="arcade-button" type="submit">
					Check word
				</button>
			</form>
			<p className="arcade-hint">{message}</p>
		</div>
	);
}
