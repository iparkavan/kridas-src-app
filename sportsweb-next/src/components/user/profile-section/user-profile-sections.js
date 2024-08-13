import {
  Box,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useState } from "react";

import {
  BioIcon,
  CareerIcon,
  CategoryIcon,
  HeartIcon,
  KeyIcon,
  PersonCircleIcon,
  TrophyIcon,
} from "../../ui/icons";
import UserProfileBasicDetail from "./user-profile-basic-detail";
import UserProfileEditDetails from "./user-profile-edit-details";
import UserProfileEditInterests from "./user-profile-edit-interests";
import UserProfileEditSocial from "./user-profile-edit-social";
import UserProfileInterests from "./user-profile-interests";
import UserProfilePassword from "./user-profile-password";
import UserProfileSocial from "./user-profile-social";
import UserProfileTab from "./user-profile-tab";
import UserProfileStatistics from "./user-profile-statistics";
import UserProfileSportsCareer from "./user-profile-sports-career";
import UserProfileBio from "./user-profile-bio";
import UserProfileEditBio from "./user-profile-edit-bio";
import { useUser } from "../../../hooks/user-hooks";
import { useUserStatistics } from "../../../hooks/user-statistics-hooks";

const UserProfileSections = ({ type }) => {
  const [mode, setMode] = useState("view");
  const { data: userData = {} } = useUser();
  const { data: statisticsData = {} } = useUserStatistics(userData["user_id"]);
  const [tabIndex, setTabIndex] = useState(0);

  const getMode = (index) => {
    switch (index) {
      case 1:
        return userData?.["bio_details"] ? "view" : "edit";
      case 2:
        return userData?.social?.length > 0 ? "view" : "edit";
      case 3:
        const isCareerPresent = statisticsData?.some(
          (statistic) => statistic["sport_career"]?.length > 0
        );
        return isCareerPresent ? "view" : "edit";
      case 4:
        const isStatisticsPresent = statisticsData?.some(
          (statistic) => statistic["skill_level"] && statistic["playing_status"]
        );
        return isStatisticsPresent ? "view" : "edit";
      case 5:
        return userData?.["sports_interested"]?.length > 0 ? "view" : "edit";
      default:
        return "view";
    }
  };

  return (
    <Box
      w="100%"
      // bg={useColorModeValue("white", "gray.800")}
      // boxShadow={"2xl"}
      rounded={"md"}
      overflow={"hidden"}
    >
      <Tabs
        padding={0}
        orientation="vertical"
        variant="unstyled"
        index={tabIndex}
        onChange={(e) => {
          const mode = getMode(e);
          setMode(mode);
          setTabIndex(e);
        }}
        isLazy
      >
        <TabList width="30%">
          <UserProfileTab tabIcon={PersonCircleIcon}>Basic Info</UserProfileTab>
          <UserProfileTab tabIcon={BioIcon}>Bio</UserProfileTab>
          <UserProfileTab tabIcon={HeartIcon}>Social Presence</UserProfileTab>
          <UserProfileTab tabIcon={CareerIcon}>Sports Career</UserProfileTab>
          <UserProfileTab tabIcon={TrophyIcon}>
            Sports Statistics
          </UserProfileTab>
          <UserProfileTab tabIcon={CategoryIcon}>
            Sports Interested
          </UserProfileTab>
          <UserProfileTab tabIcon={KeyIcon}>Password Settings</UserProfileTab>
        </TabList>

        <TabPanels
          width="full"
          bg={useColorModeValue("white", "gray.800")}
          px={3}
        >
          <TabPanel>
            {mode === "view" ? (
              <UserProfileBasicDetail setMode={setMode} type={type} />
            ) : (
              <UserProfileEditDetails setMode={setMode} />
            )}
          </TabPanel>
          <TabPanel>
            {mode === "view" ? (
              <UserProfileBio setMode={setMode} />
            ) : (
              <UserProfileEditBio setMode={setMode} />
            )}
          </TabPanel>
          <TabPanel>
            {mode === "view" ? (
              <UserProfileSocial setMode={setMode} />
            ) : (
              <UserProfileEditSocial setMode={setMode} />
            )}
          </TabPanel>
          <TabPanel>
            <UserProfileSportsCareer mode={mode} setMode={setMode} />
          </TabPanel>
          <TabPanel>
            <UserProfileStatistics mode={mode} setMode={setMode} />
          </TabPanel>
          <TabPanel>
            {mode === "view" ? (
              <UserProfileInterests setMode={setMode} />
            ) : (
              <UserProfileEditInterests setMode={setMode} />
            )}
          </TabPanel>
          <TabPanel>
            <UserProfilePassword />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default UserProfileSections;
