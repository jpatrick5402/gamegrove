"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";

const initialGridSize = 3;
const initialPatternSize = 4;
const revealDurations = {
	easy: 3000,
	normal: 2000,
	hard: 1000,
} as const;

type Difficulty = keyof typeof revealDurations;
type GamePhase = "showing" | "playing" | "success" | "error";

function patternSizeForGrid(size: number) {
	return Math.ceil(size * size * 0.35);
}

function createPattern(
	size: number,
	sizeOfPattern: number,
	previousPattern?: Set<number>,
) {
	let pattern = new Set<number>();

	do {
		pattern = new Set<number>();
		while (pattern.size < sizeOfPattern) {
			pattern.add(Math.floor(Math.random() * size * size));
		}
	} while (
		previousPattern &&
		pattern.size === previousPattern.size &&
		[...pattern].every((index) => previousPattern.has(index))
	);

	return pattern;
}

export default function Memory() {
	const [targetPattern, setTargetPattern] = useState<Set<number>>(
		() => new Set([0, 2, 4, 8]),
	);
	const [gridSize, setGridSize] = useState(initialGridSize);
	const [correctInLevel, setCorrectInLevel] = useState(0);
	const [selectedPattern, setSelectedPattern] = useState<Set<number>>(
		new Set(),
	);
	const [phase, setPhase] = useState<GamePhase>("showing");
	const [round, setRound] = useState(1);
	const [patternId, setPatternId] = useState(0);
	const [difficulty, setDifficulty] = useState<Difficulty>("normal");

	useEffect(() => {
		setTargetPattern(createPattern(initialGridSize, initialPatternSize));
	}, []);

	useEffect(() => {
		const timer = window.setTimeout(
			() => setPhase("playing"),
			revealDurations[difficulty],
		);

		return () => window.clearTimeout(timer);
	}, [difficulty, patternId, round]);

	function toggleTile(index: number) {
		if (phase !== "playing") return;

		setSelectedPattern((current) => {
			const next = new Set(current);
			if (next.has(index)) next.delete(index);
			else next.add(index);
			return next;
		});
	}

	function submitPattern() {
		if (phase !== "playing") return;

		const isCorrect =
			selectedPattern.size === targetPattern.size &&
			[...selectedPattern].every((index) => targetPattern.has(index));

		if (isCorrect) {
			const nextCorrectInLevel = correctInLevel + 1;
			const shouldGrow = nextCorrectInLevel === 2;
			const nextGridSize = shouldGrow ? gridSize + 1 : gridSize;

			setPhase("success");
			window.setTimeout(() => {
				setTargetPattern(
					createPattern(nextGridSize, patternSizeForGrid(nextGridSize)),
				);
				setGridSize(nextGridSize);
				setCorrectInLevel(shouldGrow ? 0 : nextCorrectInLevel);
				setSelectedPattern(new Set());
				setRound((current) => current + 1);
				setPhase("showing");
			}, 900);
		} else {
			setPhase("error");
			window.setTimeout(resetGame, 1500);
		}
	}

	function resetGame() {
		setTargetPattern(
			createPattern(initialGridSize, initialPatternSize, targetPattern),
		);
		setGridSize(initialGridSize);
		setCorrectInLevel(0);
		setSelectedPattern(new Set());
		setPhase("showing");
		setRound(1);
		setPatternId((current) => current + 1);
	}

	function resetPattern() {
		if (phase === "success") return;

		setTargetPattern(
			createPattern(gridSize, patternSizeForGrid(gridSize), targetPattern),
		);
		setSelectedPattern(new Set());
		setPhase("showing");
		setRound((current) => current + 1);
		setPatternId((current) => current + 1);
	}

	function changeDifficulty(nextDifficulty: Difficulty) {
		if (phase === "success" || nextDifficulty === difficulty) return;

		setDifficulty(nextDifficulty);
		setTargetPattern(
			createPattern(gridSize, patternSizeForGrid(gridSize), targetPattern),
		);
		setSelectedPattern(new Set());
		setPhase("showing");
		setRound((current) => current + 1);
		setPatternId((current) => current + 1);
	}

	const status = {
		showing: "Memorize the pattern",
		playing: "Select the matching tiles",
		success: "Correct. Next pattern loading...",
		error: "Not quite. The highlighted tiles show the answer.",
	}[phase];
	const level = gridSize - initialGridSize + 1;

	return (
		<div className="memory-game">
			<div className="memory-topbar">
				<Link className="memory-back" href="/games">
					← All games
				</Link>
			</div>
			<div className="memory-header">
				<div>
					<p className="memory-kicker">
						Level {level} · Round {round}
					</p>
					<h1>Pattern recall</h1>
					<p className="memory-progress">
						Grid {gridSize} x {gridSize} · {correctInLevel}/2 correct to grow
					</p>
				</div>
				<p className={`memory-status ${phase}`}>{status}</p>
			</div>

			<div className="memory-difficulty" aria-label="Difficulty">
				<p>Pattern reveal time</p>
				<div className="memory-difficulty-options">
					{Object.entries(revealDurations).map(([name, duration]) => {
						const option = name as Difficulty;

						return (
							<button
								key={option}
								className={`memory-difficulty-button${difficulty === option ? " selected" : ""}`}
								type="button"
								disabled={phase === "success"}
								aria-pressed={difficulty === option}
								onClick={() => changeDifficulty(option)}
							>
								{option[0].toUpperCase() + option.slice(1)} · {duration / 1000}s
							</button>
						);
					})}
				</div>
			</div>

			<div
				className="memory-grid"
				style={{ "--grid-size": gridSize } as CSSProperties}
				aria-label={`${gridSize} by ${gridSize} memory pattern grid`}
			>
				{Array.from({ length: gridSize * gridSize }, (_, index) => {
					const isTargetVisible =
						phase === "showing" && targetPattern.has(index);
					const isSelected = selectedPattern.has(index);
					const isCorrectAnswer =
						(phase === "error" || phase === "success") &&
						targetPattern.has(index);
					const isWrongSelection =
						phase === "error" && isSelected && !targetPattern.has(index);
					const tileState =
						phase === "success" && isCorrectAnswer
							? " success-tile"
							: isCorrectAnswer
								? " correct-tile"
								: isWrongSelection
									? " wrong-tile"
									: isTargetVisible || isSelected
										? " active"
										: "";

					return (
						<button
							key={index}
							className={`memory-tile${tileState}`}
							aria-label={`Tile ${index + 1}${isSelected ? ", selected" : ""}`}
							aria-pressed={isSelected}
							disabled={phase !== "playing"}
							onClick={() => toggleTile(index)}
						/>
					);
				})}
			</div>

			<div className="memory-actions">
				<button
					className="memory-button secondary"
					disabled={phase === "success"}
					onClick={resetPattern}
				>
					Reset pattern
				</button>
				<button
					className="memory-button secondary"
					disabled={phase !== "playing" || selectedPattern.size === 0}
					onClick={() => setSelectedPattern(new Set())}
				>
					Clear
				</button>
				<button
					className="memory-button primary"
					disabled={phase !== "playing" || selectedPattern.size === 0}
					onClick={submitPattern}
				>
					Submit pattern
				</button>
			</div>
		</div>
	);
}
