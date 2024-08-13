import { HStack } from "@chakra-ui/react";
import { TextMedium } from "../../ui/text/text";
import UserCard from "../../common/follow-card";
import PageCard from "../../pages/profile-section/page-card";

const UserFollowerList = (props) => {
  const { userFollowersData } = props;

  return (
    <HStack wrap="wrap" justifyContent={{ base: "center", md: "flex-start" }}>
      {userFollowersData?.length !== 0 ? (
        userFollowersData?.map((follower) => (
          <UserCard key={follower.id} cardData={follower} />
        ))
      ) : (
        <TextMedium>No Followers to display</TextMedium>
      )}
    </HStack>
  );
};

export default UserFollowerList;
