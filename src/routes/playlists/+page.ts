import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch: _fetch, url }) => {
	const limit = 18;
	const page = url.searchParams.get('page');

	const searchParams = new URLSearchParams({
		limit: `${limit}`,
		offset: page ? `${(+page - 1) * limit}` : '0'
	}).toString();

	const playlistsRes = await fetchRefresh(_fetch, `/api/spotify/me/playlists?${searchParams}`);

	if (!playlistsRes.ok) throw error(playlistsRes.status, 'Failed to load playlists');

	const data: SpotifyApi.ListOfCurrentUsersPlaylistsResponse = await playlistsRes.json();

	return {
		userPlaylist: data,
		title: 'Your Playlists'
	};
};
