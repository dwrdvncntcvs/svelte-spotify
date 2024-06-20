<script lang="ts">
	import { Button, Card, ItemPage } from '$lib';
	import { invalidate } from '$app/navigation';

	export let data;

	let isRetrying = false;

	$: user = data.user;
	$: color = data.color;
	$: following = data.following;
</script>

<div id="profile-page">
	<ItemPage
		{color}
		image={user?.images && user?.images?.length > 0 ? user?.images[0].url : undefined}
		title={user?.display_name || ''}
		type="User"
	>
		<span slot="meta" class="following-count">
			{Intl.NumberFormat('en', { notation: 'compact' }).format(user?.followers?.total || 0)} Follower{user?.followers &&
			user?.followers?.total > 0
				? 's'
				: ''}
		</span>

		{#if following === undefined}
			<div class="fail">
				<p>Failed to load data</p>
				<Button
					disabled={isRetrying}
					element="button"
					on:click={async () => {
						isRetrying = true;
						await invalidate('/api/spotify/me/following?type=artist&limit=6');
						isRetrying = false;
					}}
				>
					Retry
				</Button>
			</div>
		{/if}

		{#if following && following.artists.items.length > 0}
			<div class="following">
				<h2>Following</h2>
				<div class="grid-items">
					{#each following.artists.items as artist}
						<div class="grid-item">
							<Card item={artist} />
						</div>
					{/each}
				</div>
				<div class="view-all-button">
					<Button element="a" variant="outline" href="/profile/artists">
						View All
						<span class="visually-hidden">Artists that you are following</span>
					</Button>
				</div>
			</div>
		{/if}
	</ItemPage>
</div>

<style lang="scss">
	#profile-page {
		.following-count {
			font-size: functions.toRem(14);
			color: var(--light-gray);
		}

		:global(.banner) {
			align-items: center;
			text-align: center;

			@include breakpoint.up('md') {
				text-align: left;
			}
		}

		:global(.cover-image) {
			border-radius: 100%;
		}

		.fail {
			text-align: center;
			margin-top: 40px;
		}

		.following {
			margin-top: 30px;

			h2 {
				font-size: functions.toRem(24);
				margin-bottom: 0.7em;
			}

			.view-all-button {
				margin-top: 30px;
				text-align: right;
			}
		}
	}
</style>
