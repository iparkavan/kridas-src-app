import { useState } from "react";
import { Button, VStack } from "@chakra-ui/react";

import { useUser } from "../../../hooks/user-hooks";
import { useUserStatistics } from "../../../hooks/user-statistics-hooks";
import UserProfileEditStatistics from "./user-profile-edit-statistics";
import ViewUserStatistics from "./view-user-statistics";

const UserProfileStatistics = ({ mode, setMode }) => {
  const { data: userData = {} } = useUser();
  const { data: statisticsData = [] } = useUserStatistics(
    userData?.["user_id"]
  );

  const [statisticData, setStatisticData] = useState(null);

  if (mode === "edit") {
    return (
      <UserProfileEditStatistics setMode={setMode} statistic={statisticData} />
    );
  }

  const handleEdit = (statistic = null) => {
    setStatisticData(statistic);
    setMode("edit");
  };

  return (
    <VStack alignItems="flex-start" spacing={6} width="full">
      <Button
        colorScheme="primary"
        variant="outline"
        onClick={() => handleEdit()}
      >
        + Add Sport
      </Button>

      <ViewUserStatistics
        statisticsData={statisticsData}
        type="private"
        handleEdit={handleEdit}
      />
    </VStack>
  );
};

export default UserProfileStatistics;
