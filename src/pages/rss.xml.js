import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export const get = async () => rss({
    // `<title>` field in output xml
    title: '.chronoclast',

    // `<description>` field in output xml
    description: 'Ancient tomes.',

    // base URL for RSS <item> links
    // SITE will use "site" from your project's astro.config.
    site: import.meta.env.SITE,

    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: await pagesGlobToRssItems(
        import.meta.glob('./**/*.mdx'),
    ),
    customData: `<language>en-us</language>`,
});