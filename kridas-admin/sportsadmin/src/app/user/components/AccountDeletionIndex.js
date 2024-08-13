import React from "react";
import PageContainer from "../../common/layout/components/PageContainer";
import UserAccountDeletion from "./userStatistics/UserAccountDeletion";

const AccountDeletionIndex = () => {
  return (
    <PageContainer heading="Account Deletion">
      <UserAccountDeletion />
    </PageContainer>
  );
};

export default AccountDeletionIndex;
