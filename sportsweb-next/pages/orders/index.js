import SessionHelper from "../../src/helper/session";
import OrderHistory from "../../src/components/orders/order-history";
import UserLayout from "../../src/components/layout/user-layout/user-layout";

const OrdersPage = () => {
  return (
    <UserLayout>
      <OrderHistory />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default OrdersPage;
