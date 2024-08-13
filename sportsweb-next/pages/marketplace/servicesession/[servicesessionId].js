import SessionHelper from "../../../src/helper/session";

import UserLayout from "../../../src/components/layout/user-layout/user-layout";
import ServicePage from "../../../src/components/market-place/service/ServicePage"





const Index = () => {
  return (
    <UserLayout>
      <ServicePage />
    </UserLayout>
  );
};
export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default Index;
