import UserSearch from "../../src/components/user/user-search";
import SessionHelper from "../../src/helper/session";

const SearchPage = () => {
  return <UserSearch />;
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default SearchPage;