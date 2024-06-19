import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch, depends, route }) => {
	depends(`app:${route.id}`);
	const { id } = params;

	const albumRes = await fetchRefresh(fetch, `/api/spotify/albums/${id}`);

	if (!albumRes.ok) throw error(albumRes.status, 'Loading album unsuccessful');

	const data: SpotifyApi.SingleAlbumResponse = await albumRes.json();

	let color = null;

	if (data.images.length > 0) {
		const colorRes = await fetch(
			`/api/average-color?${new URLSearchParams({ image: data.images[0].url }).toString()}`
		);

		if (colorRes.ok) {
			color = (await colorRes.json()).color;
		}
	}

	return {
		album: data,
		title: data.name,
		color
	};
};
