/**
 * typedef {object} podcasts
 * property {string} id
 * property {string} title
 * property {number} seasons
 * property {string} image
 * property {string[]} genres
 * property {string} updated
 */

const podcastsList = document.querySelector("#podcasts");
console.log(podcastsList);

const getPodcastsData = async () => {
	/**
	 * type {podcasts[]}
	 */
	try {
		const response = await fetch('https://podcast-api.netlify.app/shows');
		const podcasts = await response.json();
		return podcasts;
	} catch (error) {
		console.error(error.message);
	}
}

const getShowsData = async () => {
	/**
	 * type {podcasts[]}
	 */
	const podcasts = await getPodcastsData();

	let newList = "";

	for (const { id, title, seasons } of podcasts) {
		newList = `
			${ newList }
			<li>
				${ title }
			</li>
		`;
	}

	if (podcasts.length === 0 && podcastsList !== null) {
		podcastsList.innerHTML = "Loading...";
	}

	if (podcasts.length !== 0 && podcastsList !== null) {
		podcastsList.innerHTML = newList;
	}
};

getShowsData();