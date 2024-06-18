import type { PageLoad } from './$types';
import { fetchRefresh } from '$helpers';

export const load: PageLoad = async ({ fetch: _fetch, parent }) => {
	const dataLimit = 6;
	const { user } = await parent();

	const fetch = (path: string) => fetchRefresh(_fetch, path);

	const newReleases = fetch(`/api/spotify/browse/new-releases?limit=${dataLimit}`);
	const featuredPlaylist = fetch(`/api/spotify/browse/featured-playlists?limit=${dataLimit}`);
	const userPlaylist = fetch(`/api/spotify/users/${user?.id}/playlists?limit=${dataLimit}`);

	const categoriesRes = await fetch('/api/spotify/browse/categories');

	const categoriesData: SpotifyApi.MultipleCategoriesResponse | undefined = categoriesRes.ok
		? await categoriesRes.json()
		: undefined;

	const randomCategories = categoriesData
		? categoriesData.categories.items.sort(() => 0.5 - Math.random()).slice(0, 3)
		: [];

	const randomCategoriesPromises = randomCategories.map((val) =>
		fetch(`/api/spotify/browse/categories/${val.id}/playlists?limit=${dataLimit}`)
	);

	const [newReleasesRes, featuredPlaylistRes, userPlaylistRes, ...randomCategoriesRes] =
		await Promise.all([newReleases, featuredPlaylist, userPlaylist, ...randomCategoriesPromises]);

	console.log(randomCategoriesRes);

	return {
		newReleases: newReleasesRes.ok
			? (newReleasesRes.json() as Promise<SpotifyApi.ListOfNewReleasesResponse>)
			: undefined,
		featuredPlaylist: featuredPlaylistRes.ok
			? (featuredPlaylistRes.json() as Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse>)
			: undefined,
		userPlaylist: userPlaylistRes.ok
			? (userPlaylistRes.json() as Promise<SpotifyApi.ListOfUsersPlaylistsResponse>)
			: undefined,
		homeCategories: randomCategories,
		categoriesPlaylists: Promise.all(
			randomCategoriesRes.map((val) =>
				val.ok ? (val.json() as Promise<SpotifyApi.CategoryPlaylistsResponse>) : undefined
			)
		)
	};
};
