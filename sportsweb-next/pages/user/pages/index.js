import UserPages from "../../../src/components/user/user-pages";
import SessionHelper from "../../../src/helper/session";

const UserPagesPage = () => {
  return <UserPages />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default UserPagesPage;
