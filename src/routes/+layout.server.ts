import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { SPOTIFY_BASE_URL } from '$env/static/private';

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
	const accessToken = cookies.get('access_token') || null;
	const refreshToken = cookies.get('refresh_token') || null;

	if (!accessToken) {
		return {
			user: null
		};
	}

	const userRes = await fetch(`${SPOTIFY_BASE_URL}/me`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (userRes.status === 401 && refreshToken) {
		const rtResponse = await fetch('/api/auth/refresh');

		if (rtResponse.ok) {
			throw redirect(307, url.pathname);
		}

		return {
			user: null
		};
	}

	if (userRes.ok) {
		const userData: SpotifyApi.CurrentUsersProfileResponse = await userRes.json();
		let userAllPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];

		const userPlaylistsRes = await fetch('/api/spotify/me/playlists?limit=50');

		if (userPlaylistsRes.ok) {
			const userPlaylistsData: SpotifyApi.ListOfCurrentUsersPlaylistsResponse =
				await userPlaylistsRes.json();

			userAllPlaylists = userPlaylistsData.items;
		}

		return {
			user: userData,
			userAllPlaylists
		};
	}

	return {
		user: null
	};
};
