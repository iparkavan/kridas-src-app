import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import CartIndex from "../../src/components/cart/cart-index";

const CartPage = () => {
  return (
    <UserLayout>
      <CartIndex />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default CartPage;
