<script lang="ts">
	import '$styles/main.scss';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<input type="text" />
<select name="" id="">
	<option value="1">Hello</option>
</select>
<button>Button</button>

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
