import UserAccountSettings from "../../src/components/account-settings/user-account-settings";
import SessionHelper from "../../src/helper/session";

const AccountSettings = () => {
  return <UserAccountSettings />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default AccountSettings;
