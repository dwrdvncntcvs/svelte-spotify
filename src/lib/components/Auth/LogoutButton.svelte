<script>
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib';
</script>

<form
	method="POST"
	action="/api/auth/logout"
	on:submit|preventDefault={async () => {
		const response = await fetch('/api/auth/logout', {
			method: 'POST',
			headers: {
				accept: 'application/json'
			}
		});

		if (response.ok) await invalidateAll();
	}}
>
	<Button element='button' type="submit"> Logout </Button>
</form>
