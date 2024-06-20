<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { endpoint } from '$helpers';
	import { Button, ItemPage, Modal, Pagination, TrackList } from '$lib';
	import PlaylistForm from '$lib/components/PlaylistForm.svelte';
	import { toasts } from '$store';
	import { Heart } from 'lucide-svelte';
	import MicroModal from 'micromodal';
	import type { ActionData } from './$types.js';
	import type { ActionData as EditActionData } from './edit/$types';

	export let data;
	export let form: ActionData | EditActionData;

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

		const url = endpoint.spotifyApiUrl(tracks.next);
		const res = await fetch(url);
		const data = await res.json();

		if (res.ok) {
			tracks = { ...data, items: [...tracks.items, ...data.items] };
		} else {
			toasts.error(data.error.message);
		}

		isLoading = false;
	};
</script>

<ItemPage {type} {title} {color} {image}>
	<div slot="meta">
		<p class="playlist-description">{@html playlist.description}</p>
		<p class="meta">
			<span>{playlist.owner.display_name}</span>
			<span
				>{followersFormat.format(playlist.followers.total)} Follower{playlist.followers.total > 0
					? 's'
					: ''}</span
			>
			<span>{playlist.tracks.total} Track{playlist.tracks.total > 0 ? 's' : ''}</span>
		</p>
	</div>

	<div class="playlist-actions">
		{#if data?.user?.id === playlist.owner.id}
			<Button
				element="a"
				variant="outline"
				href="/playlist/{data.playlist.id}/edit"
				on:click={(e) => {
					e.preventDefault();
					MicroModal.show(`edit-playlist-${playlist.id}`);
				}}
			>
				Edit PLaylist
			</Button>
		{:else if isFollowing !== null}
			<form
				use:enhance={() => {
					isLoadingFollowAction = true;
					return async ({ result }) => {
						isLoadingFollowAction = false;
						if (result.type === 'success') {
							await applyAction(result);
							isFollowing = !isFollowing;
						} else if (result.type === 'failure') {
							toasts.error(result.data?.followError);
						} else {
							await applyAction(result);
						}
						followButton.focus();
						invalidateAll();
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
				{#if form && 'followForm' in form && form?.followError}
					<p class="error">
						{form.followError}
					</p>
				{/if}
			</form>
		{/if}
	</div>

	{#if playlist.tracks?.items?.length}
		<TrackList tracks={filteredTracks} />
		<Pagination paginatedList={tracks} on:loadMore={loadMoreTracks} {isLoading} />
	{:else}
		<div class="empty-playlist">
			<p>No items added to this playlist yet.</p>
			<Button element="a" href="/search">Search for Content</Button>
			<Button element="a" href="/playlists">View all playlists</Button>
		</div>
	{/if}
</ItemPage>

<Modal id="edit-playlist-{playlist.id}" title="Edit {playlist.name}">
	<PlaylistForm
		form={form && 'editForm' in form ? form : null}
		action="/playlist/{playlist.id}/edit"
		{playlist}
		on:success={async () => {
			MicroModal.close(`edit-playlist-${playlist.id}`);
			await invalidateAll();
		}}
	/>
</Modal>

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
