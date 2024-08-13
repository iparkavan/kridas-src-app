import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// initialise the WooCommerceRestApi //
// const api = new WooCommerceRestApi({
//   url: "https://shop.kridas.com/index.php/",
//   consumerKey: process.env.WOOCOMMERCE_KEY,
//   consumerSecret: process.env.WOOCOMMERCE_SECRET,
//   // wpAPI: true,
//   version: "wc/v3",
//   // queryStringAuth: true,
// });

// fetch all products from WooCommerce //
export async function fetchWooCommerceProducts() {
  try {
    const api = new WooCommerceRestApi({
      url: "https://shop.kridas.com/index.php/",
      consumerKey: "ck_ab8455bc0d132a9e94d1deefaba01eeb2d2ae654",
      consumerSecret: "cs_d0b2de21cf7be8d40219bb0df721345a957e3a06",
      // wpAPI: true,
      version: "wc/v3",
      // queryStringAuth: true,
    });

    const response = await api.get("products");

    return response;
  } catch (error) {
    console.log("error", error);
    // throw new Error(error);
  }
}
