import PageIndex from "../../src/components/pages/page-index";
import SessionHelper from "../../src/helper/session";
// import { fetchWooCommerceProducts } from "../../src/services/old-product-service";

const PageProfilePage = (props) => {
  // const { products } = props;
  // return <PageIndex products={products} />;
  return <PageIndex />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
  // const sessionProps = await SessionHelper.checkSessionForAuthenicatedPage(
  //   context
  // );
  // const wooCommerceProducts = await fetchWooCommerceProducts().catch((error) =>
  //   console.error(error)
  // );

  // if (!wooCommerceProducts) {
  //   return {
  //     ...sessionProps,
  //   };
  // }
  // return {
  //   ...sessionProps,
  //   props: { ...sessionProps.props, products: wooCommerceProducts.data },
  // };
}

export default PageProfilePage;
