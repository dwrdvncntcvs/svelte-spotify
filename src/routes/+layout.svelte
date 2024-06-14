<script lang="ts">
	import { LogoutButton } from '$lib';
	import '$styles/main.scss';
	import 'modern-normalize/modern-normalize.css';

	export let data;

	$: user = data.user;
</script>

{#if user}
	<p>Hi there! {user.display_name}</p>
	<LogoutButton />
{/if}

<slot />
