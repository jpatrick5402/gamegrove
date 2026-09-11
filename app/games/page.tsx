import Link from "next/link";

const games = [
	{
		number: "01",
		title: "Pattern recall",
		description: "Study a pattern, then rebuild it from memory.",
		href: "/games/memory",
	},
	{
		number: "02",
		title: "Reaction window",
		description:
			"Wait for the flash, then react before your instincts cool down.",
		href: "/games/reaction",
	},
	{
		number: "03",
		title: "Digit vault",
		description:
			"Memorize a growing number and see how far your recall can go.",
		href: "/games/digits",
	},
	{
		number: "04",
		title: "Color match",
		description: "Find the swatch that matches the color on the screen.",
		href: "/games/colors",
	},
	{
		number: "05",
		title: "Higher or lower",
		description: "Call the next number and build a streak one guess at a time.",
		href: "/games/higher-lower",
	},
	{
		number: "06",
		title: "Word scramble",
		description:
			"Untangle a mixed-up word before the letters lose their shape.",
		href: "/games/scramble",
	},
];

export default function GamesCatalogue() {
	return (
		<section className="catalogue-page">
			<div className="catalogue-heading">
				<div>
					<p className="eyebrow">The catalogue</p>
					<h1>Pick a game.</h1>
				</div>
				<p>
					Short, focused games for when the workday needs a little less work.
				</p>
			</div>
			<div className="game-list">
				{games.map((game) => (
					<Link className="game-card" href={game.href} key={game.number}>
						<div>
							<span className="game-card-number">{game.number}</span>
							<h2>{game.title}</h2>
							<p>{game.description}</p>
						</div>
						<span className="game-card-action">Play now -&gt;</span>
					</Link>
				))}
			</div>
		</section>
	);
}
