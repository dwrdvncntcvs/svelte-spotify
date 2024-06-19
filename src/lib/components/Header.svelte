<script lang="ts">
	import { LogoutButton, Navigation } from '$lib';
	import { ChevronDown, ExternalLink } from 'lucide-svelte';

	import { page } from '$app/stores';
	import { clickOutside } from '$actions';

	let optionElement: HTMLDivElement | undefined;

	$: user = $page.data.user;
</script>

<div class="content">
	<div class="left">
		<Navigation desktop={false} />
	</div>
	<div class="right">
		<div id="profile-button">
			{#if user?.images && user?.images.length > 0}
				<div
					class="profile-button-wrapper"
					use:clickOutside
					on:clickOutside={() => {
						if (optionElement) optionElement.style.display = 'none';
					}}
				>
					<button
						class="profile-button"
						on:click={() => {
							if (optionElement)
								optionElement.style.display =
									optionElement?.style.display === 'none' ? 'block' : 'none';
						}}
					>
						<img src={user.images[0].url} alt="" />
						<p class="profile-name">
							{user?.display_name} <span class="visually-hidden">Profile Menu</span>
						</p>
						<ChevronDown class="profile-arrow" size={20} />
					</button>
					<div id="profile-menu" bind:this={optionElement} style="display: none;">
						<div class="profile-menu-content">
							<ul>
								<li>
									<a href={user?.external_urls.spotify} target="_blank" rel="noopener noreferrer"
										>View on Spotify <ExternalLink focusable="false" aria-hidden /></a
									>
								</li>
								<li>
									<a href="/profile">View Profile</a>
								</li>
								<li>
									<LogoutButton />
								</li>
							</ul>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100%;

		:global(html.no-js) & {
			justify-content: start;
		}
	}

	.profile-button-wrapper {
		position: relative;

		#profile-menu {
			position: absolute;
			margin-top: 10px;
			right: 0;

			:global(html.no-js) & {
				position: relative;
				margin: 0;
				padding: 0;
				z-index: 100;
				display: block !important;
			}

			.profile-menu-content {
				padding: 5px 0px;
				background-color: var(--menu-bg-color);

				border-radius: 5px;

				:global(html.no-js) & {
					padding: 0;
					background-color: transparent;
				}

				ul {
					padding: 0;
					margin: 0;
					list-style: none;

					li {
						:global(html.no-js) & {
							display: inline-block;
							height: 100%;
						}

						&:hover {
							background-image: linear-gradient(rgba(255, 255, 255, 0.07) 0 0);
						}
						a :global(svg) {
							vertical-align: middle;
							margin-left: 10px;
						}

						a,
						:global(button) {
							padding: 10px 15px;
							display: inline-block;
							background: none;
							border: none;
							text-decoration: none;
							white-space: nowrap;
							cursor: pointer;
							color: var(--menu-text-color);
							width: 100%;
							text-align: start;
							font-size: functions.toRem(14);
							font-weight: 400;
						}
					}
				}
			}
		}
		.profile-button {
			position: relative;
			background: none;
			border: 1px solid var(--border);
			padding: 5px;
			border-radius: 25px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: var(--text-color);
			cursor: pointer;
			transition: all ease 0.2s;

			:global(html.no-js) & {
				display: none;
			}

			.profile-name {
				font-size: functions.toRem(14);
				padding: 0;
				margin: 0;
			}

			:global(.profile-arrow) {
				margin-left: 3px;
			}

			img {
				width: 28px;
				height: 28px;
				border-radius: 100%;
				margin-right: 10px;
				object-fit: cover;
			}

			&:hover {
				background-color: var(--accent-color);
			}
		}
	}
</style>
