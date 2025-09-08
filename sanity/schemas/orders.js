export default {
    title: "Orders",
    name: "order",
    type: "document",
    fields: [
        {
            title: "Date of order",
            name: "orderDate",
            type: "string",
        },
        {
            title: "Order Status",
            name: "orderStatus",
            type: "string",
            options: {
                list: [
                    {title: "New", value: "new"},
                    {title: "Paid", value: "paid"},
                    {title: "Done", value: "done"},
                    {title: "Cancelled", value: "cancelled"},
                ]
            }
        },
        {
            title: "Order Number",
            name: "orderNumber",
            type: "string",
        },
        {
            name: "personData",
            title: "Personal Data",
            type: "object",
            fields: [
                {
                    title: "Email",
                    name: "email",
                    type: "string",
                },
                {
                    title: "First name",
                    name: "name",
                    type: "string",
                },
                {
                    title: "Last name",
                    name: "lastname",
                    type: "string",
                },


                {
                    title: "Address",
                    name: "address",
                    type: "string",
                },

                {
                    title: "Apartment, suite, etc.",
                    name: "apartment",
                    type: "string",
                },

                {
                    title: "City",
                    name: "city",
                    type: "string",
                },

                {
                    title: "Country",
                    name: "country",
                    type: "string",
                },

                {
                    title: "State / Province",
                    name: "state",
                    type: "string",
                },

                {
                    title: "Postal Code",
                    name: "postal",
                    type: "string",
                },

                {
                    title: "Phone",
                    name: "phone",
                    type: "string",
                },
            ]
        },
        {
            name: "orderInfo",
            title: 'Order Info',
            type: "object",
            fields: [
                {
                    name: "deliveryMethod",
                    title: "Delivery Method",
                    type: "string",
                    options: {
                        list: [
                            {title: "Standard", value: "standard"},
                            {title: "Express", value: "express"},
                        ]
                    }

                },
            ]
        },


        {
            title: "Products",
            name: "products",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            title: "Name",
                            name: "name",
                            type: "string",
                        },
                        {
                            title: "Author",
                            name: "author",
                            type: "string",
                        },
                        {
                            title: "id",
                            name: "id",
                            type: "string",
                        },
                        {
                            title: "Author Slug",
                            name: "authorSlug",
                            type: "string",
                        },
                        {
                            title: "slug",
                            name: "slug",
                            type: "string",
                        },
                        {
                            title: "Price",
                            name: "price",
                            type: "number",
                        },
                        {
                            title: "Quantity",
                            name: "qty",
                            type: "number",
                        },
                        {
                            title: "Category",
                            name: "category",
                            type: "string",
                        },
                        {
                            title: "TAX",
                            name: "tax",
                            type: "number",
                        },
                    ]
                }
            ]
        },
        {
            title: "Invoice",
            name: "invoice",
            type: "object",
            fields: [
                {
                    title: "Invoice",
                    name: "status",
                    type: "boolean",
                },
                {
                    title: "Company Type",
                    name: "companyType",
                    type: "string",
                    options: {
                        list: [
                            {title: "Individual", value: "individual"},
                            {title: "Company", value: "company"},
                        ]
                    }
                },
                {
                    title: "Company Data",
                    name: "companyData",
                    type: "object",
                    fields: [
                        {
                            title: "Company Name / First name",
                            name: "companyName",
                            type: "string",
                        },
                        {
                            title: "NIP / Last name",
                            name: "nip",
                            type: "string",
                        },
                        {
                            title: "Phone",
                            name: "phone",
                            type: "string",
                        },
                        {
                            title: "Address",
                            name: "address",
                            type: "string",
                        },
                        {
                            title: "Postal Code",
                            name: "companyPostal",
                            type: "string",
                        },
                        {
                            title: "City",
                            name: "companyCity",
                            type: "string",
                        },
                        {
                            title: "Country",
                            name: "companyCountry",
                            type: "string",
                        },

                    ]
                },
            ]
        },
        // {
        //     title: "Kod rabatowy",
        //     name: "discountCode",
        //     description: "Jaki kod rabatowy został użyty przy składaniu zamówienia zamówienia",
        //     type: "string",
        // },
        // {
        //     title: "Kod rabatowy (id)",
        //     name: "discountId",
        //     type: "string",
        // },
        {
            title: "Total Price",
            name: "totalPrice",
            type: "string",
        },
        {
            title: "Stripe Session ID",
            name: "stripeSessionId",
            type: "string",
        },
        {
            title: "Newsletter",
            name: "newsletter",
            type: "boolean",
        }
    ]
}