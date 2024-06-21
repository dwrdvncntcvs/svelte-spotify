<script lang="ts">
	import { Button, Card } from '$lib';
	import type { PageData } from './$types.js';

	export let data: PageData;

	interface Section {
		title: string;
		path: string;
		items: (SpotifyApi.AlbumObjectSimplified | SpotifyApi.PlaylistObjectSimplified)[];
	}

	let sections: Section[] = [];

	$: {
		if (data.newReleases) {
			sections.push({
				title: 'New Releases',
				path: '/section/new-releases',
				items: data.newReleases.albums.items
			});
			sections = sections;
		}

		if (data.featuredPlaylist) {
			sections.push({
				title: 'Featured Playlists',
				path: '/section/featured-playlists',
				items: data.featuredPlaylist.playlists.items
			});
			sections = sections;
		}

		data.homeCategories.forEach((category, i) => {
			const categoryPlaylist = data.categoriesPlaylists[i];
			if (categoryPlaylist) {
				sections.push({
					title: category.name,
					path: `/category/${category.id}`,
					items: categoryPlaylist.playlists.items
				});
				sections = sections;
			}
		});

		if (data.userPlaylist) {
			sections.push({
				title: 'Your Playlists',
				path: '/playlists',
				items: data.userPlaylist.items
			});
			sections = sections;
		}
	}
</script>

{#each sections as { items, title, path } (path)}
	<section class="content-row">
		<div class="content-header">
			<div class="left">
				<h2 class="section-title">{title}</h2>
			</div>
			<div class="right">
				<Button element="a" href={path} variant="outline">
					See all
					<span class="visually-hidden">See all {title}</span></Button
				>
			</div>
		</div>
		<div class="grid-items">
			{#each items as item (item.id)}
				<Card {item} />
			{/each}
		</div>
	</section>
{/each}

<style lang="scss">
	.content-row {
		margin-bottom: 40px;
		.content-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;

			.section-title {
				font-size: functions.toRem(22);
				font-weight: 600;
				margin: 0;
			}
		}
	}
</style>
