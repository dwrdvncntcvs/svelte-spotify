<script lang="ts">
	import { PlaylistForm } from '$lib';

	export let data;
	export let form;
</script>

<h2>Add a New Playlist</h2>

<PlaylistForm userId={data.user?.id} {form} />
