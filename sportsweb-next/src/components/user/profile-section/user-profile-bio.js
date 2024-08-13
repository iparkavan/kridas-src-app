import { Button, Divider, HStack, VStack, Icon } from "@chakra-ui/react";

import { BioIcon } from "../../ui/icons";
import { useUser } from "../../../hooks/user-hooks";
import { HeadingMedium } from "../../ui/heading/heading";
import LabelValuePair from "../../ui/label-value-pair";
import { useSports } from "../../../hooks/sports-hooks";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";

const UserProfileBio = ({ setMode }) => {
  const { data: userData, error } = useUser();
  const { data: sportsData = [] } = useSports({}, true);
  const { data: professionData = [] } = useLookupTable("PRF");

  const sportName = sportsData.find(
    (sport) => sport["sports_id"] == userData?.["bio_details"]?.["sports_id"]
  )?.["sports_name"];

  const professionName = professionData.find(
    (profession) =>
      profession["lookup_key"] === userData?.["bio_details"]?.["profession"]
  )?.["lookup_value"];

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
        <HStack spacing={4} alignItems="flex-start" width="full">
          <Icon as={BioIcon} w="6" h="6" />
          <VStack alignItems="flex-start" width="full" spacing={6}>
            <HeadingMedium>Bio</HeadingMedium>
            <Divider borderColor="gray.300" />

            <LabelValuePair label="Sport">{sportName}</LabelValuePair>
            <LabelValuePair label="Player / Profession">
              {professionName}
            </LabelValuePair>
            <LabelValuePair label="Description">
              {userData?.["bio_details"]?.description}
            </LabelValuePair>
          </VStack>
        </HStack>
      </VStack>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  return "Loading...";
};

export default UserProfileBio;
