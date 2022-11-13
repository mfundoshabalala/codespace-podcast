/**
 *
 * @type { () => Promise<import("../types").preview | undefined> } podcasts
 */
const getAllShows = async () => {
	try {
		const response = await fetch('https://podcast-api.netlify.app/shows');
		const podcasts = await response.json();
		return podcasts;
	} catch (error) {
		console.error(error.message);
	}
};

export default getAllShows;