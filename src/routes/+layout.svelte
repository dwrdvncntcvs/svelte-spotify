<script lang="ts">
	import { LogoutButton, Navigation } from '$lib';
	import '$styles/main.scss';
	import 'modern-normalize/modern-normalize.css';

	export let data;

	$: user = data.user;
</script>

<div id="main">
	{#if user}
		<div id="sidebar">
			<Navigation desktop />
		</div>
	{/if}
	<div id="content">
		<main id="main-content">
			<slot />
		</main>
	</div>
</div>

<style lang="scss">
	#main {
		display: flex;

		#content {
			flex: 1;

			#main-content {
				width: 100%;
				height: 100%;
				padding: 30px 15px 60px;

				@include breakpoint.up('md') {
					padding: 30px 30px 60px;
				}
			}
		}
	}
</style>
