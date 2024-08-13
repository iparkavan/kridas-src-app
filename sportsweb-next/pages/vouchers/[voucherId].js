import { useRouter } from "next/router";
import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import VoucherIndex from "../../src/components/market-place/voucher/voucher-index";

const Voucher = () => {
  const router = useRouter();
  const { voucherId } = router.query;

  return (
    <UserLayout>
      <VoucherIndex voucherId={voucherId} />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default Voucher;
