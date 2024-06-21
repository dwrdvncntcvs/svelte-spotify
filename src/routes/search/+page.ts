import { fetchRefresh } from '$helpers';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const categoriesRes = await fetchRefresh(fetch, '/api/spotify/browse/categories?limit=50');

	return {
		title: 'Search',
		categories: categoriesRes.ok
			? ((await categoriesRes.json()) as SpotifyApi.MultipleCategoriesResponse)
			: undefined
	};
};
