<script lang="ts">
	import { msToTime } from '$helpers';
	import { Player } from '$lib';
	import { Clock8, ListPlus } from 'lucide-svelte';
	import playing from '$assets/playing.gif';

	let currentlyPlayingTrack: string | null = null;
	let isPlayerPaused: boolean = false;

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
			<Clock8 aria-hidden focusable="false" color="var(--light-gray)" />
		</div>
		<div class="actions-col"></div>
	</div>
	{#each tracks as track, i (track.id)}
		{@const number = i + 1}
		<div class="row" class:is-current={currentlyPlayingTrack === track.id}>
			<div class="number-col">
				{#if currentlyPlayingTrack === track.id && !isPlayerPaused}
					<img src={playing} class="playing-gif" alt="" />
				{:else}
					<span class="number">{number}</span>
				{/if}
				<div class="player">
					<Player
						{track}
						on:play={(e) => {
							currentlyPlayingTrack = e.detail.track.id;
							isPlayerPaused = false;
						}}
						on:pause={(e) => {
							isPlayerPaused = e.detail.track.id === currentlyPlayingTrack;
						}}
					/>
				</div>
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

<style lang="scss">
	.tracks {
		.row {
			&.is-current {
				.info-col .track-title h4,
				.number-col span.number {
					color: var(--accent-color);
				}
			}

			display: flex;
			align-items: center;
			padding: 7px 5px;
			border-radius: 4px;

			@include breakpoint.down('md') {
				:global(html.no-js) & {
					flex-direction: column;
					background-color: rgba(255, 255, 255, 0.03);
					padding: 20px;
					margin-bottom: 20px;
				}
			}

			&.header {
				border-bottom: 1px solid var(--border);
				border-radius: 0;
				padding: 5px;
				margin-bottom: 15px;

				@include breakpoint.down('md') {
					:global(html.no-js) & {
						display: none;
					}
				}

				.track-title {
					color: var(--light-gray);
					font-size: functions.toRem(12);
					text-transform: uppercase;
				}

				.duration-col :global(svg) {
					width: 16px;
					height: 16px;
				}
			}

			&:not(.header) {
				&:hover {
					background-color: rgba(255, 255, 255, 0.05);
					.number-col {
						.player {
							display: block;
						}

						span.number,
						.playing-gif {
							display: none;
						}
					}
				}
			}

			.number-col {
				width: 30px;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				margin-right: 15px;

				:global(html.no-js) & {
					width: 200px;
					display: flex;
					align-items: center;

					@include breakpoint.down('md') {
						width: 100%;
						margin-right: 0;
						margin-bottom: 15px;
					}

					.player {
						display: block;
						width: 100%;
						margin-left: 10px;
					}
				}

				.playing-gif {
					width: 12px;
				}

				.player {
					display: none;
				}

				span.number {
					color: var(--light-gray);
					font-size: functions.toRem(14);
				}
			}

			.info-col {
				flex: 1;

				@include breakpoint.down('md') {
					:global(html.no-js) & {
						width: 100%;
					}
				}

				.track-title {
					display: flex;
					align-items: center;
					gap: 4px;

					h4 {
						margin: 0;
						font-size: functions.toRem(15);
						font-weight: 400;
						line-height: 1;
					}

					span.explicit {
						text-transform: uppercase;
						font-size: functions.toRem(8);
						margin-left: 10px;
						border: 1px solid;
						padding: 2px 3px;
						border-radius: 2px;
						line-height: functions.toRem(10);
						color: var(--light-gray);
					}
				}

				.artists {
					color: var(--light-gray);
					font-size: functions.toRem(13);
					margin: 7px 0 0;
					line-height: 1;

					a {
						color: inherit;
						text-decoration: none;
					}
				}
			}

			.duration-col {
				@include breakpoint.down('md') {
					:global(html.no-js) & {
						width: 100%;
						margin-top: 10px;
					}
				}
				span.duration {
					color: var(--light-gray);
					font-size: functions.toRem(14);
				}
			}

			.actions-col {
				width: 30px;
				margin-left: 15px;

				@include breakpoint.down('md') {
					:global(html.no-js) & {
						width: 100%;
						display: flex;
                        justify-content: center;
					}
				}
			}
		}
	}
</style>