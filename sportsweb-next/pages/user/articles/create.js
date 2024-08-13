import SessionHelper from "../../../src/helper/session";
import UserArticleCreate from "../../../src/components/user/user-articles/user-article-create";

const CreateArticlePage = (props) => {
  return <UserArticleCreate />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default CreateArticlePage;
