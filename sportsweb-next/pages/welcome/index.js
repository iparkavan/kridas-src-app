import UserWelcome from "../../src/components/user/user-welcome";
import routes from "../../src/helper/constants/route-constants";
import SessionHelper from "../../src/helper/session";

const WelcomePage = () => {
  return <UserWelcome />;
};

export async function getServerSideProps(context) {
  const sessionProps = await SessionHelper.checkSessionForAuthenicatedPage(
    context
  );
  if (
    sessionProps.hasOwnProperty("props") &&
    !sessionProps?.props?.sessionData?.user?.isNewUser
  ) {
    return {
      redirect: { destination: routes.home, permanent: false },
    };
  }
  return sessionProps;
}

export default WelcomePage;
