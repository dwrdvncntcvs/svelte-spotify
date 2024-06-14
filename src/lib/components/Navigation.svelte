<script lang="ts">
	import { Home, ListMusic, Search, type Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { fade } from 'svelte/transition';
	import logo from '$assets/Spotify_Logo_RGB_White.png';
	import { page } from '$app/stores';

	export let desktop: boolean = false;

	let isMobileMenuOpened = false;
	$: isOpen = desktop || isMobileMenuOpened;

	interface MenuItem {
		label: string;
		link: string;
		icon: ComponentType<Icon>;
	}

	const openMenu = () => {
		isMobileMenuOpened = true;
	};

	const closeMenu = () => {
		isMobileMenuOpened = false;
	};

	const menuItems: MenuItem[] = [
		{
			label: 'Home',
			icon: Home,
			link: '/'
		},
		{
			label: 'Search',
			icon: Search,
			link: '/search'
		},
		{
			label: 'Playlists',
			icon: ListMusic,
			link: '/playlists'
		}
	];
</script>

<svelte:head>
	{#if !desktop && isMobileMenuOpened}
		<style>
			body {
				overflow: hidden;
			}
		</style>
	{/if}
</svelte:head>

<div class="nav-content" class:desktop class:mobile={!desktop}>
	{#if !desktop && isMobileMenuOpened}
		<div class="overlay" on:click={closeMenu} transition:fade={{ duration: 200 }}></div>
	{/if}
	<nav aria-label="Main">
		{#if !desktop}
			<button on:click={openMenu}> Open </button>
		{/if}
		<div class="nav-content-inner" class:is-hidden={!isOpen}>
			<div class="nav-header">
				<img src={logo} alt="Spotify" />
				{#if !desktop}
					<button on:click={closeMenu}> Close </button>
				{/if}
			</div>
			<ul>
				{#each menuItems as { icon, label, link }, i (i)}
					<li>
						<a href={link} class:active={$page.url.pathname === link}>
							<svelte:component
								this={icon}
								aria-hidden="true"
								focusable="false"
								size={26}
								strokeWidth={2}
							/>
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</nav>
</div>

<style lang="scss">
	.nav-content {
		&.desktop {
			position: sticky;
			top: 0;
			.nav-content-inner {
				@include breakpoint.up('md') {
					display: block;
				}
			}
		}

		&.mobile .nav-content-inner {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			transition:
				transform 200ms,
				opacity 200ms;

			&.is-hidden {
				transform: translateX(-100%);
				opacity: 0;
			}
			@include breakpoint.down('md') {
				display: block;
			}
		}

		.overlay {
			width: 100%;
			height: 100%;
			background-color: var(--sidebar-color);
			opacity: 0.45;
			position: fixed;
			z-index: 1;
			top: 0;
			left: 0;

			@include breakpoint.up('md') {
				display: none;
			}
		}

		nav {
			.nav-content-inner {
				padding: 20px;
				min-width: var(--side-bar-width);
				background-color: var(--sidebar-color);
				height: 100vh;
				overflow: auto;
				display: none;

				img {
					max-width: 100%;
					width: 130px;
				}

				.nav-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}

			ul {
				padding: 0;
				margin-top: 20px 00;
				list-style: none;

				li {
					color: var(--text-color);

					a {
						color: inherit;
						text-decoration: none;
						display: flex;
						align-items: center;
						gap: 4px;
						font-size: functions.toRem(14);
						font-weight: 500;
						padding: 5px;
						margin: 10px 0;
						opacity: 0.7;
						transition: opacity 0.2s;

						&.active {
							opacity: 1;
						}

						&:hover,
						&:focus {
							opacity: 1;
						}

						:global(svg) {
							margin-right: 12px;
						}
					}
				}
			}
		}
	}
</style>
