<script lang="ts" context="module">
	let currentAudio: HTMLAudioElement;
</script>

<script lang="ts">
	import { Pause, Play } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	type Track = SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified;

	export let track: Track;

	const dispatch = createEventDispatcher<{
		play: { track: Track };
		pause: { track: Track };
	}>();

	let audio: HTMLAudioElement;
	let paused = true;

	const onPlay = () => {
		if (currentAudio && currentAudio !== audio) {
			currentAudio.currentTime = 0;
			currentAudio.pause();
		}
		currentAudio = audio;
		dispatch('play', { track });
	};

	const onPause = () => {
		dispatch('pause', { track });
	};
</script>

<div class="player">
	<audio
		on:play={onPlay}
		on:pause={onPause}
		bind:this={audio}
		bind:paused
		controls
		src={track.preview_url}
		preload="none"
		hidden
	/>

	<button
		aria-label={paused ? `Play ${track.name}` : `Pause ${track.name}`}
		on:click={() => {
			if (paused) {
				audio.play();
			} else {
				audio.pause();
			}
		}}
	>
		{#if paused}
			<Play color="var(--text-color)" focusable="false" aria-hidden />
		{:else}
			<Pause color="var(--text-color)" focusable="false" aria-hidden />
		{/if}
	</button>
</div>

<style lang="scss">
	.player {
		button {
			width: 12px;
			height: 12px;
			padding: 0;
			border: none;
			background: none;
			cursor: pointer;

			:global(svg) {
				fill: var(--text-color);
				width: 12px;
				height: 12px;
			}
		}
	}
</style>
