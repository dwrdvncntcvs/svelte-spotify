<script lang="ts">
	import { msToTime } from '$helpers';
	import { Clock8, ListPlus } from 'lucide-svelte';

	export let tracks: SpotifyApi.TrackObjectFull[] | SpotifyApi.TrackObjectSimplified[];
</script>

<div class="tracks">
	<div class="row header">
		<div class="number-col">
			<span class="number">#</span>
		</div>
		<div class="info-col">
			<span class="track-title">Title</span>
		</div>
		<div class="duration-col">
			<Clock8 aria-hidden focusable="false" />
		</div>
		<div class="actions-col"></div>
	</div>
	{#each tracks as track, i (track.id)}
		{@const number = i + 1}
		<div class="row">
			<div class="number-col">
				<span class="number">{number}</span>
			</div>
			<div class="info-col">
				<div class="track-title">
					<h4>
						{track.name}
					</h4>
					{#if track.explicit}
						<span class="explicit">Explicit</span>
					{/if}
				</div>
				<p class="artists">
					{#each track.artists as artist, i (artist.id)}
						<a href="artist/{artist.id}">{artist.name}</a>{#if track.artists.length - 1 > i}
							{', '}
						{/if}
					{/each}
				</p>
			</div>
			<div class="duration-col">
				<span class="duration">
					{msToTime(track.duration_ms)}
				</span>
			</div>
			<div class="actions-col">
				<ListPlus aria-hidden focusable="false" />
			</div>
		</div>
	{/each}
</div>
