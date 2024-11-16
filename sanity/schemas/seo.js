export default {
    title: "SEO",
    name: "seo",
    type: "object",
    fields: [
        {
            title: "Meta title",
            name: "metaTitle",
            description: "Max 60 characters",
            type: "string",
        },
        {
            title: "Meta description",
            description: "Max 160 characters",
            name: "metaDescription",
            type: "text",
        },
        {
            title: "Keywords",
            name: "keywords",
            type: "array",
            of: [{type: "string"}],
        },
    ],
}