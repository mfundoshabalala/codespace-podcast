// @ts-ignore
import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'
import { store } from '../store.js'

class Component extends LitElement {
    static get properties() {
        return {
            phase: { state: true },
        };
    };

    constructor() {
        super();
        const state = store.subscribe(this.storeChange);
        this.storeChange(state);
    };

    /**
     * @param {import('../types').state} state
     */
    storeChange = (state) => {
        if (this.phase === state.phase) return
        this.phase = state.phase
    }

    disconnectedCallback() { store.unsubscribe(this.storeChange) }

    render() {
        // const loadSingleHandler = () => store.loadSingle('10182')
        // const loadListHandler = () => store.loadList()

        if (this.phase === 'loading') {
            return html`<podcast-loader></podcast-loader>`
        }

        if (this.phase === 'error') {
            return html`<div>Something went wrong!</div>`
        }

        if (this.phase === 'list') {
            return html`
                <div>
                    <podcast-view-list></podcast-view-list>
                </div>
            `
        }

        if (this.phase === 'single') {
            return html`
                <div>
                    <podcast-view-single></podcast-view-single>
                </div>
            `
        }

        if (this.phase === 'favorite') {
            return html`
                <div>
                    <podcast-view-favorites></podcast-view-favorites>
                </div>
            `
        }

        throw new Error('Invalid view active')
    }
}

// @ts-ignore
customElements.define('podcast-app', Component)