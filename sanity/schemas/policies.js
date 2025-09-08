export default {
    name: 'policies',
    title: 'Policies',
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


    ]
}