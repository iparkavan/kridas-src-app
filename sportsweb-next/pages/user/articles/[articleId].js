import SessionHelper from "../../../src/helper/session";
import UserArticleEdit from "../../../src/components/user/user-articles/user-article-edit";

const EditArticlePage = (props) => {
  return <UserArticleEdit />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default EditArticlePage;
