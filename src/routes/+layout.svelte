<script lang="ts">
	import { LogoutButton } from '$lib';
	import '$styles/main.scss';
	import 'modern-normalize/modern-normalize.css';

	export let data;

	$: user = data.user;
</script>

<div id="main">
	<div id="content">
		<main id="main-content">
			<slot />
		</main>
	</div>
</div>

<style lang="scss">
	#main {
		#content {
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
