"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DigitPhase = "showing" | "input" | "success" | "wrong";

function createDigits(length: number) {
	return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export default function Digits() {
	const [sequence, setSequence] = useState("4827");
	const [answer, setAnswer] = useState("");
	const [level, setLevel] = useState(1);
	const [phase, setPhase] = useState<DigitPhase>("showing");

	useEffect(() => {
		const timer = window.setTimeout(() => setPhase("input"), 1800);
		return () => window.clearTimeout(timer);
	}, [sequence]);

	function submitAnswer(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (phase !== "input") return;

		if (answer === sequence) {
			setPhase("success");
			window.setTimeout(() => {
				setSequence(createDigits(sequence.length + 1));
				setAnswer("");
				setLevel((current) => current + 1);
				setPhase("showing");
			}, 700);
		} else {
			setPhase("wrong");
		}
	}

	function restart() {
		setSequence(createDigits(4));
		setAnswer("");
		setLevel(1);
		setPhase("showing");
	}

	return (
		<div className="arcade-game digits-game">
			<div className="arcade-topbar">
				<Link className="arcade-back" href="/games">
					← All games
				</Link>
			</div>
			<div className="arcade-heading">
				<p className="arcade-kicker">Memory climb · Level {level}</p>
				<h1>Digit vault</h1>
				<p>
					Keep the number in your head. It grows every time you get it right.
				</p>
			</div>
			<div className={`digit-display ${phase}`} aria-live="polite">
				{phase === "showing" || phase === "success"
					? sequence
					: "?".repeat(sequence.length)}
			</div>
			{phase === "input" || phase === "wrong" ? (
				<form className="digit-form" onSubmit={submitAnswer}>
					<label htmlFor="digit-answer">Enter the sequence</label>
					<input
						id="digit-answer"
						inputMode="numeric"
						pattern="[0-9]*"
						value={answer}
						onChange={(event) =>
							setAnswer(event.target.value.replace(/\D/g, ""))
						}
						autoFocus
					/>
					<button className="arcade-button" type="submit">
						Check answer
					</button>
					{phase === "wrong" && (
						<p className="arcade-error">Not this time. Start over?</p>
					)}
				</form>
			) : (
				<p className="arcade-hint">
					{phase === "success"
						? "Nice recall. Loading a longer vault..."
						: "Memorize the number."}
				</p>
			)}
			<button className="arcade-button quiet" type="button" onClick={restart}>
				Reset game
			</button>
		</div>
	);
}
