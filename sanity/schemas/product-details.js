export default {
    title: "Product-Details",
    name: "product-details",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
        },
        {
            title: "Available Options",
            name: "options",
            type: "array",
            of: [{ type: "product-details-option" }],
        },
        {
            title: "Show on Website",
            name: "showOnWebsite",
            type: "boolean",
        }
    ]
};
