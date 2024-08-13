import UserLayout from "../../../src/components/layout/user-layout/user-layout";
import UserActivityList from "../../../src/components/user/user-activity/user-activity-list";
import SessionHelper from "../../../src/helper/session";

const UserActivity = (props) => {
  return (
    <UserLayout>
      <UserActivityList />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default UserActivity;
