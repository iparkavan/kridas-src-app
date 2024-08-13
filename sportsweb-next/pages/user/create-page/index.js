import UserLayout from "../../../src/components/layout/user-layout/user-layout";
import UserPagesCreate from "../../../src/components/user/user-pages/user-pages-create";
import SessionHelper from "../../../src/helper/session";

const UserCreatePage = () => {
  return (
    <UserLayout>
      <UserPagesCreate />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default UserCreatePage;
