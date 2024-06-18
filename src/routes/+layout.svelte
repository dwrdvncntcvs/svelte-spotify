<script lang="ts">
	import { browser } from '$app/environment';
	import { Header, LogoutButton, Navigation } from '$lib';
	import '$styles/main.scss';
	import 'modern-normalize/modern-normalize.css';

	let topbar: HTMLElement;
	let scrollY: number;

	export let data;

	let opacity = 0;

	$: if (topbar) {
		opacity = scrollY / topbar.offsetHeight < 1 ? scrollY / topbar.offsetHeight : 1;
	}

	$: user = data.user;
</script>

<svelte:window bind:scrollY />

<div id="main">
	{#if user}
		<div id="sidebar">
			{#if browser}
				<Navigation desktop />
			{/if}
		</div>
	{/if}
	<div id="content">
		<div id="topbar" bind:this={topbar}>
			<div
				class="topbar-bg"
				style:background-color="var(--header-color)"
				style:opacity={`${opacity}`}
			></div>
			<Header />
		</div>
		<main id="main-content" class:logged-in={user}>
			<slot />
		</main>
	</div>
</div>

<style lang="scss">
	#main {
		display: flex;

		#content {
			flex: 1;

			#topbar {
				position: fixed;
				height: var(--header-height);
				padding: 0 15px;
				display: flex;
				align-items: center;
				width: 100%;
				z-index: 100;
				color: var(--text-color);

				.topbar-bg {
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					z-index: -1;
				}

				@include breakpoint.up('md') {
					width: calc(100% - var(--side-bar-width));
					padding: 0 30px;
				}
			}

			#main-content {
				width: 100%;
				height: 100%;
				padding: 30px 15px 60px;
				&.logged-in {
					margin-top: var(--header-height);
				}

				@include breakpoint.up('md') {
					padding: 30px 30px 60px;
				}
			}
		}
	}
</style>
