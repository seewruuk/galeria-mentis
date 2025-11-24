export default {
    title: "SEO",
    name: "seo",
    type: "object",
    fields: [
        {
            title: "Meta title",
            name: "metaTitle",
            description: "Page title (max 60 characters). Visible in search results.",
            type: "string",
            validation: Rule => Rule.max(60).warning('Title should be max 60 characters for best SEO results'),
        },
        {
            title: "Meta description",
            description: "Page description (max 160 characters). Visible in search results.",
            name: "metaDescription",
            type: "text",
            validation: Rule => Rule.max(160).warning('Description should be max 160 characters for best SEO results'),
        },
        {
            title: "Focus keyword",
            name: "focusKeyword",
            description: "Main focus keyword for this page",
            type: "string",
        },
        {
            title: "Keywords",
            name: "keywords",
            description: "Additional keywords (separated by commas)",
            type: "array",
            of: [{type: "string"}],
        },
        {
            title: "Canonical URL",
            name: "canonicalUrl",
            description: "Canonical URL of the page (optional, if different from default)",
            type: "url",
        },
        {
            title: "Meta Robots",
            name: "metaRobots",
            type: "object",
            description: "Page indexing settings for search engine robots",
            fields: [
                {
                    title: "Index",
                    name: "index",
                    type: "boolean",
                    initialValue: true,
                    description: "Should the page be indexed? (index/noindex)",
                },
                {
                    title: "Follow",
                    name: "follow",
                    type: "boolean",
                    initialValue: true,
                    description: "Should robots follow links? (follow/nofollow)",
                },
            ],
            options: {
                collapsible: true,
                collapsed: true,
            },
        },
        {
            title: "Open Graph Image",
            name: "ogImage",
            description: "Image displayed when sharing on social media (recommended: 1200x630px)",
            type: "image",
            options: {
                hotspot: true,
            },
        },
        {
            title: "Open Graph Type",
            name: "ogType",
            description: "Typ strony Open Graph",
            type: "string",
            options: {
                list: [
                    {title: "website", value: "website"},
                    {title: "article", value: "article"},
                    {title: "product", value: "product"},
                    {title: "profile", value: "profile"},
                ],
            },
            initialValue: "website",
        },
        {
            title: "Twitter Card Type",
            name: "twitterCard",
            description: "Typ karty Twitter",
            type: "string",
            options: {
                list: [
                    {title: "summary", value: "summary"},
                    {title: "summary_large_image", value: "summary_large_image"},
                ],
            },
            initialValue: "summary_large_image",
        },
        {
            title: "Schema.org Structured Data (JSON-LD)",
            name: "structuredData",
            description: "Structured data in JSON-LD format for better SEO (optional)",
            type: "object",
            fields: [
                {
                    title: "Type",
                    name: "type",
                    description: "Schema.org structured data type",
                    type: "string",
                    options: {
                        list: [
                            {title: "Product", value: "Product"},
                            {title: "Article", value: "Article"},
                            {title: "Person (Artist)", value: "Person"},
                            {title: "Organization", value: "Organization"},
                            {title: "BreadcrumbList", value: "BreadcrumbList"},
                            {title: "WebPage", value: "WebPage"},
                            {title: "None", value: ""},
                        ],
                    },
                },
                {
                    title: "Custom JSON-LD",
                    name: "customJsonLd",
                    description: "Custom JSON-LD code (advanced)",
                    type: "text",
                },
            ],
            options: {
                collapsible: true,
                collapsed: true,
            },
        },
        {
            title: "Alternate Languages",
            name: "alternateLanguages",
            description: "Alternate language versions of the page (for multilingual sites)",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            title: "Language Code",
                            name: "lang",
                            type: "string",
                            description: "Language code (e.g. 'pl', 'en')",
                        },
                        {
                            title: "URL",
                            name: "url",
                            type: "url",
                            description: "URL of the alternate language version",
                        },
                    ],
                },
            ],
            options: {
                collapsible: true,
                collapsed: true,
            },
        },
    ],
    preview: {
        select: {
            title: "metaTitle",
            description: "metaDescription",
        },
        prepare({title, description}) {
            return {
                title: title || "SEO (no title)",
                subtitle: description || "No description",
            };
        },
    },
}