<script lang="ts">
	import 'modern-normalize/modern-normalize.css';
	import '$styles/main.scss';

	export let data;
</script>

{#if data.user}
	{data.user?.display_name}
{/if}

<slot />
