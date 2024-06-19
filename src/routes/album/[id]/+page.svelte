<script lang="ts">
	import { getCopyrightSymbol } from '$helpers';

	export let data;

	$: album = data.album;

	$: console.log(data);
</script>

<h5>{album.album_type}</h5>
<h1>{album.name}</h1>

<div class="tracks">
	<ul>
		{#each album.tracks.items as track}
			<li>{track.name}</li>
		{/each}
	</ul>
</div>

<div class="credits">
	<p class="date">
		{new Date(album.release_date).toLocaleDateString('en', { dateStyle: 'medium' })}
	</p>
	{#each album.copyrights as copyright, i (i)}
		<p class="copyright">{getCopyrightSymbol(copyright.type)} {copyright.text}</p>
	{/each}
</div>

<style lang="scss">
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
