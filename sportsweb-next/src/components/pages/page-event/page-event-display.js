import {
  Box,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { useEventsByCompanyId } from "../../../hooks/event-hook";
import PageEventCreate from "./page-event-create";
import PageEventCreateButton from "./page-event-createButton";
import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import PageEventList from "./pagewise-events-list";
import { HeadingMedium } from "../../ui/heading/heading";

function PageEventDisplay({ currentPage, pageType }) {
  const selectedTab = {
    borderBottom: "solid",
    borderColor: "primary.500",
    color: "white",
    bg: "#3182CE",
    borderRadius: "5px",
  };
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageEvents = [], isLoading } = useEventsByCompanyId(pageId);
  const pageEventCount = pageEvents?.pages && pageEvents?.pages[0]?.totalCount;
  return (
    <VStack align="stretch" spacing={4}>
      {currentPage ? (
        <PageEventCreateButton />
      ) : (
        <HeadingMedium bg="white" p={4} borderRadius={"10px"}>
          Events
        </HeadingMedium>
      )}
      <PageEventList
        pageEventCount={pageEventCount}
        currentPage={currentPage}
        pageType={pageType}
      />
    </VStack>
  );
}

export default PageEventDisplay;
