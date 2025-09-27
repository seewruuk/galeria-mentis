import { IoSettingsOutline } from "react-icons/io5";
export default {
    name: 'homepage',
    title: 'Homepage',
    icon: IoSettingsOutline,
    type: 'document',
    fields: [
        {
            title: "title",
            name: "title",
            type: "string",
        },
        {
            name: 'heroSection',
            title: 'Hero Section',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {name: 'title', title: 'Title', type: 'string'},
                        {name: 'text', title: 'Text', type: 'text'},
                        {
                            name: 'button',
                            title: 'Button',
                            type: 'object',
                            fields: [
                                { name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required() },

                                {
                                    name: 'mode',
                                    title: 'Action type',
                                    type: 'string',
                                    initialValue: 'route',
                                    options: {
                                        layout: 'radio',
                                        direction: 'horizontal',
                                        list: [
                                            { title: 'Route (page)', value: 'route' },
                                            { title: 'Anchor (section on this page)', value: 'anchor' },
                                            { title: 'External URL', value: 'external' },
                                        ],
                                    },
                                    validation: Rule => Rule.required(),
                                },

                                // ROUTE (zamiennik dla reference)
                                {
                                    name: 'internalPath',
                                    title: 'Internal path (route)',
                                    description: 'eg. "/contact" or "contact" — "/" is optional.',
                                    type: 'string',
                                    hidden: ({ parent }) => parent?.mode !== 'route',
                                    validation: Rule =>
                                        Rule.custom((val, ctx) => {
                                            if (ctx.parent?.mode !== 'route') return true;
                                            if (!val || !String(val).trim()) return 'Path, eg. "/contact".';
                                            const ok = /^\/?[A-Za-z0-9/_\-]+$/.test(String(val).trim());
                                            return ok || 'Allow characters/numbers, "-", "_", "/" (no space).';
                                        }),
                                },

                                // ANCHOR
                                {
                                    name: 'anchorId',
                                    title: 'Section ID (anchor)',
                                    description: 'eg. "benefits" or "#benefits" — "#" is optional.',
                                    type: 'string',
                                    hidden: ({ parent }) => parent?.mode !== 'anchor',
                                    validation: Rule =>
                                        Rule.custom((val, ctx) => {
                                            if (ctx.parent?.mode !== 'anchor') return true;
                                            if (!val || !String(val).trim()) return 'Section Id'
                                            const ok = /^#?[A-Za-z][\w\-\:\.]*$/.test(String(val).trim());
                                            return ok || 'Use characters/numbers/-/_ and # optional at the begining.';
                                        }),
                                },
                                {
                                    name: 'smoothScroll',
                                    title: 'Smooth scroll',
                                    type: 'boolean',
                                    initialValue: true,
                                    hidden: ({ parent }) => parent?.mode !== 'anchor',
                                },
                                {
                                    name: 'scrollOffset',
                                    title: 'Scroll offset (px)',
                                    description: 'Eg. -80 for sticky header.',
                                    type: 'number',
                                    hidden: ({ parent }) => parent?.mode !== 'anchor',
                                },
                                {
                                    name: 'url',
                                    title: 'External URL',
                                    type: 'url',
                                    hidden: ({ parent }) => parent?.mode !== 'external',
                                    validation: Rule =>
                                        Rule.uri({ allowRelative: false, scheme: ['http', 'https', 'mailto', 'tel'] })
                                            .error('Address eg.(http/https/mailto/tel).')
                                            .custom((val, ctx) => (ctx.parent?.mode === 'external' ? !!val : true))
                                            .error('In "External" mode you need to provie URL.'),
                                },
                                {
                                    name: 'newTab',
                                    title: 'Open in new tab',
                                    type: 'boolean',
                                    initialValue: false,
                                    hidden: ({ parent }) => parent?.mode !== 'external',
                                },
                                {
                                    name: 'ariaLabel',
                                    title: 'ARIA label (optional)',
                                    type: 'string',
                                },
                            ],
                            preview: {
                                select: { label: 'label', mode: 'mode', anchorId: 'anchorId', url: 'url', internalPath: 'internalPath' },
                                prepare({ label, mode, anchorId, url, internalPath }) {
                                    const subtitle =
                                        mode === 'route' ? `Route: ${internalPath ?? ''}`
                                            : mode === 'anchor' ? `Anchor: ${anchorId ?? ''}`
                                                : mode === 'external' ? `External: ${url ?? ''}`
                                                    : '';
                                    return { title: label || 'Button', subtitle };
                                },
                            },
                        },

                        {
                            name: 'backgroundImage',
                            title: 'Background Image',
                            type: 'image',
                        }
                    ],
                },
            ],
        },
        {
            name: 'featuredProducts',
            title: 'Featured Products',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{type: 'product'}],
                },
            ],
            validation: Rule => Rule.max(4).warning('You can only select up to 4 products'),
        },
        {
            name: 'highlightedArtists',
            title: 'Highlighted Artists',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{type: 'artist'}],
                },
            ],
        },
        {
            name: 'benefitsSection',
            title: 'Benefits Section',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {name: 'icon', title: 'Icon', type: 'image'},
                        {name: 'title', title: 'Title', type: 'string'},
                        {name: 'text', title: 'Text', type: 'text'},
                    ],
                },
            ],
        },
        {
            name: 'benefitsSection_backgroundImage',
            title: 'Background Image',
            type: 'image',
        },
        {
            name: "seo",
            title: "SEO",
            type: "seo",
        }
    ],
};
