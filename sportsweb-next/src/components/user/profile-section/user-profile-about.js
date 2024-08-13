import { VStack } from "@chakra-ui/react";

import ViewUserDetails from "./view-user-details";
import ViewUserSocial from "./view-user-social";
import ViewUserCareer from "./view-user-career";
import ViewUserStatistics from "./view-user-statistics";
import ViewUserInterests from "./view-user-interests";
import ViewUserBio from "./view-user-bio";

const UserProfileAbout = (props) => {
  const { currentUser, userData } = props;

  return (
    <VStack spacing={6}>
      <ViewUserDetails
        userData={userData}
        type={currentUser ? "private" : "public"}
      />
      <ViewUserBio userData={userData} />
      {currentUser && <ViewUserSocial socials={userData?.["social"]} />}
      <ViewUserCareer userData={userData} />
      <ViewUserStatistics
        userData={userData}
        type={currentUser ? "private" : "public"}
      />
      <ViewUserInterests sportsInterested={userData["sports_interested"]} />
    </VStack>
  );
};

export default UserProfileAbout;
