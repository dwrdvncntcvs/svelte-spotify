import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

interface ParsedParam {
	[x: string]: string;
}

export const load: PageLoad = async ({ params, fetch, depends, route, parent }) => {
	depends(`app:${route.id}`);

	const artistId = params.id;
	const { user } = await parent();

	const artistReq = await fetchRefresh(fetch, `/api/spotify/artists/${artistId}`);

	if (!artistReq.ok) throw error(artistReq.status, 'Failed to load artist');

	const artistData: SpotifyApi.SingleArtistResponse = await artistReq.json();

	const endpointTypes = [
		'albums:[include_group-single,limit-6]',
		'albums:[include_group-appears_on,limit-6]',
		`top-tracks:[market-${user?.country}]`,
		'related-artists'
	];

	let colorReq;

	if (artistData.images.length > 0) {
		colorReq = fetchRefresh(
			fetch,
			`/api/average-color?${new URLSearchParams({ image: artistData.images[0].url })}`
		);
	}

	const [albumsSingleRes, albumsAppearsOn, topTrackRes, relatedArtistsRes, colorRes] =
		await Promise.all([
			...endpointTypes.map((type) => {
				let path = `/api/spotify/artists/${artistId}`;

				if (type.includes(':')) {
					const [_type, params] = type.split(':');
					const _params = params.replace(/\[|\]/g, '');
					const parsedParams = _params
						.split(',')
						.map((param) => param.split('-'))
						.reduce((acc, curr) => {
							const [x, y] = curr;
							acc[x] = y;
							return acc;
						}, {} as ParsedParam);

					const usp = new URLSearchParams(parsedParams);

					path += `/${_type}?${usp.toString()}`;
				} else {
					path += `/${type}`;
				}

				console.log('path: ', path);

				return fetchRefresh(fetch, path);
			}),
			colorReq
		]);

	return {
		title: artistData.name,
		artist: artistData,
		albums: albumsSingleRes?.ok
			? ((await albumsSingleRes.json()) as SpotifyApi.ArtistsAlbumsResponse)
			: undefined,
		appearsOn: albumsAppearsOn?.ok
			? ((await albumsAppearsOn.json()) as SpotifyApi.ArtistsAlbumsResponse)
			: undefined,
		topTracks: topTrackRes?.ok
			? ((await topTrackRes.json()) as SpotifyApi.ArtistsTopTracksResponse)
			: undefined,
		relatedArtists: relatedArtistsRes?.ok
			? ((await relatedArtistsRes.json()) as SpotifyApi.ArtistsRelatedArtistsResponse)
			: undefined,
		color: colorRes?.ok ? (await colorRes.json()).color : undefined
	};
};
