import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const { id } = params;

	const albumRes = await fetchRefresh(fetch, `/api/spotify/albums/${id}`);

	if (!albumRes.ok) throw error(albumRes.status, 'Loading album unsuccessful');

	const data: SpotifyApi.SingleAlbumResponse = await albumRes.json();

	return {
		album: data,
		title: data.name
	};
};
