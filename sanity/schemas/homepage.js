export default {
    name: 'homepage',
    title: 'Homepage',
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
                                {name: 'label', title: 'Label', type: 'string'},
                                {name: 'link', title: 'Link', type: 'string'},
                            ],
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
                    type: 'object',
                    fields: [
                        {
                            name: 'artist',
                            title: 'Artist',
                            type: 'reference',
                            to: [{type: 'artist'}],
                        },
                        {
                            name: 'works',
                            title: 'Highlighted Works',
                            type: 'array',
                            of: [
                                {
                                    type: 'reference',
                                    to: [{type: 'product'}],
                                },
                            ],
                            validation: Rule => Rule.max(3).warning('You can only select up to 3 works per artist'),
                        },
                    ],
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
