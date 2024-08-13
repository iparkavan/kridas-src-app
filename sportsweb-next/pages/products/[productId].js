import { useRouter } from "next/router";
import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import ProductIndex from "../../src/components/market-place/product/product-index";

const ProductIndexPage = () => {
  const router = useRouter();
  const { productId } = router.query;

  return (
    <UserLayout>
      <ProductIndex productId={productId} />
    </UserLayout>
  );
};
export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default ProductIndexPage;
