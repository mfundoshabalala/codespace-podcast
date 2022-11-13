/**
 *
 * @type { (podcastId: string) => Promise<import("../types").show | undefined> } podcast
*/
const getSingleShow = async (podcastId) => {
	try {
		const response = await fetch(`https://podcast-api.netlify.app/id/${podcastId}`);
		const podcast = await response.json();
		return podcast;
	} catch (error) {
		console.error(error.message);
	}
};

export default getSingleShow;