import { useRouter } from "next/router";

import ActivateAccountOtp from "../../src/components/auth/activate-account-otp";
import SessionHelper from "../../src/helper/session";

const Activate = () => {
  const router = useRouter();
  const { email } = router.query;

  return <ActivateAccountOtp email={email} />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForUnAuntenticatedPage(context);
}

export default Activate;
