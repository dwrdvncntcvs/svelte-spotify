<script lang="ts">
	import { browser } from '$app/environment';
	import { Header, Navigation } from '$lib';
	import '$styles/main.scss';
	import 'modern-normalize/modern-normalize.css';
	import { page } from '$app/stores';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	NProgress.configure({
		showSpinner: false
	});

	let topbar: HTMLElement;
	let scrollY: number;

	export let data;

	let opacity = 0;

	$: if (topbar) {
		opacity = scrollY / topbar.offsetHeight < 1 ? scrollY / topbar.offsetHeight : 1;
	}

	$: user = data.user;

	afterNavigate(() => {
		NProgress.done();
	});

	beforeNavigate(() => {
		NProgress.start();
	});
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>Spotify {$page.data.title ? `- ${$page.data.title}` : ''}</title>
</svelte:head>

<a href="#main-content" class="skip-link">Skip Link</a>

<div id="main">
	{#if user}
		<div id="sidebar">
			<Navigation desktop />
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
		:global(html.no-js) & {
			@include breakpoint.down('md') {
				display: block;
			}
		}

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

				:global(html.no-js) & {
					position: sticky;
					top: 0;
					background-color: var(--header-color);
					height: auto;
					padding: 10px 20px;

					@include breakpoint.up('md') {
						position: fixed;
					}
				}
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
					padding-top: calc(30px + var(--header-height));

					:global(html.no-js) & {
						@include breakpoint.down('md') {
							padding-top: 30px;
						}
					}
				}

				@include breakpoint.up('md') {
					padding: 30px 30px 60px;
				}
			}
		}
	}
</style>
