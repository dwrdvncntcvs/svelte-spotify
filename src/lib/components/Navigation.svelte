<script lang="ts">
	import { Home, ListMusic, Search, type Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import logo from '$assets/Spotify_Logo_RGB_White.png';
	import { page } from '$app/stores';

	export let desktop: boolean = false;

	interface MenuItem {
		label: string;
		link: string;
		icon: ComponentType<Icon>;
	}

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

<div class="nav-content" class:desktop class:mobile={!desktop}>
	<nav aria-label="Main">
		<div class="nav-content-inner">
			<img src={logo} alt="Spotify" />
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

		nav {
			.nav-content-inner {
				padding: 20px;
				min-width: var(--sidebar-width);
				background-color: var(--sidebar-color);
				height: 100vh;
				overflow: auto;
				display: none;

				img {
					max-width: 100%;
					width: 130px;
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
