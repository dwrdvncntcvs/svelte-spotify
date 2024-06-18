<script lang="ts">
	import { LogoutButton, Navigation } from '$lib';
	import { ChevronDown, ExternalLink } from 'lucide-svelte';

	import { page } from '$app/stores';
	import { tippy } from '$actions';

	$: user = $page.data.user;
</script>

<div class="content">
	<div class="left">
		<Navigation desktop={false} />
	</div>
	<div class="right">
		<div id="profile-button">
			{#if user?.images && user?.images.length > 0}
				<button
					class="profile-button"
					use:tippy={{
						content: document.getElementById('profile-menu') || undefined,
						onMount: (instance) => {
							const template = document.getElementById('profile-menu');

							if (template) {
								template.style.display = 'block';
								instance.setContent(template);
							}
						},
						trigger: 'click',
						placement: 'bottom-end',
						interactive: true
					}}
				>
					<img src={user.images[0].url} alt="" />
					<p class="profile-name">
						{user?.display_name} <span class="visually-hidden">Profile Menu</span>
					</p>
					<ChevronDown class="profile-arrow" size={20} />
				</button>
			{/if}
		</div>
		<div id="profile-menu" style="display: none;">
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
</div>

<style lang="scss">
	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.profile-button {
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
</style>
