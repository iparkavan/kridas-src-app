import SessionHelper from "../../src/helper/session";
import OrderPayment from "../../src/components/checkout/order-payment";

const OrderPaymentPage = () => {
  return <OrderPayment />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default OrderPaymentPage;
