<script lang="ts">
	import '$styles/main.scss';

	export let data;
</script>

<p>Hello World</p>

<div style="height: 10000px"></div>

<style lang="scss">
	h1 {
		color: blue;
		font-size: functions.toRem(36);

		@include breakpoint.up('md') {
			color: green;
		}

		@include breakpoint.up('lg') {
			color: red;
		}
	}

	a {
		text-decoration: none;
	}
</style>
