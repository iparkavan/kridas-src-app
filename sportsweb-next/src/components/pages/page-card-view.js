import {
  Box,
  Image,
  Flex,
  Stack,
  useColorModeValue,
  Center,
  Tooltip,
  LinkOverlay,
  LinkBox,
  VStack,
  HStack,
  Avatar,
  Spacer,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { HeadingXtraSmall } from "../ui/heading/heading";
import { TextSmall, TextXtraSmall } from "../ui/text/text";
import {
  useAllCategories,
  useCategoriesByType,
} from "../../hooks/category-hooks";
import PageFollow from "./common-header-pages/PageFollow";
import NextLink from "next/link";
import { getPageType } from "../../helper/constants/page-constants";
import IconButton from "../ui/icon-button";
import { EmailIcon } from "@chakra-ui/icons";
import { useCountries } from "../../hooks/country-hooks";
import PageFollowCard from "./common-header-pages/page-follow-card";

function PageCardView({ pageData, userId }) {
  const userPages = pageData?.created_by === userId;

  const { data: countriesData = [] } = useCountries();
  const { isChildPage } = getPageType(pageData);
  const { data: allSubCategories = [] } = useAllCategories();
  const { data: parentCategories = [] } = useCategoriesByType("CAT");
  const subCategoriesNames = allSubCategories
    ?.filter(({ category_id }) => pageData?.company_type?.includes(category_id))
    ?.map(({ category_name }) => category_name);
  const parentcategoryName = parentCategories?.find(
    ({ category_id }) => pageData?.main_category_type === category_id
  )?.category_name;

  return (
    <Box w="full" p={5}>
      <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
        <LinkBox>
          <NextLink href={`/page/${pageData?.company_id}`} passHref>
            <LinkOverlay>
              <GridItem>
                <Avatar
                  size="lg"
                  name={pageData?.company_name}
                  src={
                    pageData?.company_profile_img
                      ? pageData?.company_profile_img
                      : "/images/no-banner-image-page.jpg"
                  }
                />
              </GridItem>
            </LinkOverlay>
          </NextLink>
        </LinkBox>
        <GridItem colSpan={4}>
          <LinkBox>
            <NextLink href={`/page/${pageData?.company_id}`} passHref>
              <LinkOverlay>
                <VStack align="flex-start">
                  <HeadingXtraSmall
                    wordBreak="break-word"
                    textOverflow="ellipsis"
                    maxWidth="80%"
                    isTruncated
                  >
                    <Tooltip label={pageData?.company_name} fontSize="md">
                      {pageData?.company_name}
                    </Tooltip>
                  </HeadingXtraSmall>
                  <HStack w="full" align="baseline">
                    {isChildPage ? (
                      <>
                        <TextSmall
                          color="primary.500"
                          fontWeight="500"
                          maxWidth="95%"
                          isTruncated
                        >
                          <Tooltip
                            label={subCategoriesNames.join(", ")}
                            fontSize="md"
                          >
                            {subCategoriesNames.join(", ")}
                          </Tooltip>
                        </TextSmall>
                        <TextSmall color="primary.500" fontWeight="500">
                          {"("}
                          {parentcategoryName}
                          {")"}
                        </TextSmall>
                      </>
                    ) : (
                      <>
                        <TextSmall color="primary.500" fontWeight="500">
                          {parentcategoryName}
                        </TextSmall>
                        <TextSmall
                          color="primary.500"
                          fontWeight="500"
                          maxWidth="95%"
                          isTruncated
                        >
                          {"("}
                          <Tooltip
                            label={subCategoriesNames.join(", ")}
                            fontSize="md"
                          >
                            {subCategoriesNames.join(", ")}
                          </Tooltip>
                          {")"}
                        </TextSmall>
                      </>
                    )}
                  </HStack>
                  <TextXtraSmall fontWeight="200">
                    {pageData?.address?.city}{" "}
                    {
                      countriesData
                        ?.find(
                          (c) => c["country_code"] == pageData?.address?.country
                        )
                        ?.country_states?.find(
                          (s) => s["state_code"] == pageData?.address?.state
                        )?.["state_name"]
                    }{" "}
                    {
                      countriesData?.find(
                        (c) => c["country_code"] == pageData?.address?.country
                      )?.["country_name"]
                    }
                  </TextXtraSmall>
                </VStack>
              </LinkOverlay>
            </NextLink>
          </LinkBox>
        </GridItem>

        <GridItem alignItems="flex-end">
          {userPages && <PageFollowCard pageId={pageData?.company_id} />}
        </GridItem>
      </Grid>
    </Box>
  );
}

export default PageCardView;
