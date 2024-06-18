import { SPOTIFY_BASE_URL } from '$env/static/private';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, params, fetch, url }) => {
	const accessToken = cookies.get('access_token');

	const response = await fetch(`${SPOTIFY_BASE_URL}/${params.path}?${url.search}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	const data = await response.json();

	if (data?.error) throw error(data.error.status, data.error.message);

	return json(data, { status: response.status });
};
