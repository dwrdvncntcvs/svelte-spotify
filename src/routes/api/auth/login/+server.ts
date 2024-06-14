import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { SPOTIFY_APP_CLIENT_ID, BASE_URL } from '$env/static/private';
import pkce from 'pkce-gen';

const generateRandomStr = (length: number) => {
	let randomStr = '';
	const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

	for (let i = 0; i < length; i++) {
		randomStr += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
	}

	return randomStr;
};

const scope = `
            ugc-image-upload 
            user-read-playback-state 
            user-modify-playback-state 
            user-read-currently-playing
            user-follow-modify
            user-follow-read
            user-read-recently-played
            user-read-playback-position
            user-top-read
            playlist-read-collaborative
            playlist-modify-public
            playlist-read-private
            app-remote-control
            streaming
            user-read-email
            user-read-private
            user-library-modify
            user-library-read
            `;
const state = generateRandomStr(16);
const challenge = pkce.create();

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.set('s_state', state, { path: '/' });
	cookies.set('s_verifier', challenge.code_verifier, { path: '/' });

	const urlParams = new URLSearchParams({
		response_type: 'code',
		client_id: SPOTIFY_APP_CLIENT_ID,
		scope,
		redirect_uri: `${BASE_URL}/api/auth/callback`,
		state,
		code_challenge: challenge.code_challenge,
		code_challenge_method: 'S256'
	});

	throw redirect(303, `https://accounts.spotify.com/authorize?${urlParams.toString()}`);
};
