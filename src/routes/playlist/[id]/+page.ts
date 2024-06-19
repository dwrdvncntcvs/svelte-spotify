import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch: _fetch, params, depends, route }) => {
	depends(`app:${route.id}`);

	const fetch = (path: string) => fetchRefresh(_fetch, path);
	const playlistRes = await fetch(`/api/spotify/playlists/${params.id}`);

	if (!playlistRes.ok) throw error(playlistRes.status, 'Failed to load playlist');

	const playlistData: SpotifyApi.SinglePlaylistResponse = await playlistRes.json();
	let color: string | null = null;

	if (playlistData.images?.length > 0) {
		const colorRes = await _fetch(
			`/api/average-color?${new URLSearchParams({ image: playlistData.images[0].url }).toString()}`
		);
		const colorData = await colorRes.json();
		color = colorData.color;
	}

	return {
		color,
		playlist: playlistData,
		title: playlistData.name
	};
};
