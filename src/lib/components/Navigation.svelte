<script lang="ts">
	import { Home, ListMusic, Search, type Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { fade } from 'svelte/transition';
	import logo from '$assets/Spotify_Logo_RGB_White.png';
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	import { beforeNavigate } from '$app/navigation';

	export let desktop: boolean = false;

	let isMobileMenuOpened = false;
	$: isOpen = desktop || isMobileMenuOpened;

	let openMenuButton: HTMLButtonElement;
	let closeMenuButton: HTMLButtonElement;
	let lastFocusableElement: HTMLAnchorElement;

	interface MenuItem {
		label: string;
		link: string;
		icon: ComponentType;
	}

	const openMenu = async () => {
		isMobileMenuOpened = true;
		await tick();
		closeMenuButton.focus();
	};

	const closeMenu = async () => {
		isMobileMenuOpened = false;
		await tick();
		openMenuButton.focus();
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

	const moveFocusToBottom = (e: KeyboardEvent) => {
		if (desktop) return;

		if (e.key === 'Tab' && e.shiftKey) {
			e.preventDefault();
			lastFocusableElement.focus();
		}
	};

	const moveFocusToTop = (e: KeyboardEvent) => {
		if (desktop) return;

		if (e.key === 'Tab' && !e.shiftKey) {
			e.preventDefault();
			closeMenuButton.focus();
		}
	};

	beforeNavigate(() => {
		isMobileMenuOpened = false;
	});

	const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			closeMenu();
		}
	};
</script>

<svelte:window on:keyup={handleEscape} />

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
		<button class="overlay" on:click={closeMenu} transition:fade={{ duration: 200 }}></button>
	{/if}
	<nav aria-label="Main">
		{#if !desktop}
			<button bind:this={openMenuButton} on:click={openMenu} aria-expanded={isOpen}> Open </button>
		{/if}
		<div
			class="nav-content-inner"
			style:visibility={isOpen ? 'visible' : 'hidden'}
			class:is-hidden={!isOpen}
		>
			<div class="nav-header">
				<img src={logo} alt="Spotify" />
				{#if !desktop}
					<button bind:this={closeMenuButton} on:click={closeMenu} on:keydown={moveFocusToBottom}>
						Close
					</button>
				{/if}
			</div>
			<ul>
				{#each menuItems as { icon, label, link }, i (i)}
					{@const iconProps = {
						'aria-hidden': 'true',
						focusable: 'false',
						size: 26,
						strokeWidth: 2
					}}
					<li>
						{#if menuItems.length === i + 1}
							<a
								href={link}
								bind:this={lastFocusableElement}
								class:active={$page.url.pathname === link}
								on:keydown={moveFocusToTop}
							>
								<svelte:component this={icon} {...iconProps} />
								{label}
							</a>
						{:else}
							<a href={link} class:active={$page.url.pathname === link}>
								<svelte:component this={icon} {...iconProps} />
								{label}
							</a>
						{/if}
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
				transition:
					transform 200ms,
					opacity 200ms,
					visibility 200ms;
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
