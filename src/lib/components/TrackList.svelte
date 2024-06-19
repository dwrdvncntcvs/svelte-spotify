<script lang="ts">
	import { msToTime } from '$helpers';
	import { Player } from '$lib';
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
			<Clock8 aria-hidden focusable="false" color="var(--light-gray)" />
		</div>
		<div class="actions-col"></div>
	</div>
	{#each tracks as track, i (track.id)}
		{@const number = i + 1}
		<div class="row">
			<div class="number-col">
				<span class="number">{number}</span>
				<Player
					{track}
					on:play={(e) => {
						console.log(e.detail.track);
					}}
					on:pause={(e) => {
						console.log(e.detail.track);
					}}
				/>
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
			display: flex;
			align-items: center;
			padding: 7px 5px;
			border-radius: 4px;

			&.header {
				border-bottom: 1px solid var(--border);
				border-radius: 0;
				padding: 5px;
				margin-bottom: 15px;

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
				}
			}

			.number-col {
				width: 30px;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				margin-right: 15px;

				span.number {
					color: var(--light-gray);
					font-size: functions.toRem(14);
				}
			}

			.info-col {
				flex: 1;

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
				span.duration {
					color: var(--light-gray);
					font-size: functions.toRem(14);
				}
			}

			.actions-col {
				width: 30px;
				margin-left: 15px;
			}
		}
	}
</style>
