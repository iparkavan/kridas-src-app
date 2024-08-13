import PageContainer from "../../common/layout/components/PageContainer";

import UserList from "./UserList";

const UserIndex = (props) => {
  return (
    <PageContainer heading="All Users">
      <UserList />
    </PageContainer>
  );
};

export default UserIndex;
