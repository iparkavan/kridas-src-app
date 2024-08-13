import { useRouter } from "next/router";
import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import EventRegister from "../../src/components/events/register/event-register";

const EventRegisterPage = () => {
  const router = useRouter();
  const { eventId } = router.query;

  return (
    <UserLayout>
      <EventRegister eventId={eventId} />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default EventRegisterPage;
