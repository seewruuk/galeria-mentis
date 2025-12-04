import { IoSettingsOutline } from "react-icons/io5";

export default {
    name: 'maintenanceMode',
    icon: IoSettingsOutline,
    title: 'Maintenance Mode Settings',
    type: 'document',
    fields: [
        {
            name: 'isActive',
            title: 'Enable Maintenance Mode',
            type: 'boolean',
            initialValue: false,
            description: 'When enabled, the site will be blocked and require a password to access',
        },
        {
            name: 'message',
            title: 'Additional Message',
            type: 'text',
            description: 'Optional message to display to visitors during maintenance',
            rows: 4,
        },
        {
            name: 'password',
            title: 'Access Password',
            type: 'string',
            description: 'Password required to access the site during maintenance mode',
            validation: Rule => Rule.custom((value, context) => {
                if (context.document.isActive && !value) {
                    return 'Password is required when maintenance mode is active';
                }
                return true;
            }),
        },
        {
            name: 'contactEmail',
            title: 'Contact Email',
            type: 'string',
            description: 'Email address to display for contact during maintenance',
            validation: Rule => Rule.email().error('Please enter a valid email address'),
        },
    ],
    preview: {
        select: {
            isActive: 'isActive',
        },
        prepare({ isActive }) {
            return {
                title: 'Maintenance Mode',
                subtitle: isActive ? 'Active' : 'Inactive',
            };
        },
    },
};

