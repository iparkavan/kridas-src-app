import { HStack } from "@chakra-ui/react";
import { TextMedium } from "../../../ui/text/text";
import UserCard from "../../../common/follow-card";


const PageFollowerList = (props) => {
  const { pageFollowersData } = props;

  return (
    <HStack wrap="wrap" justifyContent="flex-start">
      {pageFollowersData?.companyFollower?.length !== 0 ? (
        pageFollowersData?.companyFollower?.map((follower) => (
          <UserCard key={follower.id} cardData={follower} />
        ))
      ) : (
        <TextMedium>No Followers to display</TextMedium>
      )}
    </HStack>
  );
};

export default PageFollowerList;
