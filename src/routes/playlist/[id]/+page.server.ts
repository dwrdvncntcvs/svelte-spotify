import { SPOTIFY_BASE_URL } from '$env/static/private';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	followPlaylist: async ({ cookies, params, fetch }) => {
		const res = await fetch(`${SPOTIFY_BASE_URL}/playlists/${params.id}/followers`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`
			}
		});

		if (!res.ok) {
			return fail(res.status, { followError: res.statusText, followForm: true });
		}
	},
	unfollowPlaylist: async ({ cookies, params, fetch }) => {
		const res = await fetch(`${SPOTIFY_BASE_URL}/playlists/${params.id}/followers`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`
			}
		});

		if (!res.ok) {
			return fail(res.status, { followError: res.statusText, followForm: true });
		}
	},
	removeTrackFromPlaylist: async ({ cookies, params, fetch, request }) => {
		const data = await request.formData();

		const track = data.get('track');
		const playlist = params.id;

		console.log(JSON.stringify({ uris: [`spotify:track:${track}`] }));

		const res = await fetch(`${SPOTIFY_BASE_URL}/playlists/${playlist}/tracks`, {
			method: 'DELETE',
			body: JSON.stringify({ tracks: [{ uri: `spotify:track:${track}` }] }),
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`
			}
		});

		if (!res.ok) {
			throw redirect(303, `/playlist/${playlist}?error=${res.status} ${res.statusText}`);
		}

		throw redirect(303, `/playlist/${playlist}?success=Track removed successfully`);
	}
};
