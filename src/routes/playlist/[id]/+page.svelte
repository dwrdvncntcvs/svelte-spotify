<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Button, ItemPage, TrackList } from '$lib';
	import { Heart } from 'lucide-svelte';

	export let data;
	export let form;

	$: playlist = data.playlist;
	$: type = playlist.type;
	$: title = data.title;
	$: color = data.color;
	$: image = playlist?.images?.length > 0 ? playlist.images[0].url : undefined;
	$: tracks = playlist.tracks;
	$: currentPage = $page.url.searchParams.get('page') || 1;
	$: isFollowing = data.isFollowing;

	let isLoading = false;
	let isLoadingFollowAction = false;
	let followButton: Button<'button'>;

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

	<div class="playlist-actions">
		{#if data?.user?.id === playlist.owner.id}
			<Button element="a" variant="outline">Edit PLaylist</Button>
		{:else if isFollowing !== null}
			<form
				use:enhance={() => {
					isLoadingFollowAction = true;
					return async ({ result }) => {
						isLoadingFollowAction = false;
						await applyAction(result);
						followButton.focus();
						if (result.type === 'success') {
							isFollowing = !isFollowing;
						}
					};
				}}
				method="POST"
				action={`?/${isFollowing ? 'unfollowPlaylist' : 'followPlaylist'}`}
				class="follow-form"
			>
				<Button
					bind:this={followButton}
					element="button"
					type="submit"
					variant="outline"
					disabled={isLoadingFollowAction}
				>
					<Heart aria-hidden focusable="false" fill={isFollowing ? 'var(--text-color)' : 'none'} />
					{isFollowing ? 'Unfollow' : 'Follow'}
					<span class="visually-hidden">{playlist.name} playlist</span>
				</Button>
				{#if form?.followError}
					<p class="error">
						{form.followError}
					</p>
				{/if}
			</form>
		{/if}
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
		<div class="pagination">
			<div class="previous">
				{#if tracks.previous}
					<Button
						element="a"
						variant="outline"
						href="{$page.url.pathname}?{new URLSearchParams({
							page: `${Number(currentPage) - 1}`
						}).toString()}"
					>
						Previous Page
					</Button>
				{/if}
			</div>
			<div class="next">
				{#if tracks.next}
					<Button
						element="a"
						variant="outline"
						href="{$page.url.pathname}?{new URLSearchParams({
							page: `${Number(currentPage) + 1}`
						}).toString()}"
					>
						Next Page
					</Button>
				{/if}
			</div>
		</div>
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

		:global(html.no-js) & {
			display: none;
		}
	}

	.pagination {
		display: none;
		justify-content: space-between;
		align-items: center;
		margin-top: 40px;
		:global(html.no-js) & {
			display: flex;
		}
	}

	.playlist-actions {
		display: flex;
		justify-content: flex-end;
		margin: 10px 0 30px;

		.follow-form {
			:global(.button) {
				display: flex;
				align-items: center;

				:global(svg) {
					margin-right: 10px;
					width: 22px;
					height: 22px;
				}
			}

			p.error {
				text-align: right;
				color: var(--error);
				font-size: functions.toRem(14);
			}
		}
	}
</style>
