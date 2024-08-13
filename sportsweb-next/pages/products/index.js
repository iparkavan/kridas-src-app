import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import ProductsListing from "../../src/components/market-place/product/products-listing";

const ProductsPage = () => {
  return (
    <UserLayout>
      <ProductsListing />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default ProductsPage;
