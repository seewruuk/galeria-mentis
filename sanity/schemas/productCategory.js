export default {
    name: 'productCategory',
    title: 'Product Category',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required().error('Title is required'),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
            },
        },
        {
            name: "options",
            title: "Options",
            type: "array",
            of: [{type: 'string'}],
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Optional description of the product category.',
        },
        {
            name: "image",
            title: "Background Image",
            type: "image",
        },
        {
            name: "header",
            title: "Header",
            type: 'array',
            of: [{type: 'block'}],
        },

        {
            name: "seo",
            title: "SEO",
            type: "seo",
        },
    ],
};
