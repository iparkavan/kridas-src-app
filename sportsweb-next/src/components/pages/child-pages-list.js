import {
  Alert,
  AlertDescription,
  AlertIcon,
  Flex,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { useChildPages } from "../../hooks/page-hooks";
import { TextMedium } from "../ui/text/text";
import PageCardView from "./page-card-view";

function ChildPagesList(props) {
  const { pageData, type, filters = {} } = props;
  let typeText, subCategory;
  if (type === "team") {
    typeText = "teams";
    subCategory = "TEA";
  } else if (type === "venue") {
    typeText = "venues";
    subCategory = "VEN";
  } else if (type === "academy") {
    typeText = "academies";
    subCategory = "ACD";
  }

  const {
    data: childPages,
    isLoading,
    isError,
    isSuccess,
  } = useChildPages({
    company_id: pageData?.["company_id"],
    type: subCategory,
    ...filters,
  });

  if (isError) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>Unable to fetch {typeText}.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Skeleton isLoaded={!isLoading} minH="24px">
      {isSuccess &&
        (childPages.length === 0 ? (
          //   .filter((page) =>
          //   Boolean(
          //     page["category_arr"].find(
          //       (cat) => cat["category_type"] === subCategory
          //     )
          //   )
          // )
          <TextMedium>{`No ${typeText} to display`}</TextMedium>
        ) : (
          // <Flex align="flex-start" w="full" flexWrap="wrap" gap={7}>
          <SimpleGrid columns={[2, null, 3]} spacing={1}>
            {childPages
              .filter((page) =>
                Boolean(
                  page["category_arr"].find(
                    (cat) => cat["category_type"] === subCategory
                  )
                )
              )
              .map((page) => (
                <PageCardView key={page["company_id"]} pageData={page} />
              ))}
          </SimpleGrid>

          // </Flex>
        ))}
    </Skeleton>
  );
}

export default ChildPagesList;
