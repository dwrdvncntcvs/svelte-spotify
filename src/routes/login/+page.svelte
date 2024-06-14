<script lang="ts">
	import { Button } from '$lib';
</script>

<div class="main-container">
	<div class="sub-1-container">
		<img src="/src/assets/Spotify_Logo_RGB_White.png" alt="" class="spotify-img" />
		<h1>EGP 0.00 for 3 months of Premium</h1>
		<p>Enjoy ad-free music listening, offline playback, and more. Cancel anytime</p>
		<div class="button-container">
			<Button element="button" variant="outline">Sign Up</Button>
			<Button element="a">Log in</Button>
		</div>
	</div>
	<div class="sub-3-container">
		<img src="/src/assets/cover.png" alt="" class="spotify-cover-img" />
	</div>
</div>

<style lang="scss">
	.main-container {
		display: flex;
		margin-top: functions.toRem(100);
		justify-content: space-around;
		padding: functions.toRem(50);
		width: 100%;
		height: 100%;
	}

	.sub-1-container {
		display: flex;
		align-items: start;
		flex-direction: column;
	}

	.spotify-img {
		width: functions.toRem(100);
	}

	.spotify-cover-img {
		height: functions.toRem(350);
	}

	.button-container {
		display: flex;
		gap: 4px;
	}
</style>
