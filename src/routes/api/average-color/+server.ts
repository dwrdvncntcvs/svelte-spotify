import { json, type RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const imageUrl = url.searchParams.get('image');

	if (!imageUrl) {
		return json({ color: null }, { status: 200 });
	}

	const image = await fetch(imageUrl).then((res) => res.arrayBuffer());

	const _sharp = sharp(Buffer.from(image));
	const stats = await _sharp.stats();

	const [r, g, b] = stats.channels.map(({ mean }) => mean);

	return json({ color: `rgb(${r}, ${g}, ${b})` }, { status: 200 });
};
