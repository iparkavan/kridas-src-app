import UserIndex from "../../src/components/user/user-index";
import SessionHelper from "../../src/helper/session";

const UserHomePage = () => {
  return <UserIndex />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default UserHomePage;
