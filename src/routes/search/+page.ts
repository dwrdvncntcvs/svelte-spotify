import { fetchRefresh } from '$helpers';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const query = url.searchParams.get('q');
	const categoriesRes = await fetchRefresh(fetch, '/api/spotify/browse/categories?limit=50');

	if (query) {
		throw redirect(307, `/search/${query}`);
	}

	return {
		title: 'Search',
		categories: categoriesRes.ok
			? ((await categoriesRes.json()) as SpotifyApi.MultipleCategoriesResponse)
			: undefined
	};
};
