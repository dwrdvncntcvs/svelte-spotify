<script lang="ts">
	import { Button, Card, ItemPage, TrackList } from '$lib';

	export let data;

	$: artist = data.artist;
	$: albums = data.albums;
	$: topTracks = data.topTracks;
	$: relatedArtists = data.relatedArtists;
	$: appearsOn = data.appearsOn;
</script>

<div id="artist-page">
	<ItemPage
		color={data.color}
		title={data.title}
		image={artist.images && artist?.images?.length > 0 ? artist.images[0].url : undefined}
		type="artist"
	>
		<span slot="meta" class="following-count">
			{Intl.NumberFormat('en', { notation: 'compact' }).format(artist.followers.total)} Followers
		</span>
		{#if topTracks}
			<div class="content-row">
				<h2 class="section-title">Top Tracks</h2>
				<TrackList
					tracks={topTracks?.tracks || []}
					userPlaylist={data.userAllPlaylists?.filter((pl) => pl.owner.id === data.user?.id)}
				/>
			</div>
		{/if}
		{#if albums}
			<div class="content-row">
				<div class="content-header">
					<h2 class="section-title">Album</h2>
					<Button element="a" variant="outline">View All</Button>
				</div>
				<div class="grid-items">
					{#each albums.items as album}
						<Card item={album} />
					{/each}
				</div>
			</div>
		{/if}
		{#if appearsOn}
			<div class="content-row">
				<div class="content-header">
					<h2 class="section-title">Appears On</h2>
					<Button element="a" variant="outline">View All</Button>
				</div>
				<div class="grid-items">
					{#each appearsOn.items as album}
						<Card item={album} />
					{/each}
				</div>
			</div>
		{/if}
		{#if relatedArtists}
			<div class="content-row">
				<div class="content-header">
					<h2 class="section-title">Related Artists</h2>
					<Button element="a" variant="outline">View All</Button>
				</div>
				<div class="grid-items">
					{#each relatedArtists.artists.splice(0, 6) as artist}
						<Card item={artist} />
					{/each}
				</div>
			</div>
		{/if}
	</ItemPage>
</div>

<style lang="scss">
	.following-count {
		font-size: functions.toRem(14);
		color: var(--light-gray);
	}

	.content-row {
		margin-bottom: 40px;
		.content-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;

			.section-title {
				font-size: functions.toRem(22);
				font-weight: 600;
				margin: 0;
			}
		}
	}
</style>
