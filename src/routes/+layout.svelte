<script lang="ts">
	import { browser } from '$app/environment';
	import { Header, Navigation, Toasts } from '$lib';
	import '$styles/main.scss';
	import 'modern-normalize/modern-normalize.css';
	import { page } from '$app/stores';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import MicroModal from 'micromodal';
	import { X } from 'lucide-svelte';

	if (browser) MicroModal.init();

	NProgress.configure({
		showSpinner: false
	});

	let topbar: HTMLElement;
	let scrollY: number;

	export let data;

	$: hasError = $page.url.searchParams.get('error');
	$: hasSuccess = $page.url.searchParams.get('success');

	let opacity = 0;

	$: if (topbar) {
		opacity = scrollY / topbar.offsetHeight < 1 ? scrollY / topbar.offsetHeight : 1;
	}

	$: user = data.user;
	$: color = $page.data?.color || 'var(--header-color)';
	$: userAllPlaylists = data.userAllPlaylists;

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

<Toasts />

<div id="main">
	{#if user}
		<div id="sidebar">
			<Navigation desktop {userAllPlaylists} />
		</div>
	{/if}
	<div id="content">
		{#if hasSuccess || hasError}
			<div class="message" role="status" class:error={hasError} class:success={hasSuccess}>
				{hasError ?? hasSuccess}

				<a href={$page.url.pathname} class="close">
					<X focusable="false" aria-hidden />
					<span class="visually-hidden">Close Message</span>
				</a>
			</div>
		{/if}
		<div id="topbar" bind:this={topbar}>
			<div class="topbar-bg" style:background-color={color} style:opacity={`${opacity}`}></div>
			<Header {userAllPlaylists} />
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

			.message {
				position: sticky;
				z-index: 9999;
				padding: 10px 20px;
				top: 0;
				&.error {
					background-color: var(--error);
				}

				&.success {
					background-color: var(--accent-color);
				}

				.close {
					position: absolute;
					right: 10px;
					top: 7px;

					&:focus {
						outline: #fff;
					}

					:global(svg) {
						stroke: var(--text-color);
						vertical-align: middle;
					}
				}
			}

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
					background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
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
