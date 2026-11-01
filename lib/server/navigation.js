import "server-only";
import {getProductCategories} from "@/sanity/getSanity/getProductCategories";
import {getArtists} from "@/sanity/getSanity/getArtists";
import {getBlogPosts} from "@/sanity/getSanity/getBlogPosts";

const BASE_LINKS = [
    {name: "Home", link: '/'},
    {name: "Artwork", link: "/categories/all", links: []},
    {name: "Artists", link: '/artists'},
    {name: "Blog", link: '/blog'},
    {name: "Contact", link: '#contact'},
];

/** Dane nawigacji pobierane raz na serwerze (wcześniej każda wizyta pobierała je w przeglądarce). */
export async function getNavigationData() {
    try {
        const [categories, artists, posts] = await Promise.all([
            getProductCategories(),
            getArtists(),
            getBlogPosts(),
        ]);

        const catLinks = (categories || []).map((category) => ({
            name: category.title,
            link: `/categories/${category.slug}`,
        }));

        const index = catLinks.findIndex((item) => item.name === "All Artwork");
        if (index > -1) {
            const [temp] = catLinks.splice(index, 1);
            catLinks.unshift(temp);
        }

        return {
            links: BASE_LINKS.map((item) => (item.name === "Artwork" ? {...item, links: catLinks} : item)),
            artistsLinks: (artists || []).map((artist) => `/artists/${artist.slug}`),
            blogLinks: (posts || []).map((post) => `/blog/${post.slug}`),
        };
    } catch (error) {
        console.error("[navigation]", error.message);
        return {links: BASE_LINKS, artistsLinks: [], blogLinks: []};
    }
}
