import { SPOTIFY_BASE_URL } from '$env/static/private';
import { validate } from '$helpers';
import type { DataObj } from '$helpers/validator';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ cookies, fetch, request, url, params }) => {
		const data = await request.formData();

		const name = data.get('name');
		const description = data.get('description');

		console.log('Name: ', name);

		const validatedData = validate.requiredFields(
			{ name: 'Playlist name is required' },
			{ name, description }
		);

		if (validatedData.hasError) {
			return fail(400, validatedData);
		}

		const res = await fetch(`${SPOTIFY_BASE_URL}/playlists/${params.id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`
			},
			body: JSON.stringify({ name, description })
		});

		if (!res.ok) {
			const errorJson = await res.json();
			return fail(res.status, {
				name: {
					value: name
				},
				description: {
					value: description
				},
				apiError: errorJson?.error?.message ?? 'An error has occurred',
				editForm: true
			});
		} else {
			if (url.searchParams.has('redirect')) throw redirect(303, `/playlist/${params.id}`);
		}
	}
};
