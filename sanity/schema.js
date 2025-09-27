import seo from "./schemas/seo"
import productCategory from "./schemas/productCategory"
import product from "./schemas/product"
import artisticStyle from "./schemas/artisticStyle"
import paintingStyle from "./schemas/paintingStyle"
import artist from "./schemas/artist"
import homepage from "./schemas/homepage"
import orders from "./schemas/orders"
import user from "./schemas/user"
import blog from "./schemas/blog"
import productDetails from "./schemas/product-details"
import productDetailsOption from "./schemas/product-details-option"
import artistsSettings from "./schemas/artistsSettings"
import blogSettings from "./schemas/blogSettings"
import policies from "./schemas/policies"

export const schema = {
    types: [
        seo,
        user,
        artist,
        product,
        orders,
        blog,

        homepage,
        blogSettings,
        policies,
        artistsSettings,


        productDetails,
        productDetailsOption,
        productCategory,

        artisticStyle,
        paintingStyle,
    ],
}
