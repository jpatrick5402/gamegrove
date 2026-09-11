export default function Home() {
	return (
		<div className="home-page">
			<div>
				<p className="eyebrow">A tiny arcade for big breaks</p>
				<h1>Make room for play.</h1>
				<p className="home-copy">
					GameGrove is a growing collection of quick games made for the gap
					between one task and the next.
				</p>
				<a className="home-cta" href="/games">
					Browse the catalogue
				</a>
			</div>
			<p className="home-note">
				No accounts. No leaderboards. Just a few minutes of attention pointed
				somewhere more interesting.
			</p>
		</div>
	);
}
