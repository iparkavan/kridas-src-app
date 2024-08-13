import UserEvents from "../../../src/components/user/user-events";
import SessionHelper from "../../../src/helper/session";

const UserEventsPage = () => {
  return <UserEvents />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default UserEventsPage;
