<script lang="ts">
	import { Button } from '$lib';
	import type { ActionData as AddActionData, PageData } from '../../routes/playlists/new/$types';

	export let form: AddActionData;
	export let userId: string | undefined = undefined;
	export let action: string | undefined = undefined;
</script>

<form method="POST" {action}>
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
			value={form?.name?.value || ''}
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
			value={form?.description?.value || ''}
		/>
	</div>

	{#if form?.apiError}
		<p class="error">{form.apiError}</p>
	{/if}

	<div class="submit-button">
		<Button element="button" type="submit">Create Playlist</Button>
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