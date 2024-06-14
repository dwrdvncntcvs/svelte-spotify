import { BASE_URL, SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from '$env/static/private';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
	const searchParams = url.searchParams;

	const verifier = cookies.get('s_verifier') || null;
	const storedState = cookies.get('s_state') || null;

	const code = searchParams.get('code') || null;
	const state = searchParams.get('state') || null;

	if (state === null || state !== storedState) {
		throw error(400, 'State mismatched');
	}

	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(`${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`).toString('base64')}`
		},
		body: new URLSearchParams({
			code: code || '',
			redirect_uri: `${BASE_URL}/api/auth/callback`,
			grant_type: 'authorization_code',
			code_verifier: verifier || '',
			client_id: SPOTIFY_APP_CLIENT_ID
		})
	});

	// console.log('Response: ', await res.json());
	const responseJson = await res.json();

	if (responseJson.error) {
		throw error(400, responseJson.error_description);
	}

	cookies.set('refresh_token', responseJson.refresh_token, { path: '/' });
	cookies.set('access_token', responseJson.access_token, { path: '/' });

	cookies.delete('s_state', { path: '/' });
	cookies.delete('s_verifier', { path: '/' });

	throw redirect(303, '/');
};
