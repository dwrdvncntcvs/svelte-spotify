import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ data, url }) => {
	if (data.user && url.pathname === '/login') {
		throw redirect(307, '/');
	}

	if (!data.user && url.pathname === '/') {
		throw redirect(307, '/login');
	}

	return data;
};
