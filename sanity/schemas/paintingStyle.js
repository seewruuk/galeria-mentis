import { HiOutlinePaintBrush } from "react-icons/hi2";
export default {
    name: 'paintingStyle',
    icon: HiOutlinePaintBrush,
    title: 'Painting Styles',
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
            description: 'Optional description of the painting style.',
        },
    ],
};
