import UserArticles from "../../../src/components/user/user-articles";
import SessionHelper from "../../../src/helper/session";

const UserArticlePage = (props) => {
  return <UserArticles />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default UserArticlePage;
