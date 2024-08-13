import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import ServicesListing from "../../src/components/market-place/service/services-listing";

const ServicesPage = () => {
  return (
    <UserLayout>
      <ServicesListing />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default ServicesPage;
