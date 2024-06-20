<script lang="ts">
	import { endpoint } from '$helpers';
	import { Button, Card, Modal, Pagination, PlaylistForm } from '$lib';
	import { error } from '@sveltejs/kit';
	import MicroModal from 'micromodal';
	import type { ActionData } from './new/$types';

	export let data;
	export let form: ActionData;

	let isLoading = false;

	$: playlists = data.userPlaylist;

	const handleLoadMore = async (e: CustomEvent) => {
		if (!playlists.next) return;
		isLoading = true;
		const url = endpoint.spotifyApiUrl(playlists.next);
		const playlistsRes = await fetch(url);
		const playlistsData: SpotifyApi.ListOfCurrentUsersPlaylistsResponse = await playlistsRes.json();
		if (playlistsRes.ok) {
			playlists = { ...playlistsData, items: [...playlists.items, ...playlistsData.items] };
		} else {
			throw error(playlistsRes.status, 'Failed to load playlists');
		}
		isLoading = false;
	};
</script>

<div class="content">
	{#if playlists.items.length > 0}
		<div class="title">
			<h1>{data.title}</h1>
			<Button
				element="a"
				href="/playlists/new"
				on:click={(e) => {
					e.preventDefault();
					MicroModal.show('add-playlist-modal');
				}}
			>
				+ Add New
			</Button>
		</div>
		<div class="grid-items">
			{#each playlists.items as playlist}
				<Card item={playlist} />
			{/each}
		</div>
		<Pagination paginatedList={playlists} on:loadMore={handleLoadMore} {isLoading} />
	{:else}
		<div class="empty">
			<p>No Playlists Yet!</p>
			<Button element="a" href="/playlists/new">+ Add New</Button>
		</div>
	{/if}
</div>

<Modal id="add-playlist-modal" title="Add a New Playlist">
	<PlaylistForm {form} userId={data.user?.id} action="/playlists/new" />
</Modal>

<style lang="scss">
	.content {
		padding-bottom: 60px;

		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10px;
		}

		.grid-items {
			margin-bottom: 40px;
		}

		.empty {
			text-align: center;
			margin-top: 40px;

			p {
				font-size: functions.toRem(22);
				font-weight: 600;
			}
		}
	}
</style>
