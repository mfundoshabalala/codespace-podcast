// @ts-ignore
import { html, LitElement, css, map } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'
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
    static get properties() {
        return {
            previews: { state: true },
            sorting: { state: true },
            search: { state: true },
        };
    };

    static styles = css`
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
            gap: 0.25rem 1rem;
        }

        main li {
            font-size: 0.75rem;
            border: none;
            padding: 2px 1rem;
            border-radius: 0.25rem;
            color: white;
            box-shadow: 0px 0px 3px #999;
            background-color: #1b1a1a;
        }

        footer {
            font-size: 0.8rem;
            padding: 1rem;
            text-align: right;
            font-style: italic;
        }
    `

    constructor() {
        super()

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

        const list = sortedPreviews.map(({ title, id, updated, image, genres }) => {
            const date = new Date(updated);
            const day = date.getDate();
            const month = MONTHS[date.getMonth() - 1];
            const year = date.getFullYear();

            console.table(genres);

            const loadSingleHandler = () => store.loadSingle(id);

            return html`
                <li data-show-id="${ id }" @click="${ loadSingleHandler }" class="card">
                    <header>
                        <img src="${ image }" alt="${ title }" />
                    </header>
                    <main>
                        <h2>${ title }</h2>
                        <ul>
                            ${map(genres, (genre) => genre !== 'All' ? html`<li>${ genre }</li>` : null)}
                        </ul>
                    </main>
                    <footer>
                        Last updated in <time datetime="${updated}">${day} ${month} ${year}</time>
                    </footer>
                </li>
            `;
        });

        return html`
            <h1>Podcast List</h1>
            <podcast-controls></podcast-controls>
            ${ list.length > 0 ? html`<ul>${ list }</ul>` : html`<div>No matches</div>` }
        `;
    }

}

// @ts-ignore
customElements.define('podcast-view-list', Component);