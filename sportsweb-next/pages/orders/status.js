import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import OrderPaymentStatus from "../../src/components/orders/order-payment-status";

const OrderStatusPage = () => {
  return (
    <UserLayout>
      <OrderPaymentStatus />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default OrderStatusPage;
