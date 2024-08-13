import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import CheckOutIndex from "../../src/components/checkout/checkout-index";

const CheckoutPage = () => {
  return (
    <UserLayout>
      <CheckOutIndex />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default CheckoutPage;
