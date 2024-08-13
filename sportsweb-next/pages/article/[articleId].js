import UserArticleView from "../../src/components/user/user-articles/user-article-view";
import SessionHelper from "../../src/helper/session";

const ViewArticle = () => {
  return (
<UserArticleView />
  );
};
export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default ViewArticle;
