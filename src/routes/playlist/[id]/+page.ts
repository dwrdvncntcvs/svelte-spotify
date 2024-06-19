import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch: _fetch, params, depends, route, url }) => {
	depends(`app:${route.id}`);

	const limit = 100;
	const page = url.searchParams.get('page') || '1';
	const offset = (+page - 1) * limit;

	const fetch = (path: string) => fetchRefresh(_fetch, path);
	const playlistRes = await fetch(`/api/spotify/playlists/${params.id}`);

	if (!playlistRes.ok) throw error(playlistRes.status, 'Failed to load playlist');

	const playlistData: SpotifyApi.SinglePlaylistResponse = await playlistRes.json();

	if (page && page !== '1') {
		const trackRes = await fetch(
			`/api/spotify/playlists/${params.id}/tracks?${new URLSearchParams({ limit: `${limit}`, offset: `${offset}` }).toString()}`
		);

		if (!trackRes.ok) throw error(trackRes.status, 'Failed to load playlist');

		const trackData = await trackRes.json();

		playlistData.tracks = trackData;
	}

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
