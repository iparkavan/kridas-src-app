import { Button, VStack } from "@chakra-ui/react";

import { useUser } from "../../../hooks/user-hooks";
import ViewUserDetails from "./view-user-details";

const UserProfileBasicDetail = ({ setMode, type }) => {
  const { data: userData, error } = useUser();

  if (userData) {
    return (
      <VStack alignItems="flex-start" spacing={6} width="full">
        <Button
          colorScheme="primary"
          variant="outline"
          onClick={() => setMode("edit")}
        >
          Edit
        </Button>

        <ViewUserDetails userData={userData} type={type} />
      </VStack>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  return "Loading...";
};

export default UserProfileBasicDetail;
