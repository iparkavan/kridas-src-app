import LandingLayout from "../../src/components/auth/landing-layout";
import SessionHelper from "../../src/helper/session";

const RegisterPage = () => {
  return <LandingLayout />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForUnAuntenticatedPage(context);
}

export default RegisterPage;
