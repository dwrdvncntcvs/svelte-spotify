<script lang="ts">
	import { msToTime } from '$helpers';
	import { Modal, Player } from '$lib';
	import { Clock8, ListPlus, ListX } from 'lucide-svelte';
	import playing from '$assets/playing.gif';
	import MicroModal from 'micromodal';
	import Button from './Button.svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import toast from '$store/toast';
	import { toasts } from '$store';
	import { invalidate } from '$app/navigation';

	let currentlyPlayingTrack: string | null = null;
	let isPlayerPaused: boolean = false;

	export let tracks: SpotifyApi.TrackObjectFull[] | SpotifyApi.TrackObjectSimplified[];
	export let isOwner: boolean = false;
	export let userPlaylist: SpotifyApi.PlaylistObjectSimplified[] | undefined;

	let isLoading = false;
	let isRemovingLoading = false;
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
		<div class="actions-col" class:is-owner={isOwner}></div>
	</div>
	{#each tracks as track, i}
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
			<div class="actions-col" class:is-owner={isOwner}>
				{#if isOwner}
					<form
						action="/playlist/{$page.params.id}?/removeTrackFromPlaylist"
						method="POST"
						use:enhance={() => {
							isRemovingLoading = true;
							return ({ result }) => {
								if (result.type === 'error') {
									toasts.error(result.error.message);
								}

								if (result.type === 'redirect') {
									const url = new URL(`${$page.url.origin}${result.location}`);

									const success = url.searchParams.get('success');
									const error = url.searchParams.get('error');

									if (error) {
										toast.error(error);
									}

									if (success) {
										toast.success(success);
									}
								}

								isRemovingLoading = false;
								// tracks = tracks.filter((val) => val.id !== track.id);
								invalidate(`/api/spotify/playlists/${$page.params.id}`)
							};
						}}
					>
						<input type="text" hidden name="track" value={track.id} />
						<button
							disabled={isRemovingLoading}
							class="remove-pl-button"
							type="submit"
							title="Remove {track.name}"
							aria-label="Remove {track.name}"
						>
							<ListX aria-hidden focusable="false" />
						</button>
					</form>
				{:else}
					<button
						disabled={!userPlaylist}
						class="add-pl-button"
						title="Add {track.name} to a playlist"
						aria-label="Add {track.name} to a playlist"
						on:click={() => {
							MicroModal.show(`add-pl-${track.id}`);
						}}
					>
						<ListPlus aria-hidden focusable="false" />
					</button>
					<Modal id="add-pl-{track.id}" title={`Add "${track.name}" to Playlist`}>
						{#if userPlaylist}
							<div class="playlist-menu">
								<div class="playlists-menu-content">
									<form
										method="POST"
										action="/playlist?/addToPlaylist&redirect={$page.url.pathname}"
										use:enhance={() => {
											isLoading = true;
											return ({ result }) => {
												if (result.type === 'error') {
													toasts.error(result.error.message);
												}

												if (result.type === 'redirect') {
													const url = new URL(`${$page.url.origin}${result.location}`);

													const success = url.searchParams.get('success');
													const error = url.searchParams.get('error');

													if (error) {
														toast.error(error);
													}

													if (success) {
														toast.success(success);
													}
												}

												isLoading = false;
												MicroModal.close(`add-pl-${track.id}`);
											};
										}}
									>
										<input type="text" hidden value={track.id} name="track" />

										<div class="field">
											<select name="playlist" aria-label="Playlist" id="playlist">
												{#each userPlaylist as playlist}
													<option value={playlist.id}>{playlist.name}</option>
												{/each}
											</select>
										</div>
										<div class="submit-button">
											<Button element="button" type="submit" disabled={isLoading}>
												Add <span class="visually-hidden">
													{track.name} to selected playlist
												</span>
											</Button>
										</div>
									</form>
								</div>
							</div>
						{/if}
					</Modal>
				{/if}
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

				.add-pl-button,
				.remove-pl-button {
					border: none;
					padding: 0;
					margin: 0;
					background: none;
					cursor: pointer;
					border-radius: 0;

					:global(svg) {
						stroke: var(--text-color);
						vertical-align: middle;
						width: 22px;
						height: 22px;
					}

					&:disabled {
						opacity: 0.8;
						cursor: not-allowed;
					}
				}

				.playlists-menu-content {
					padding: 15px;

					.field {
						select {
							width: 100%;
							height: 35px;
							border-radius: 4px;
						}
					}

					.submit-button {
						margin-top: 10px;
						text-align: right;
					}
				}

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
