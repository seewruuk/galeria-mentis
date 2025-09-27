import { TiNews } from "react-icons/ti";
export default {
    title: "Blog",
    icon: TiNews,
    name: "blog",
    type: "document",
    fields : [
        {
            title: "Title",
            name: "title",
            type: "string",
            validation: Rule => Rule.required()
        },
        {
            title: "Slug",
            name: "slug",
            type: "slug",
            validation: Rule => Rule.required(),
            options: {
                source: "title",
                maxLength: 200
            }
        },
        {
            title: "Description",
            name: "description",
            type: "text",
            validation: Rule => Rule.required()
        },
        {
            title: "Main image",
            name: "mainImage",
            type: "image",
            validation: Rule => Rule.required()
        },

        {
            title: "Body",
            name: "body",
            type: "array",
            of: [
                {
                    type: "block"
                },
                {
                    type: "image"
                }
            ],
            validation: Rule => Rule.required()
        },
        {
            title: 'seo',
            name: 'seo',
            type: 'seo',
        }
    ]
}