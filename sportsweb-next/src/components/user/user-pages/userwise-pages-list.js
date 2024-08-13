import {
  Button,
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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Skeleton from "../../ui/skeleton";
import VerifyProfileCompleteModal from "../../../../src/components/common/user-pages-verification-workflow/user-pages-verify-profilecomplete";
import VerifyProfileIncompleteModal from "../../../../src/components/common/user-pages-verification-workflow/user-pages-verify-profileincomplete";
import { useRef, useState } from "react";
import { useInfiniteUserPages } from "../../../hooks/page-hooks";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import {
  getPageType,
  verifyPage,
} from "../../../../src/helper/constants/page-constants";
import { usePageStatistics } from "../../../../src/hooks/page-statistics-hooks";
import { HeadingMedium } from "../../ui/heading/heading";
import { TextSmall, TextXtraSmall } from "../../ui/text/text";
import { PageIcon, EditIcon, BadgeIcon } from "../../ui/icons";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";

function UserPagesList({ userId, pageId }) {
  const router = useRouter();
  const {
    data: pagesData = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteUserPages(userId);
  const loadMoreRef = useRef();
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isVerifyModalOpen,
    onOpen: onVerifyModalOpen,
    onClose: onVerifyModalClose,
  } = useDisclosure();
  const { data: pageStatisticsData = [] } = usePageStatistics(pageId);
  const [isProfileDetailsFilled, setIsProfileDetailsFilled] = useState(false);

  const handleVerification = (pageData, pageStatisticsData) => {
    const { isProfileComplete, percentage } = verifyPage(
      pageData,
      pageStatisticsData
    );
    setIsProfileDetailsFilled(isProfileComplete);
    onVerifyModalOpen();
  };
  const pagesCount = pagesData?.pages?.[0]?.totalCount;
  if (isLoading) return <Skeleton></Skeleton>;
  else
    return (
      <>
        {pagesData ? (
          <Box p={pagesCount > 0 ? 2 : 0}>
            <VStack
              mt={pagesCount > 0 ? 5 : 0}
              spacing={8}
              alignItems="stretch"
              minH="100vh"
            >
              {pagesData?.pages?.[0]?.totalCount !== 0 ? (
                pagesData?.pages?.map((page) => {
                  return page?.content?.map((pageData) => {
                    const { isParentPage, isChildPage, isSubTeamPage } =
                      getPageType(pageData);
                    return (
                      <Box
                        key={pageData?.["company_id"]}
                        backgroundColor="white"
                        borderRadius="10px"
                        position="relative"
                      >
                        <Image
                          src={
                            pageData?.["company_img"] || "/images/cardImage.png"
                          }
                          alt="Card Image"
                          objectFit="cover"
                          h={"120px"}
                          width="100%"
                          borderTopRadius="10px"
                        />
                        <Button
                          variant="outline"
                          colorScheme="primary"
                          backgroundColor="white"
                          position="absolute"
                          top="20px"
                          right="20px"
                          onClick={() =>
                            router.push(
                              `/edit-page/${pageData?.["company_id"]}`
                            )
                          }
                          leftIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                        <Box
                          p={5}
                          border="1px solid gray"
                          borderBottomRadius={10}
                        >
                          <HStack
                            justify="space-between"
                            alignItems="flex-start"
                          >
                            <VStack alignItems="flex-start">
                              <HeadingMedium
                                onClick={() =>
                                  router.push(
                                    `/page/${pageData?.["company_id"]}?tab=home`
                                  )
                                }
                                cursor="pointer"
                              >
                                {pageData?.["company_name"]}
                              </HeadingMedium>
                              <HStack spacing={5}>
                                {isParentPage && (
                                  <TextXtraSmall>
                                    {pageData?.["parent_category_name"]}
                                    {pageData?.["category_name_arr"]?.length >
                                      0 && (
                                      <>
                                        {" "}
                                        (
                                        {pageData["category_name_arr"].map(
                                          (subCategory, index) => {
                                            const str = subCategory;
                                            if (
                                              index !==
                                              pageData["category_name_arr"]
                                                ?.length -
                                                1
                                            ) {
                                              str += ", ";
                                            }
                                            return str;
                                          }
                                        )}
                                        )
                                      </>
                                    )}
                                  </TextXtraSmall>
                                )}
                                {(isChildPage || isSubTeamPage) && (
                                  <TextXtraSmall>
                                    {pageData?.["category_name_arr"]?.length >
                                      0 &&
                                      pageData["category_name_arr"].map(
                                        (subCategory, index) => {
                                          const str = subCategory;
                                          if (
                                            index !==
                                            pageData["category_name_arr"]
                                              ?.length -
                                              1
                                          ) {
                                            str += ", ";
                                          }
                                          return str;
                                        }
                                      )}{" "}
                                    ({pageData?.["parent_category_name"]})
                                  </TextXtraSmall>
                                )}

                                <TextXtraSmall>
                                  {pageData?.address?.city}
                                  {pageData?.address?.state && ","}{" "}
                                  {pageData?.address?.state}
                                </TextXtraSmall>
                              </HStack>
                              <TextSmall>
                                {pageData?.["company_desc"]}
                              </TextSmall>
                            </VStack>
                            {/* <Button
                            variant="outline"
                            colorScheme="primary"
                            onClick={(onVerifyModalOpen) =>
                              handleVerification(pageData, pageStatisticsData)
                            }
                            leftIcon={<BadgeIcon />}
                          >
                            Request Verification
                          </Button> */}
                            {isProfileDetailsFilled ? (
                              <VerifyProfileCompleteModal
                                isOpen={isVerifyModalOpen}
                                onClose={onVerifyModalClose}
                                type="page"
                              />
                            ) : (
                              <VerifyProfileIncompleteModal
                                isOpen={isVerifyModalOpen}
                                onClose={onVerifyModalClose}
                                name={pageData?.company_name}
                              />
                            )}
                          </HStack>
                          <HStack mt={5} spacing={5}>
                            <TextSmall>
                              {pageData?.["follower_count"]} Followers
                            </TextSmall>
                            <TextSmall>
                              {pageData?.["image_count"]} Photos
                            </TextSmall>
                            <TextSmall>
                              {pageData?.["video_count"]} Videos
                            </TextSmall>
                          </HStack>
                        </Box>
                      </Box>
                    );
                  });
                })
              ) : (
                <Box bgColor="white" px={5} py={3} borderRadius={10}>
                  <EmptyContentDisplay displayText="No Pages to Display" />
                </Box>
              )}
              {isFetchingNextPage && (
                <CircularProgress
                  alignSelf="center"
                  isIndeterminate
                  size="24px"
                />
              )}
            </VStack>
            <span ref={loadMoreRef} />
          </Box>
        ) : error ? (
          "An error has occurred: " + error.message
        ) : (
          "Loading..."
        )}
      </>
    );
}

export default UserPagesList;
