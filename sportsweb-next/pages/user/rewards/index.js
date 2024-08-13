import UserLayout from "../../../src/components/layout/user-layout/user-layout";
import RewardsIndex from "../../../src/components/user/user-rewards/rewards-index";
import SessionHelper from "../../../src/helper/session";

const Rewards = () => {
  return (
    <UserLayout>
      <RewardsIndex />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default Rewards;
