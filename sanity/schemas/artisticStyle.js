export default {
    name: 'artisticStyle',
    title: 'Artistic Style',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required().error('Title is required'),
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Optional description of the artistic style.',
        },
    ],
};
