<script lang="ts">
	import { Navigation } from '$lib';
	import { ChevronDown } from 'lucide-svelte';

	import { page } from '$app/stores';

	$: user = $page.data.user;
</script>

<div class="content">
	<div class="left">
		<Navigation desktop={false} />
	</div>
	<div class="right">
		<div id="profile-button">
			{#if user?.images && user?.images.length > 0}
				<button class="profile-button">
					<img src={user.images[0].url} alt="" />
					{user?.display_name} <span class="visually-hidden">Profile Menu</span>
					<ChevronDown class="profile-arrow" size={20} />
				</button>
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
