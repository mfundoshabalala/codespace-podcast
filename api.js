export const getAllPodcastShows = async () => {
	let data;
	let error;
	let status;

	fetch('https://podcast-api.netlify.app/shows', { cache: "force-cache" })
		.then((res) => {
			data = res.json();
			status = res.status;
		}).catch((err) => {
			error = err;
		});

	return { data, error, status };
};


export const getSinglePodcastShow = (/** @type {string} */ id) => {
	let data;
	let error;
	let status;

	fetch(`https://podcast-api.netlify.app/id/${ id }`, { cache: "force-cache" })
		.then((res) => {
			data = res.json();
			status = res.status;
		}).catch((err) => {
			error = err;
		});

	return { data, error, status };
 };