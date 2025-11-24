import { IoDocumentsOutline } from "react-icons/io5";
export default {
    name: 'policies',
    icon: IoDocumentsOutline,
    title: 'Documents and Policies',
    type: 'document',
    fields: [
        {
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    {title: 'Cookies', value: 'cookies'},
                    {title: 'Artist Terms', value: 'artistTerms'},
                    {title: 'Cookies Consent', value: 'cookiesConsent'},
                    {title: 'FAQ', value: 'faq'},
                    {title: 'Privacy Policy', value: 'privacyPolicy'},
                    {title: 'Shipping & Returns', value: 'shippingReturns'},
                    {title: 'Terms and Conditions', value: 'termsConditions'},
                ],
            }
        },
        {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{type: 'block'}],
            validation: Rule => Rule.required().error('Content is required'),
        },
        {
            title: "SEO",
            name: "seo",
            type: "seo",
            description: "SEO metadata for this policy page",
        },
    ],
    preview: {
        select: {
            title: 'type',
            subtitle: 'content',
        },
        prepare({title, subtitle}) {
            const typeNames = {
                'cookies': 'Cookies',
                'artistTerms': 'Artist Terms',
                'cookiesConsent': 'Cookies Consent',
                'faq': 'FAQ',
                'privacyPolicy': 'Privacy Policy',
                'shippingReturns': 'Shipping & Returns',
                'termsConditions': 'Terms and Conditions',
            };
            return {
                title: typeNames[title] || title,
                subtitle: subtitle ? `${subtitle.length} block(s)` : 'No content',
            };
        },
    },
}