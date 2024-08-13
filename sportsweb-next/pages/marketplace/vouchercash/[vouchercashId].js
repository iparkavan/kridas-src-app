import UserLayout from "../../../src/components/layout/user-layout/user-layout";
import VoucherCash from "../../../src/components/market-place/product/VoucherCash";
import SessionHelper from "../../../src/helper/session";

const Index = () => {
  return (
    <UserLayout>
      <VoucherCash />
    </UserLayout>
  );
};
export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default Index;
