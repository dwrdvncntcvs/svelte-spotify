import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, params, depends, route }) => {
	depends(`app:${route.id}`);
	const { user } = await parent();
	const query = params.query;

	const res = await fetchRefresh(
		fetch,
		`/api/spotify/search?${new URLSearchParams({
			type: 'album,artist,playlist,track',
			q: query || '',
			market: user?.country || '',
			limit: '6'
		})}`
	);

	if (!res.ok) throw error(res.status, 'Failed to load search results');

	const data = await res.json();

	return {
		searchResult: data as SpotifyApi.SearchResponse,
		title: `Search Results for "${query}"`
	};
};
