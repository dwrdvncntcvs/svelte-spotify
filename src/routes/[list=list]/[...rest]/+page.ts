import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch: _fetch, url, route, depends }) => {
	depends(`app:${route.id}`);
	const fetch = (path: string) => fetchRefresh(_fetch, path);

	const { list, rest } = params;

	const limit = 18;
	const page = url.searchParams.get('page');

	const search = new URLSearchParams({
		limit: `${limit}`,
		offset: page ? `${(Number(page) - 1) * limit}` : '0'
	}).toString();

	let request;
	let title;

	if (list === 'section' && rest === 'new-releases') {
		request = fetch(`/api/spotify/browse/new-releases?${search}`);
		title = 'New Releases';
	} else if (list === 'section' && rest === 'featured-playlists') {
		request = fetch(`/api/spotify/browse/featured-playlists?${search}`);
		title = 'Featured Playlists';
	} else if (list === 'category') {
		request = fetch(`/api/spotify/browse/categories/${rest}/playlists ?${search}`);
		const categoryInfoReq = await fetch(`/api/spotify/browse/categories/${rest}`);
		const categoryInfoData: SpotifyApi.CategoryObject = categoryInfoReq.ok
			? await categoryInfoReq.json()
			: undefined;
		title = categoryInfoData ? `${categoryInfoData.name} Playlists` : 'Playlists';
	} else if (list === 'profile' || list === 'following') {
		request = await fetch(`/api/spotify/me/following?type=artist&${search}`);
		title = 'Following';
	} else if (list === 'artist') {
		const artistID = rest.split('/')[0];
		const dataType = rest.split('/')[1];
		if (!artistID || !['albums', 'appears-on', 'related-artists'].includes(dataType)) {
			throw error(404, { message: 'Page not found!' });
		}
		const artistInfo = await fetch(`/api/spotify/artists/${artistID}`);
		const artistInfoJSON: SpotifyApi.SingleArtistResponse = artistInfo.ok
			? await artistInfo.json()
			: undefined;

		if (dataType === 'albums') {
			request = fetch(
				`/api/spotify/artists/${artistID}/albums?include_groups=album,single&${search}`
			);
			title = artistInfoJSON ? `${artistInfoJSON.name} Albums` : 'Albums';
		}
		if (dataType === 'appears-on') {
			request = fetch(
				`/api/spotify/artists/${artistID}/albums?include_groups=appears_on&${search}`
			);
			title = artistInfoJSON ? `${artistInfoJSON.name} Appearances` : 'Appearances';
		}
		if (dataType === 'related-artists') {
			request = fetch(`/api/spotify/artists/${artistID}/related-artists`);
			title = artistInfoJSON ? `Related to ${artistInfoJSON.name}` : 'Related Artists';
		}
	}

	if (!request) {
		throw error(404, 'Page Not Found');
	}

	const res = await request;

	if (!res.ok) throw error(res.status, 'Failed to Load Data');

	const data:
		| SpotifyApi.ListOfNewReleasesResponse
		| SpotifyApi.ListOfFeaturedPlaylistsResponse
		| SpotifyApi.CategoryPlaylistsResponse
		| SpotifyApi.UsersFollowedArtistsResponse
		| SpotifyApi.ArtistsAlbumsResponse
		| SpotifyApi.ArtistsRelatedArtistsResponse = await res.json();

	const getData = () => {
		if ('playlists' in data) return data.playlists;
		if ('albums' in data) return data.albums;
		if ('artists' in data) {
			if ('items' in data.artists) {
				return data.artists;
			} else {
				return { items: data.artists };
			}
		}
		if ('items' in data) return data;
	};

	return {
		data: getData(),
		title
	};
};
