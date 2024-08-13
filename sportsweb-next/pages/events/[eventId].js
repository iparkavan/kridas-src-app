import SessionHelper from "../../src/helper/session";
import EventIndex from "../../src/components/pages/page-event/event-index";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
const ViewEvent = () => {
  return (
    <UserLayout>
      <EventIndex />
    </UserLayout>
  );
};
export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default ViewEvent;
