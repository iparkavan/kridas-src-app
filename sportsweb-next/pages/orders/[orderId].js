import { useRouter } from "next/router";
import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import OrderDetails from "../../src/components/orders/order-details";

const OrderDetailsPage = () => {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <UserLayout>
      <OrderDetails orderId={orderId} />
    </UserLayout>
  );
};
export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default OrderDetailsPage;
