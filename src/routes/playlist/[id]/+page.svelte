<script lang="ts">
	import { Button, ItemPage, TrackList } from '$lib';

	export let data;

	$: playlist = data.playlist;
	$: type = playlist.type;
	$: title = data.title;
	$: color = data.color;
	$: image = playlist?.images?.length > 0 ? playlist.images[0].url : undefined;
	$: tracks = playlist.tracks;

	let isLoading = false;

	let filteredTracks: SpotifyApi.TrackObjectFull[];

	$: {
		filteredTracks = [];

		tracks.items.forEach((item) => {
			if (item.track) filteredTracks = [...filteredTracks, item.track];
		});
	}

	const followersFormat = Intl.NumberFormat('en', { notation: 'compact' });

	const loadMoreTracks = async () => {
		if (!tracks.next) return;

		isLoading = true;

		const url = tracks.next.replace('https://api.spotify.com/v1/', '/api/spotify/');
		const res = await fetch(url);
		const data = await res.json();

		if (res.ok) {
			tracks = { ...data, items: [...tracks.items, ...data.items] };
		} else {
			alert(data.error.message || 'Could not load data');
		}

		isLoading = false;
	};
</script>

<ItemPage {type} {title} {color} {image}>
	<div slot="meta">
		<p class="playlist-description">{@html playlist.description}</p>
		<p class="meta">
			<span>{playlist.owner.display_name}</span>
			<span>{followersFormat.format(playlist.followers.total)}</span>
			<span>{playlist.tracks.total} Track{playlist.tracks.total > 0 ? 's' : ''}</span>
		</p>
	</div>
	{#if playlist.tracks?.items?.length}
		<TrackList tracks={filteredTracks} />
		{#if tracks.next}
			<div class="load-more">
				<Button element="button" variant="outline" disabled={isLoading} on:click={loadMoreTracks}>
					Load More <span class="visually-hidden">Tracks</span>
				</Button>
			</div>
		{/if}
	{:else}
		<div class="empty-playlist">
			<p>No items added to this playlist yet.</p>
			<Button element="a" href="/search">Search for Content</Button>
			<Button element="a" href="/playlists">View all playlists</Button>
		</div>
	{/if}
</ItemPage>

<style lang="scss">
	.playlist-description {
		color: var(--light-gray);
		font-size: functions.toRem(18);
		margin-bottom: 0;
	}

	.meta {
		font-size: functions.toRem(13);
		margin-top: 10px;

		span {
			margin-right: 5px;

			&:first-child {
				font-weight: 600;
			}
		}
	}

	.empty-playlist {
		text-align: center;
		margin-top: 40px;

		p {
			font-size: functions.toRem(22);
			font-weight: 600;
		}

		:global(a) {
			margin: 0 10px;
		}
	}

	.load-more {
		padding: 15px;
		text-align: center;
	}
</style>
