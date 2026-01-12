"use client";
import {useState, useEffect} from "react";
import {getProductCategories} from "@/sanity/getSanity/getProductCategories";
import {getArtists} from "@/sanity/getSanity/getArtists";
import {getBlogPosts} from "@/sanity/getSanity/getBlogPosts";

export function useNavigationLinks() {
    const [links, setLinks] = useState([
        {name: "Home", link: '/'},
        {
            name: "Artwork",
            link: "/categories/all",
            links: []
        },
        {name: "Artists", link: '/artists'},
        {name: "Blog", link: '/blog'},
        {name: "Contact", link: '#contact'},
    ]);
    const [artistsLinks, setArtistsLinks] = useState([]);
    const [blogLinks, setBlogLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [categories, artists, posts] = await Promise.all([
                    getProductCategories(),
                    getArtists(),
                    getBlogPosts()
                ]);

                const catLinks = categories.map((category) => {
                    return {
                        name: category.title,
                        link: `/categories/${category.slug}`,
                    };
                });

                const index = catLinks.findIndex(item => item.name === "All Artwork");
                if (index > -1) {
                    const [temp] = catLinks.splice(index, 1);
                    catLinks.unshift(temp);
                }

                const blogLinksData = posts.map((post) => `/blog/${post.slug}`);
                const artistsLinksData = artists.map((artist) => `/artists/${artist.slug}`);

                setLinks([
                    {name: "Home", link: '/'},
                    {
                        name: "Artwork",
                        link: "/categories/all",
                        links: catLinks
                    },
                    {name: "Artists", link: '/artists'},
                    {name: "Blog", link: '/blog'},
                    {name: "Contact", link: '#contact'},
                ]);
                setArtistsLinks(artistsLinksData);
                setBlogLinks(blogLinksData);
                setLoading(false);
            } catch (error) {
                console.error("Error loading navigation data:", error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return {links, artistsLinks, blogLinks, loading};
}

