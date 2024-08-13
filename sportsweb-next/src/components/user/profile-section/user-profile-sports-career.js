import { useState } from "react";
import { Button, VStack } from "@chakra-ui/react";

import { useUser } from "../../../hooks/user-hooks";
import { useUserStatistics } from "../../../hooks/user-statistics-hooks";
import UserProfileEditCareer from "./user-profile-edit-career";
import ViewUserCareer from "./view-user-career";

const UserProfileSportsCareer = ({ mode, setMode }) => {
  const { data: userData = {} } = useUser();
  const { data: statisticsData = [] } = useUserStatistics(
    userData?.["user_id"]
  );

  const [statisticData, setStatisticData] = useState(null);

  if (mode === "edit") {
    return (
      <UserProfileEditCareer setMode={setMode} statistic={statisticData} />
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
        + Add Career
      </Button>

      <ViewUserCareer
        statisticsData={statisticsData}
        type="private"
        handleEdit={handleEdit}
      />
    </VStack>
  );
};

export default UserProfileSportsCareer;
