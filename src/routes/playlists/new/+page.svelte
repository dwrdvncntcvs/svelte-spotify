<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	export let data;
	export let form;
</script>

<h2>Add a New Playlist</h2>

<form method="POST">
	<input type="text" hidden name="userId" value={data.user?.id} />

	<div class="field" class:has-error={form?.name?.error}>
		<label for="playlist-name">Name *</label>
		<input
			type="text"
			name="name"
			id="playlist-name"
			placeholder="Playlist name"
			value={form?.name.value || ''}
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
			value={form?.description.value || ''}
		/>
	</div>

	{#if form?.apiError}
		<p class="error">{form.apiError}</p>
	{/if}

	<div class="submit-button">
		<Button element="button" type="submit">Create Playlist</Button>
	</div>
</form>
