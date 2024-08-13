import { Button, VStack } from "@chakra-ui/react";
import { useUser } from "../../../hooks/user-hooks";
import ViewUserInterests from "./view-user-interests";

const UserProfileInterests = ({ setMode }) => {
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

        <ViewUserInterests sportsInterested={userData["sports_interested"]} />
      </VStack>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  return "Loading...";
};

export default UserProfileInterests;
