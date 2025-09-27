
import { IoSettingsOutline } from "react-icons/io5";
export default {
    name: 'blogSettings',
    icon: IoSettingsOutline,
    title: 'Blog Settings',
    type: 'document',
    fields: [
        {
            title: "title",
            name: "title",
            type: "string",
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
        }
    ],
};
