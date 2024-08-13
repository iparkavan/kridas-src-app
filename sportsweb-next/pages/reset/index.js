import ForgotPassword from "../../src/components/auth/forgot-password";
import SessionHelper from "../../src/helper/session";

const ForgotPasswordPage = () => {
  return <ForgotPassword />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForUnAuntenticatedPage(context);
}

export default ForgotPasswordPage;
