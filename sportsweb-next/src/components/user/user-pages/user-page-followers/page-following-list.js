import { HStack } from "@chakra-ui/react";
import { TextMedium } from "../../../ui/text/text";
import UserCard from "../../profile-section/user-card";
import PageCard from "../../../pages/profile-section/page-card";

const PageFollowingList = (props) => {
  const { pageFollowersData } = props;

  return (
    <HStack wrap="wrap" justifyContent="flex-start">
      {pageFollowersData?.companyFollowing?.length !== 0 ? (
        pageFollowersData?.companyFollowing?.map((following) =>
          following.type === "U" ? (
            <UserCard key={following.id} cardData={following} />
          ) : (
            <PageCard key={following.id} cardData={following} />
          )
        )
      ) : (
        <TextMedium>No Following to display</TextMedium>
      )}
    </HStack>
  );
};

export default PageFollowingList;
