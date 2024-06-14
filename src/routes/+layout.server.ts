import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { SPOTIFY_BASE_URL } from '$env/static/private';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	const accessToken = cookies.get('access_token') || null;

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

	if (userRes.ok) {
		const userData: SpotifyApi.CurrentUsersProfileResponse = await userRes.json();

		return {
			user: userData
		};
	}

	return {
		user: null
	};
};
