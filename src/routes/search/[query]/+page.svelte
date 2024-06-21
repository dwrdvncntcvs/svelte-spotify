<script lang="ts">
	import { Card } from '$lib';

	export let data;

	$: searchResults = data.searchResult;
	$: albums = searchResults.albums;
	$: artists = searchResults.artists;
	$: playlists = searchResults.playlists;
	$: tracks = searchResults.tracks;

	interface Item {
		title: string;
		items: typeof albums | typeof artists | typeof playlists | typeof tracks;
	}

	$: items = {
		albums: {
			title: 'Albums',
			items: albums && albums?.items?.length > 0 ? albums.items : undefined
		},
		artists: {
			title: 'Artists',
			items: artists && artists?.items?.length > 0 ? artists.items : undefined
		},
		playlists: {
			title: 'Playlists',
			items: playlists && playlists?.items?.length > 0 ? playlists.items : undefined
		},
		tracks: {
			title: 'Tracks',
			items: tracks && tracks?.items?.length > 0 ? tracks.items : undefined
		}
	};

	const doesExist = (data: any): boolean => data && data.items.length > 0;

	$: renderNoResult =
		!doesExist(albums) && !doesExist(artists) && !doesExist(playlists) && !doesExist(tracks);
</script>

<h2>{data.title}</h2>

{#if renderNoResult}
	<p>No Results Found!</p>
{/if}

{#each Object.keys(items) as key}
	{#if items[key].items}
		<section class="section">
			<h2>{items[key].title}</h2>
			<div class="grid-items">
				{#each items[key].items as album}
					<div class="grid-item">
						<Card item={album} />
					</div>
				{/each}
			</div>
		</section>
	{/if}
{/each}
