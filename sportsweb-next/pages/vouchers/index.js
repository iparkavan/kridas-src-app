import SessionHelper from "../../src/helper/session";
import VouchersList from "../../src/components/vouchers/vouchers-list";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import Error from "next/error";

const VouchersPage = () => {
  return <Error statusCode={404} />;

  return (
    <UserLayout>
      <VouchersList />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default VouchersPage;
