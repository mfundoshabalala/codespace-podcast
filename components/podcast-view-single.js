// @ts-ignore
import { html, LitElement, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { store, connect } from '../store.js';

class Component extends LitElement {
    static get properties () {
        return {
            single: { state: true },
            season: { state: true },
        };
    };

    static styles = css`
        h1 {
            font-size: 3rem;
            margin: 0.75rem 0;
            padding: 0 2rem;
        }

        button {
            white-space: nowrap;
            padding: 0.25rem;
        }

        section {
            display: flex;
            padding: 0 1rem;
            width: 100%;
            height: 25rem;
            margin: 1rem auto;
        }

        section img {
            aspect-ratio: 4 / 3;
            max-width: 25rem;
        }

        section ul {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            gap: 0.25rem;
            list-style-type: none;
            height: 25rem;
        }

        div {
            padding: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        a {
            box-shadow: 0 0 3px #999;
            padding: 0.5rem 2rem;
            border-radius: 0.25rem;
            cursor: pointer;
            transition: 250ms all cubic-bezier(0.86, 0, 0.07, 1)
        }

        a:hover {
            color: white;
            background-color: #444;
        }

        a:active {
            background-color: #222;
        }

        section ul li {
            white-space: nowrap;
            box-shadow: 0 0 3px #999;
            padding: 0.5rem 2rem;
            border-radius: 0.25rem;
            cursor: pointer;
        }
    `;

    constructor () {
        super();
        this.disconnectStore = connect((state) => {
            if (this.single === state.single) return;
            this.single = state.single;
            if (this.season?.toString() === state.season?.toString()) return;
            this.season = state.season;
            if (this.previews !== state.previews) { this.previews = state.previews; }
            if (this.sorting !== state.sorting) { this.sorting = state.sorting; }
            if (this.search !== state.search) { this.search = state.search; }
        });
    };

    disconnectedCallback () { this.disconnectStore(); }

    render () {

        const previews = this.previews;

        const filteredPreviews = previews.filter(item => {
            if (!this.search) return true;
            return item.title.toLowerCase().includes(this.search.toLowerCase());
        });

        const sortedPreviews = filteredPreviews.sort((a, b) => {
            if (this.sorting === 'a-z') return a.title.localeCompare(b.title);
            if (this.sorting === 'z-a') return b.title.localeCompare(a.title);

            const dateA = new Date(a.updated).getTime();
            const dateB = new Date(b.updated).getTime();

            if (this.sorting === 'oldest-latest') return dateA - dateB;
            if (this.sorting === 'latest-oldest') return dateB - dateA;

            throw new Error('Invalid sorting');
        });

        /**
         * @type {import('../types').show}
         */
        const show = this.single;
        if (!show) {
            return html`<div></div>`;
        }

        const loadListHandler = async () => await store.loadList();
        const loadFavoritesHandler = async () => await store.loadFavorites();

        const handleClick = async (event) => {
            await store.renderSeason(event.target.dataset.season);
        };

        const seasonsTitle = show.seasons.map(({ season }) => {
            return html`
                <a @click="${ handleClick }" data-season="${ season }">Season ${ season }</a>
            `;
        });

        return html`
                <div>
                    <a @click="${ loadListHandler }">⬅️ Back</a>
                    <a @click="${ loadFavoritesHandler }">Go to favorites ❤️</a>
                </div>
                <h1>${ show.title }</h1>
                <section>
                    <img src="${ show.seasons[this.season].image || show.image }" loading="lazy" alt="${ show.title }">
                    <ul>${ seasonsTitle }</ul>
                </section>
                <podcast-collapsible></podcast-collapsible>
            `;
    }
}
// @ts-ignore
customElements.define('podcast-view-single', Component);