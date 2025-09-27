import { IoHammerOutline } from "react-icons/io5";
export default {
    title: "Product-Details",
    icon: IoHammerOutline,
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
