import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import UserProfileEdit from "../../src/components/user/profile-section/user-profile-edit";

const EditProfile = () => {
  return (
    <UserLayout>
      <UserProfileEdit />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default EditProfile;
