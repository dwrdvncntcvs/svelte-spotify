import { SPOTIFY_APP_CLIENT_ID } from '$env/static/private';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, fetch }) => {
	const refreshToken = cookies.get('refresh_token') || null;

	if (!refreshToken) {
		throw error(400, 'Invalid Refresh Token!');
	}

	const rtResponse = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken || '',
			client_id: SPOTIFY_APP_CLIENT_ID
		})
	});

	const data = await rtResponse.json();

	if (data.error) {
		cookies.delete('refresh_token', { path: '/' });
		cookies.delete('access_token', { path: '/' });
		throw error(401, data.error_description);
	}

	cookies.set('access_token', data.access_token, { path: '/' });
	cookies.set('refresh_token', data.refresh_token, { path: '/' });

	return json(data);
};
