import {
  AccordionPanel,
  Box,
  Circle,
  CircularProgress,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { HeadingMedium } from "../../ui/heading/heading";
import { useUser } from "../../../hooks/user-hooks";
import LabelText from "../../ui/text/label-text";
import { TextMedium, TextSmall, TextXtraSmall } from "../../ui/text/text";
// import useUserActivity from "../../../hooks/activity-hook";
import { format } from "date-fns";
import helper from "../../../helper/helper";
// import { useActivityInfiniteByType } from "../../../hooks/activity-hooks";

import Skeleton from "../../ui/skeleton";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import { useRouter } from "next/router";
import routes from "../../../helper/constants/route-constants";
import { useActivityInfiniteByType } from "../../../hooks/activity-hook";
import { Accordion, AccordionButton, AccordionItem } from "../../ui/accordion";
import ActivityInteraction from "./user-activity-interaction";
import ActivityTag from "./user-activity-tag";
import ActivityConnection from "./user-activity-connection";
import ActivityShare from "./user-activity-share";
import { Connection, Interaction, Share, Tag } from "../../ui/icons";
// import TbLayersIntersect from "react-icons/tb";
import {
  AiOutlineDiff,
  AiOutlineFolderView,
  AiOutlineKey,
} from "react-icons/ai";
import { BsSignpost } from "react-icons/bs";
import UserLogsActivity from "./user-activity-logs";
import ActivityPosts from "./user-activity-posts";
import ActivityViews from "./user-activity-views";
import { PhoneIcon } from "@chakra-ui/icons";
import UserActivityOthers from "./user-activity-others";

// import routes from "../../helper/constants/route-constants";

function UserActivityList() {
  const { data: userData = {} } = useUser();

  //   const { data: activityData = [] } = useUserActivity(userData["user_id"], "U");

  return (
    <>
      <VStack p={[0, 2, 3]} align={"flex-start"}>
        <HeadingMedium color="#4a4d51" fontSize="24px" mb={3}>
          Activity Logs
        </HeadingMedium>
        <Box bg="white" w="full" p={4} borderRadius={"10px"}>
          <VStack
            w="full"
            p={[4, 5, 8]}
            // p={4}
            border={"1px solid #e6ecf5"}
            align={"flex-start"}
          >
            <Accordion defaultIndex={[0]} allowToggle w="full">
              <AccordionItem>
                <AccordionButton>
                  <HStack gap={1}>
                    <Interaction />
                    <TextMedium>Interactions</TextMedium>
                    <TextXtraSmall>
                      (Likes and Reactions, Comments)
                    </TextXtraSmall>
                  </HStack>
                </AccordionButton>
                <AccordionPanel p={5}>
                  <ActivityInteraction />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <HStack gap={1}>
                    <Tag />
                    <TextMedium>Tags</TextMedium>
                    <TextXtraSmall>(Post tags and Comment tags)</TextXtraSmall>
                  </HStack>
                </AccordionButton>
                <AccordionPanel p={5}>
                  <ActivityTag />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <HStack gap={1}>
                    <Connection />
                    <TextMedium>Connectivity Logs</TextMedium>
                    <TextXtraSmall>(Follow and Unfollow)</TextXtraSmall>
                  </HStack>
                </AccordionButton>
                <AccordionPanel p={5} overflow="auto">
                  <ActivityConnection />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <HStack gap={1}>
                    <Share />
                    <TextMedium>Shares</TextMedium>
                    <TextXtraSmall>(Shared feeds)</TextXtraSmall>
                  </HStack>
                </AccordionButton>
                <AccordionPanel p={5}>
                  <ActivityShare />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <HStack gap={1}>
                    <AiOutlineKey />
                    <TextMedium>User Logs</TextMedium>
                    <TextXtraSmall>(LogIn and LogOut)</TextXtraSmall>
                  </HStack>
                </AccordionButton>
                <AccordionPanel p={5} overflow="auto">
                  <UserLogsActivity />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <HStack gap={1}>
                    <BsSignpost />
                    <TextMedium>Post Logs</TextMedium>
                    <TextXtraSmall>(Feeds)</TextXtraSmall>
                  </HStack>
                </AccordionButton>
                <AccordionPanel p={5} overflow="auto">
                  <ActivityPosts />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <HStack gap={1}>
                    <AiOutlineFolderView />
                    <TextMedium>Views</TextMedium>
                    <TextXtraSmall>
                      (Events,Articles,Pages and Users)
                    </TextXtraSmall>
                  </HStack>
                </AccordionButton>
                <AccordionPanel p={5} overflow="auto">
                  <ActivityViews />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <HStack gap={1}>
                    <AiOutlineDiff />
                    <TextMedium>Others</TextMedium>
                    <TextXtraSmall>(Edit and Publish)</TextXtraSmall>
                  </HStack>
                </AccordionButton>
                <AccordionPanel p={5} overflow="auto">
                  <UserActivityOthers />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
        </Box>
      </VStack>
    </>
  );
}

export default UserActivityList;
