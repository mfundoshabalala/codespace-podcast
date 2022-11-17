// @ts-ignore
import { html, LitElement, css, map } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { store, connect } from '../store.js';

const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];


class Component extends LitElement {
    static get properties () {
        return {
            previews: { state: true },
            sorting: { state: true },
            search: { state: true },
        };
    };

    static styles = css`
        h1 {
            text-align: center;
        }

        a {
            box-shadow: 0 0 3px #999;
            padding: 0.5rem 2rem;
            border-radius: 0.25rem;
            cursor: pointer;
            transition: 250ms all cubic-bezier(0.86, 0, 0.07, 1)
        }

        img {
            max-width: 100%;
        }

        h2 {
            text-align: center;
            margin: 0;
            padding: 1rem 0;
        }

        ul {
            padding: 0 0.25rem;
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            list-style-type: none;
            justify-content: center;
        }

        li.card {
            display: flex;
            flex-direction: column;
            width: 325px;
            box-shadow: 0px 0px 3px #999;
            border-radius: 0.25rem;
            overflow-x: hidden;
            cursor: pointer;
        }

        main {
            flex: 1;
        }

        main ul {
            display: flex;
            gap: 0.25rem 1rem;
            align-items: flex-end;
        }

        main li {
            background-color: #2a2a2a;
            box-shadow: 0px 0px 3px #999;
            border: none;
            border-radius: 0.25rem;
            color: white;
            font-size: 0.75rem;
            padding: 0.25rem 1rem;
        }

        footer {
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-size: 0.765rem;
            padding: 1rem;
        }

        footer span {
            box-shadow: 0 0 1px #999;
            border-radius: 0.25rem;
            padding: 0.25rem 0.5rem;
            background-color: #ddd;
        }

        i.fa {
            font-size: 1.1rem;
        }
    `;

    constructor () {
        super();

        this.disconnectStore = connect((state) => {
            if (this.previews !== state.previews) { this.previews = state.previews; }
            if (this.sorting !== state.sorting) { this.sorting = state.sorting; }
            if (this.search !== state.search) { this.search = state.search; }
        });
    }

    disconnectedCallback () { this.disconnectStore(); }

    render () {
        /**
         * @type {import('../types').preview[]}
         */
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

        const list = sortedPreviews.map(({ title, id, updated, image, genres, seasons }) => {
            const date = new Date(updated);
            const day = date.getDate();
            const month = MONTHS[date.getMonth() - 1];
            const year = date.getFullYear();
            //
            const loadSingleHandler = () => store.loadSingle(id);

            return html`
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" />
                <li data-show-id="${ id }" @click="${ loadSingleHandler }" class="card">
                    <header>
                        <img src="${ image }" alt="${ title }" />
                    </header>
                    <main>
                        <h2>${ title }</h2>
                        <ul>
                            ${ map(genres, (genre) => genre !== 'All' ? html`<li>${ genre }</li>` : null) }
                        </ul>
                    </main>
                    <footer>
                        <span>
                            ${ seasons } Seasons
                        </span>
                        <span>
                            Last update: <time datetime="${ updated }">${ day } ${ month } ${ year }</time>
                        </span>
                        <i class="fa fa-heart"></i>
                    </footer>
                </li>
            `;
        });

        const favoritesHandler = async () => await store.loadFavorites();

        return html`
            <a @click="${ favoritesHandler }">Go to favorites ❤️</a>
            <header>
                <h1>Podcast List</h1>
            </header>
            <podcast-controls></podcast-controls>
            ${ list.length > 0 ? html`<ul>${ list }</ul>` : html`<div>No matches</div>` }
        `;
    }
}

// @ts-ignore
customElements.define('podcast-view-list', Component);
