export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required().error('Name is required'),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
        },
        {
            name: "images",
            title: "Images",
            type: "array",
            of: [
                {
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                },
            ],
        },
        {
            name: 'artist',
            title: 'Artist',
            type: 'reference',
            to: [{type: 'artist'}],
            validation: Rule => Rule.required().error('Artist reference is required'),
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: Rule =>
                Rule.required()
                    .positive()
                    .error('Price must be a positive number'),
        },
        {
            name: 'productCategory',
            title: 'Product Category',
            type: 'reference',
            to: [{type: 'productCategory'}],
            validation: Rule => Rule.required().error('Product category is required'),
        },
        {
            name: 'options',
            title: 'Options',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'optionType',
                            title: 'Option Type',
                            type: 'reference',
                            to: [{ type: 'productOption' }],
                            validation: Rule => Rule.required().error('Option type is required'),
                        },
                        {
                            name: 'value',
                            title: 'Value',
                            type: 'string',
                            validation: Rule => Rule.required().error('Option value is required'),
                        },
                    ],
                },
            ],
            description: 'Select specific options and their values for this product (e.g., Framed: Yes, Size: Medium).',
        },
        {
            name: 'details',
            title: 'Details',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            type: 'reference',
                            name: 'productDetails',
                            to: [{ type: 'productDetails' }],
                        },
                        {name: 'content', title: 'Content', type: 'string'},
                    ],
                },
            ],
        },
        {
            name: 'additionalInfo',
            title: 'Additional Information',
            type: 'object',
            fields: [
                {
                    name: 'needToKnow',
                    title: 'Need to Know',
                    type: 'array',
                    of: [{type: 'block'}],
                },
                {
                    name: 'shippingAndReturns',
                    title: 'Shipping & Returns',
                    type: 'array',
                    of: [{type: 'block'}],
                },
                {
                    name: 'faq',
                    title: 'Frequently Asked Questions',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                {name: 'question', title: 'Question', type: 'string'},
                                {name: 'answer', title: 'Answer', type: 'text'},
                            ],
                        }
                    ],
                },
            ],
        },
        {
            name: 'recommendedArtworks',
            title: 'Recommended Artworks',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{type: 'product'}],
                },
            ],
        },
    ],
};
