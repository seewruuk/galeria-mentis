export default {
    name: 'artist',
    title: 'Artist',
    type: 'document',
    fields: [
        {
            name: 'avatar',
            title: 'Avatar',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'bannerImage',
            title: 'Banner Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'name',
            title: 'First Name and Last Name',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
        },
        {
            name: "location",
            title: "Location",
            type: "object",
            fields: [
                {
                    name: "city",
                    title: "City",
                    type: "string",
                },
                {
                    name: "country",
                    title: "Country",
                    type: "string",
                },
            ],
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
        {
            name: 'bio',
            title: 'Artist Information',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {name: 'header', title: 'Header', type: 'string'},
                        {name: 'content', title: 'Content', type: 'array', of: [{type: 'block'}]},
                    ],
                },
            ],
        },
        {
            name: 'artisticStyle',
            title: 'Artistic Style',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{type: 'artisticStyle'}],
                },
            ],
        },
        {
            name: 'paintingStyle',
            title: 'Painting Style',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{type: 'paintingStyle'}],
                },
            ],
        },
        {
            name: "artworks",
            title: "Artworks",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{type: "product"}],
                },
            ],
            validation: (Rule) => Rule.max(2),

        },
        {
            title: "SEO",
            name: "seo",
            type: "seo",
        }
    ],
};
