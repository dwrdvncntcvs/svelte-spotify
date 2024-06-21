import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch: _fetch, url, route, depends }) => {
	depends(`app:${route.id}`);
	const fetch = (path: string) => fetchRefresh(_fetch, path);

	const { list, rest } = params;

	const limit = 18;
	const page = url.searchParams.get('page');

	const search = new URLSearchParams({
		limit: `${limit}`,
		offset: page ? `${(Number(page) - 1) * limit}` : '0'
	}).toString();

	let request;
	let title;

	if (list === 'section' && rest === 'new-releases') {
		request = fetch(`/api/spotify/browse/new-releases?${search}`);
		title = 'New Releases';
	} else if (list === 'section' && rest === 'featured-playlists') {
		request = fetch(`/api/spotify/browse/featured-playlists?${search}`);
		title = 'Featured Playlists';
	}

	if (!request) {
		throw error(404, 'Page Not Found');
	}

	const res = await request;

	if (!res.ok) throw error(res.status, 'Failed to Load Data');

	const data: SpotifyApi.ListOfNewReleasesResponse | SpotifyApi.ListOfFeaturedPlaylistsResponse =
		await res.json();

	const getData = () => {
		if ('playlists' in data) return data.playlists;
		if ('albums' in data) return data.albums;
		else return {};
	};

	return {
		data: getData(),
		title
	};
};
