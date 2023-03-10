import RSS from 'rss';
import { SITE_URL } from '$lib/siteConfig';
import { listBlogposts } from '$lib/content';
// import { basename } from 'path';
// import { promises as fs } from 'fs';
// import grayMatter from 'gray-matter';

// https://github.com/sveltejs/kit/blob/master/examples/hn.svelte.dev/src/routes/%5Blist%5D/rss.js
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
// {
// // url: URL;
// // method: string;
// // headers: RequestHeaders;
// // rawBody: RawBody;
// // params: Record<string, string>;
// // body: ParameterizedBody<Body>;
// // locals: Locals;
// }
	const feed = new RSS({
		title: 'swyx.io blog',
		site_url: SITE_URL,
		feed_url: SITE_URL + '/api/rss.xml'
	});

	// // notes - originally tried to fetch this via /api/listBlogposts.json but...
	// // cannot use url.origin because it is null during SSR...
	// // const res = await fetch(url.origin + `/api/listBlogposts.json`)
	// // cannot use url.protocol because URL scheme "sveltekit" is not supported.
	// // const res = await fetch(`${url.protocol}//${url.host}/api/listBlogposts.json`);
	// // const allBlogs = await res.json();

	// finally the solution was simplest - just run the same fn in node lol
	const allBlogs = await listBlogposts();
	allBlogs.sort((a, b) => b.date - a.date).forEach((post) => {
		feed.item({
			title: post.title,
			url: SITE_URL + `/${post.slug}`,
			date: post.date,
			description: post.description
		});
	});

	// todo - nonindent if not human
	return {
		body: feed.xml({ indent: true }),
		headers: {
			'Cache-Control': `max-age=0, s-max-age=${600}`, // 10 minutes
			'Content-Type': 'application/rss+xml'
		}
	};
}
