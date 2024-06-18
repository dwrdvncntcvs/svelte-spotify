import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const dataLimit = 6;

	const newReleasesRes = await fetch(`/api/spotify/browse/new-releases?limit=${dataLimit}`);
	const featuredRes = await fetch(`/api/spotify/browse/featured-playlists?limit=${dataLimit}`);

	const newReleasesData = await newReleasesRes.json();
	const featuredData = await featuredRes.json();

	return {
		newReleases: newReleasesData,
		featuredPlaylist: featuredData
	};
};
