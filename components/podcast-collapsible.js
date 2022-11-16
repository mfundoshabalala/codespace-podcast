// @ts-ignore
import { html, LitElement, css, map } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { store, connect } from '../store.js';

class Component extends LitElement {
	static get properties () {
		return {
			season: { state: true },
		};
	};

	constructor () {
		super();
		this.disconnectStore = connect((state) => {
			//
			if (this.season?.toString() === state.season?.toString()) return;
			this.season = state.season;
			//
			if (this.single === state.single) return;
			this.single = state.single;
		});

	};

	disconnectedCallback () { this.disconnectStore(); }

	static styles = css`
		h2 {
			text-align: center;
		}

		article {
			display: flex;
			flex-direction: column;
			box-shadow: 0 0 2px #999;
			width: 45ch;
			padding: 1.5rem;
			border-radius: 0.25rem;
		}

		section {
			width: fit-content;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			gap: 1rem;
			margin: 0 auto;
			padding: 1rem 4rem;
		}

		div {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;
		}

		h3 {
			margin: 0;
		}

		p {
			flex: 1;
			font-weight: 200;
			padding: 0 0.5rem;
		}

		audio {
			width: 100%;
		}
	`;

	render () {
		//
		let episodes = this.single.seasons.filter((/** @type {{ season: string | number; }} */ season) => {
			return +season.season === +this.season;
		}).map(({ episodes, season }) => {
			return html`
					<h2>Season ${ season } - ${episodes.length} episodes</h2>
					<section>${ episodes.map((episode) => {
						return html`
							<article>
								<div>
									<span>Episode ${ episode.episode }</span>
									<h3>${ episode.title }</h3>
								</div>
								<p class="line-clamp">${ episode.description }</p>
								<audio controls preload="metadata">
									<source src="${ episode.file }" type="audio/mp3">
								</audio>
							</article>
						`;
				}) }</section>
			`;
		});

		return html`
			<div>${ episodes }</div>
        `;
	};
}

// @ts-ignore
customElements.define('podcast-collapsible', Component);
