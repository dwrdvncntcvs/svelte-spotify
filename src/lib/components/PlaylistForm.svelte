<script lang="ts">
	import { Button } from '$lib';
	import type { ActionData as AddActionData, PageData } from '../../routes/playlists/new/$types';
	import type { ActionData as EditActionData } from '../../routes/playlist/[id]/edit/$types';
	import { applyAction, enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';

	let isLoading = false;

	export let form: AddActionData | EditActionData;
	export let userId: string | undefined = undefined;
	export let action: string | undefined = undefined;
	export let playlist:
		| SpotifyApi.PlaylistObjectFull
		| SpotifyApi.PlaylistObjectSimplified
		| undefined;

	const dispatch = createEventDispatcher<{ success: {}; redirect: {} }>();
</script>

<form
	method="POST"
	{action}
	use:enhance={() => {
		isLoading = true;
		return async ({ result }) => {
			await applyAction(result);
			isLoading = false;
			if (result.type === 'success') {
				dispatch('success', {});
			}

			if (result.type === 'redirect') {
				dispatch('redirect', {});
			}
		};
	}}
>
	{#if userId}
		<input type="text" hidden name="userId" value={userId} />
	{/if}

	<div class="field" class:has-error={form?.name?.error}>
		<label for="playlist-name">Name *</label>
		<input
			type="text"
			name="name"
			id="playlist-name"
			placeholder="Playlist name"
			value={form?.name?.value || playlist?.name || ''}
		/>
		{#if form?.name?.error}
			<p class="error">{form?.name?.error}</p>
		{/if}
	</div>
	<div class="field">
		<label for="playlist-description">Description</label>
		<input
			type="text"
			name="description"
			id="playlist-description"
			placeholder="Playlist description"
			value={form?.description?.value || playlist?.description || ''}
		/>
	</div>

	{#if form?.apiError}
		<p class="error">{form.apiError}</p>
	{/if}

	<div class="submit-button">
		<Button element="button" type="submit" disabled={isLoading}>
			{playlist ? 'Save Playlist' : 'Create Playlist'}
		</Button>
	</div>
</form>

<style lang="scss">
	form {
		max-width: 400px;

		.field {
			margin-bottom: 20px;
			&.has-error input {
				outline: 2px solid var(--error);
			}

			label {
				display: inline-block;
				margin-bottom: 10px;
				font-size: functions.toRem(14);
			}

			input {
				width: 100%;
			}
		}

		p.error {
			color: var(--error);
			font-size: functions.toRem(14);
			margin: 10px 0;
		}

		.submit-button {
			text-align: right;
			margin-top: 40px;
		}
	}
</style>
