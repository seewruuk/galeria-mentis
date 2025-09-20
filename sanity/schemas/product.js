export default {
    name: 'product',
    title: 'Artworks',
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

            initialValue: 1,

            name: "quantity",
            title: "Quantity",
            type: "number",
            validation: Rule => Rule.required().error('Quantity is required'),
        },
        // {
        //     name: "allowToSell",
        //     title: "AllowToSell",
        //     type: "boolean",
            // validation: Rule => Rule.required().error('Quantity is required'),
        // },
        {
            name: "thumbnail",
            title: "Thumbnail",
            type: "image",
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
            name: "imageAspectRatio",
            title: "Image Aspect Ratio",
            type: "string",
            options: {
                list: [
                    {
                        title: "Landscape",
                        value: "landscape",
                    },
                    {
                        title: "Portrait",
                        value: "portrait",
                    },
                    {
                        title: "Square",
                        value: "square",
                    },
                ],
            },
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
            name: "labels",
            title: "Labels",
            type: "array",
            of: [
                {
                    type: "string",
                    name: "label",
                    title: "Label",
                },
            ],
        },
        {
            name: 'productCategory',
            title: 'Product Category',
            type: 'reference',
            to: [{type: 'productCategory'}],
            validation: Rule => Rule.required().error('Product category is required'),
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
                            to: [{type: 'product-details'}], // poprawiona referencja
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
        {
            title: "SEO",
            name: "seo",
            type: "seo",
        },
    ],

};
