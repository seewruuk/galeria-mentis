import productOption from "./schemas/productOption"
import seo from "./schemas/seo"
import productDetails from "./schemas/productDetails"
import productCategory from "./schemas/productCategory"
import product from "./schemas/product"
import artisticStyle from "./schemas/artisticStyle"
import paintingStyle from "./schemas/paintingStyle"
import artist from "./schemas/artist"
import homepage from "./schemas/homepage"
import orders from "./schemas/orders"
import user from "./schemas/user"
import blog from "./schemas/blog"


export const schema = {
    types: [
        orders,
        user,
        blog,

        productOption,
        seo,
        productDetails,
        productCategory,
        product,
        artisticStyle,
        paintingStyle,
        artist,
        homepage,
    ],
}
