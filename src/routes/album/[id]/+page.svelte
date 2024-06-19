<script lang="ts">
	import { getCopyrightSymbol } from '$helpers';
	import { ItemPage, TrackList } from '$lib';

	export let data;

	$: album = data.album;
	$: color = data.color;
</script>

<ItemPage
	image={album.images.length > 0 ? album.images[0].url : undefined}
	title={album.name}
	type={album.type}
	{color}
>
	<p slot="meta" class="meta">
		<span class="artists">
			{album.artists.map((val) => val.name).join(', ')}
		</span>
		<span class="date">{new Date(album.release_date).getFullYear()}</span>
		<span class="tracks-count"
			>{`${album.total_tracks} Track${album.total_tracks > 1 ? 's' : ''}`}</span
		>
	</p>

	<TrackList tracks={album.tracks.items} />

	<div class="credits">
		<p class="date">
			{new Date(album.release_date).toLocaleDateString('en', { dateStyle: 'medium' })}
		</p>
		{#each album.copyrights as copyright, i (i)}
			<p class="copyright">{getCopyrightSymbol(copyright.type)} {copyright.text}</p>
		{/each}
	</div>
</ItemPage>

<style lang="scss">
	.meta {
		font-size: functions.toRem(13);
		font-weight: 600;

		span {
			margin-right: 5px;
			&.tracks-count {
				font-weight: 400;
				margin: 0 0 0 5px;
				color: var(--light-gray);
			}
		}
	}
	.credits {
		margin-top: 40px;
		font-size: functions.toRem(11);

		p {
			font-size: inherit;
			color: var(--light-gray);
			margin: 0;

			&.date {
				font-size: functions.toRem(13);
			}
		}
	}
</style>
