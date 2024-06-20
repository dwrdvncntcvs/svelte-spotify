export const spotifyApiUrl = (next: string) => {
	return next.replace('https://api.spotify.com/v1/', '/api/spotify/');
};

export default {
	spotifyApiUrl
};
