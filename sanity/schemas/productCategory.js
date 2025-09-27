import { IoHammerOutline } from "react-icons/io5";
export default {
    name: 'productCategory',
    icon: IoHammerOutline,
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
