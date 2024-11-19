export default {
    name: 'productOption',
    title: 'Product Option',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Option Name',
            type: 'string',
            validation: Rule => Rule.required().error('Option name is required'),
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
            name: 'values',
            title: 'Option Values',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Add possible values for this option (e.g., "Yes, No" for Framed or "Small, Medium, Large" for Size)',
            validation: Rule => Rule.min(1).error('At least one value is required'),
        },
    ],
};
