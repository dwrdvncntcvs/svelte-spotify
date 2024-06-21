<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { Search } from 'lucide-svelte';

	let searchInput: HTMLInputElement;

	afterNavigate(() => {
		searchInput.focus();
	});
</script>

<form action="/search" method="GET" role="search">
	<div class="search-input-wrapper">
		<Search focusable="false" aria-hidden />
		<input
			bind:this={searchInput}
			class="search-input"
			name="q"
			type="search"
			size="30"
			placeholder="Search for albums, artists or playlists."
			aria-label="Search for albums, artists or playlists."
		/>
	</div>
</form>

<style lang="scss">
	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;

		:global(svg) {
			position: absolute;
			margin-left: 10px;
			stroke: var(--medium-gray);
			width: 22px;
			height: 22px;
		}

		.search-input {
			border: none;
			padding: 0 20px 0 40px;
			height: calc(var(--header-height) - 25px);
			border-radius: 20px;
			font-size: functions.toRem(14);
			color: var(--medium-gray);
		}
	}
</style>
