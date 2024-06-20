<script lang="ts">
	import { PlaylistForm } from '$lib';

	export let form;
	export let data;

	$: playlist = data.playlist;
</script>

<h2>{data.title}</h2>

<PlaylistForm {form} {playlist} action="?redirect"/>
