import { useRouter } from "next/router";
import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import ServiceIndex from "../../src/components/market-place/service/service-index";

const ServiceIndexPage = () => {
  const router = useRouter();
  const { serviceId } = router.query;

  return (
    <UserLayout>
      <ServiceIndex serviceId={serviceId} />
    </UserLayout>
  );
};
export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default ServiceIndexPage;
