import {
  Image,
  VStack,
  HStack,
  Box,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  useDisclosure,
  BreadcrumbLink,
  CircularProgress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Skeleton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import VerifyProfileCompleteModal from "../../../src/components/common/user-pages-verification-workflow/user-pages-verify-profilecomplete";
import VerifyProfileIncompleteModal from "../../../src/components/common/user-pages-verification-workflow/user-pages-verify-profileincomplete";
import { useRef, useState } from "react";
import { useInfinitePages, usePage } from "../../hooks/page-hooks";
import { useInfiniteUserPages } from "../../hooks/page-hooks";
import UserLayout from "../layout/user-layout/user-layout";
import { useUser } from "../../hooks/user-hooks";
import routes from "../../helper/constants/route-constants";
import { useIntersectionObserver } from "../../hooks/common-hooks";
import { verifyPage } from "../../../src/helper/constants/page-constants";
import { usePageStatistics } from "../../../src/hooks/page-statistics-hooks";
import { HeadingMedium } from "../ui/heading/heading";
import { TextSmall, TextXtraSmall } from "../ui/text/text";
import { PageIcon, EditIcon, BadgeIcon } from "../ui/icons";
import UserPagesList from "./user-pages/userwise-pages-list";
import AllPagesList from "./user-pages/all-pages-list";
import Button from "../ui/button";

const UserPages = () => {
  const router = useRouter();
  const { data: userData = {} } = useUser();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);
  const { data: pagesData = [], isLoading: userPagesLoading } =
    useInfiniteUserPages(userData["user_id"]);
  const { data: pagesAll = [], isLoading: allPagesLoading } =
    useInfinitePages();
  const selectedTab = {
    borderBottom: "solid",
    borderColor: "primary.500",
    color: "white",
    bg: "#3182CE",
    borderRadius: "5px",
  };
  const allPagesCount = pagesAll?.pages && pagesAll?.pages[0]?.totalCount;
  const userPagesCount = pagesData?.pages && pagesData?.pages[0]?.totalCount;
  return (
    <UserLayout>
      <Box p={0}>
        <HStack justify="space-between">
          <Breadcrumb separator=">">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={routes.profile(userData["user_name"])}
                color="#2F80ED"
              >
                {userData["full_name"]}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Pages</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Button
            display={{ base: "inherit", lg: "none" }}
            onClick={() => router.push("/user/create-page")}
            leftIcon={<PageIcon />}
            minW="auto"
          >
            Create Page
          </Button>
        </HStack>

        {/* <Tabs
          isLazy
          w="full"
          bgColor="white"
          borderRadius={10}
          p={3}
          defaultIndex={1}
        >
          <TabList mb="1em" gap={[2, 6, 12]}>
            <Tab
              w="max-content"
              fontWeight="500"
              color="#515365"
              fontSize="16"
              _selected={selectedTab}
              _focus={{ boxShadow: "none" }}
            >
              My Pages {userPagesCount>0 && `(${userPagesCount})`}
            </Tab>
            <Tab
              w="max-content"
              fontWeight="500"
              color="#515365"
              fontSize="16"
              _selected={selectedTab}
              _focus={{ boxShadow: "none" }}
            >
              All Pages {allPagesCount && `(${allPagesCount})`}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={2}>
              <UserPagesList userId={userData?.user_id} pageId={pageId} />
            </TabPanel>
            <TabPanel p={2}>
              <AllPagesList pagesCount={allPagesCount} />
            </TabPanel>
          </TabPanels>
        </Tabs> */}
        <AllPagesList pagesCount={allPagesCount} />
      </Box>
    </UserLayout>
  );
};

export default UserPages;
