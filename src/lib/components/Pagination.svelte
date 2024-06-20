<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	export let paginatedList: SpotifyApi.PagingObject<any>;
	export let isLoading: boolean;

	$: currentPage = $page.url.searchParams.get('page') || 1;

	const dispatch = createEventDispatcher<{
		loadMore: {};
	}>();

	const handleLoadMore = () => {
		dispatch('loadMore', {});
	};
</script>

{#if paginatedList.next}
	<div class="load-more">
		<Button element="button" variant="outline" disabled={isLoading} on:click={handleLoadMore}>
			Load more
			<span class="visually-hidden">Items</span>
		</Button>
	</div>
{/if}

<div class="pagination">
	<div class="previous">
		{#if paginatedList.previous}
			<Button
				element="a"
				variant="outline"
				href="{$page.url.pathname}?{new URLSearchParams({
					page: `${Number(currentPage) - 1}`
				})}">Previous</Button
			>
		{/if}
	</div>
	<div class="next">
		{#if paginatedList.next}
			<Button
				element="a"
				variant="outline"
				href="{$page.url.pathname}?{new URLSearchParams({
					page: `${Number(currentPage) + 1}`
				})}">Next</Button
			>
		{/if}
	</div>
</div>

<style lang="scss">
	.load-more {
		padding: 15px;
		text-align: center;

		:global(html.no-js) & {
			display: none;
		}
	}

	.pagination {
		display: none;

		:global(html.no-js) & {
			display: flex;
			justify-content: space-between;
			align-items: center;
            margin-top: 40px;
		}
	}
</style>
