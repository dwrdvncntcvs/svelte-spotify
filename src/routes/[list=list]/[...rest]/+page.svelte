<script lang="ts">
	import { endpoint } from '$helpers';
	import { Card, Pagination } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import { toasts } from '$store';

	export let data;

	$: items = data?.data;

	let isLoading = false;

	const onLoadMoreItems = async () => {
		if (items && 'next' in items && items.next) {
			isLoading = true;

			const res = await fetch(endpoint.spotifyApiUrl(items.next));

			if (res.ok) {
				const _data = await res.json();
				const newData = _data.albums || _data.playlists || _data.artists || _data;
				items = { ...newData, items: [...items.items, ...newData.items] };
			} else {
				toasts.error('Could not load more data');
			}

			isLoading = false;
		}
	};
</script>

<div class="content">
	<h1>{data.title}</h1>
	{#if items?.items}
		<div class="grid-items">
			{#each items.items as item}
				<div class="grid-item">
					<Card {item} />
				</div>
			{/each}
		</div>

		{#if data && 'next' in items && items.next}
			<Pagination paginatedList={items} on:loadMore={onLoadMoreItems} {isLoading} />
		{/if}
	{/if}
</div>

<style lang="scss">
	.grid-items {
		margin-bottom: 40px;
	}

	.content {
		padding-bottom: 60px;
	}
</style>
