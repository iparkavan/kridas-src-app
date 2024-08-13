import React from "react";
import {
  Box,
  Text,
  Center,
  Image,
  Flex,
  Stack,
  useColorModeValue,
  CircularProgress,
  GridItem,
  SimpleGrid,
  VStack,
  Input,
  HStack,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
  Spacer,
  Tooltip,
  Select,
  Tag,
  Grid,
  ButtonGroup,
  TagLabel,
  TagCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import Skeleton from "../../ui/skeleton";
import {
  HeadingMedium,
  HeadingSmall,
  HeadingXtraSmall,
} from "../../ui/heading/heading";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useRef, useState, useCallback } from "react";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import PageCardView from "../../pages/page-card-view";
import { useInfinitePages } from "../../../hooks/page-hooks";
import { useQueryClient } from "react-query";
import { TextMedium, TextSmall } from "../../ui/text/text";
import {
  useAllCategories,
  useAllSubCategories,
  useCategoriesByType,
} from "../../../hooks/category-hooks";
import { CloseIcon } from "@chakra-ui/icons";
import { PageIcon, SearchBlueIcon } from "../../ui/icons";
import ReactSelect from "react-select";
import { useSports } from "../../../hooks/sports-hooks";
import { useUser } from "../../../hooks/user-hooks";
import { useAllCities } from "../../../hooks/country-hooks";

import { useRouter } from "next/router";
import PageMobileFilter from "./page-mobile-filter";
import Button from "../../ui/button";

function AllPagesList({ pagesCount }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { data: userData } = useUser();
  const [pageName, setPageName] = useState("");
  const [city, setCity] = useState("");

  const [categories, setCategories] = useState(null);
  const [userId, setUserId] = useState(null);
  const { data: SubCategoryData, isLoading: subcatLoadinging } =
    useAllSubCategories("CAT");

  const [subCategories, setSubCategories] = useState([]);
  const subCats = subCategories.length > 0 ? subCategories : null;
  const { data: parentCategories = [], isLoading: categoriesLoading } =
    useCategoriesByType("CAT");
  const { data: allSubCategories = [] } = useAllCategories();
  const { data: allCities = [] } = useAllCities();
  const queryClient = useQueryClient();
  const [sportIds, setSportIds] = useState([]);
  let arr = [];

  const {
    data: pagesData = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfinitePages(pageName, city, categories, subCats, sportIds, userId);
  const loadMoreRef = useRef();
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  const handleChange = useCallback(
    (e, type) => {
      if (type === "pageName") {
        setPageName(e.target.value);
      }
      if (type === "city") {
        setCity(e.target.value);
      }
      refetch({
        refetchPage: () => {
          queryClient.invalidateQueries([
            "pages-search",
            pageName,
            city,
            categories,
            subCats,
            sportIds,
            userId,
          ]);
          return true;
        },
      });
    },
    [
      refetch,
      queryClient,
      pageName,
      city,
      categories,
      subCats,
      sportIds,
      userId,
    ]
  );
  const fetchPagesCount = pagesData?.pages && pagesData?.pages[0]?.totalCount;

  const { data: sportsData = [] } = useSports({
    select: (data) => {
      return data?.map((sport) => ({
        ...sport,
        value: sport["sports_id"],
        label: sport["sports_name"],
      }));
    },
  });
  const MultiSelectSports = (props) => {
    return <ReactSelect {...props} options={sportsData} />;
  };
  const sportSelectValues = sportIds
    ?.map((sportId) =>
      sportsData?.find(({ sports_id }) => sportId === sports_id)
    )
    ?.map(({ value, label }) => {
      return {
        value,
        label,
      };
    });
  return (
    <Box p={0}>
      <Flex
        my={5}
        gap={3}
        alignItems="center"
        bgColor="white"
        px={5}
        py={3}
        borderRadius={10}
      >
        <Box>
          <HStack spacing={0} gap={2} wrap="wrap">
            {SubCategoryData?.map((subCategory, index) => (
              <Tag
                size="md"
                variant={
                  subCategories.includes(subCategory.category_type)
                    ? "solid"
                    : "outline"
                }
                colorScheme="primary"
                borderRadius={15}
                cursor="pointer"
                key={index}
                value={subCategory.category_type}
                onClick={() => {
                  if (!subCategories?.includes(subCategory.category_type)) {
                    let newArr = [...subCategories];
                    newArr.push(subCategory.category_type);
                    setSubCategories(newArr);
                  } else {
                    let newArr = subCategories.filter(
                      (subcat) => subcat !== subCategory.category_type
                    );
                    setSubCategories(newArr);
                  }
                }}
              >
                {subCategory.category_name}
              </Tag>
            ))}
          </HStack>
        </Box>
        <Spacer />
        <Button
          display={{ base: "none", lg: "inherit" }}
          onClick={() => router.push("/user/create-page")}
          leftIcon={<PageIcon />}
          minW="auto"
        >
          Create Page
        </Button>
        <Box>
          <Input
            display={{ base: "none", lg: "inherit" }}
            type="search"
            placeholder="Search Pages"
            borderRadius={"5px"}
            variant="outline"
            _focus={{ boxShadow: "none" }}
            bg="#f9f9f9"
            transition="0.5s ease-out"
            color="black"
            onInput={(e) => handleChange(e, "pageName")}
            minW="2xs"
          />
        </Box>
      </Flex>
      <HStack
        align="flex-start"
        minH="100vh"
        bg="white"
        p={3}
        flexDirection={{ base: "column", lg: "row" }}
      >
        {pagesCount > 0 && (
          <VStack h="min-content" spacing={4} align="flex-start" p={[2, 3, 4]}>
            <Flex align={"flex-start"} w="full" gap={2} justify="space-between">
              <HeadingSmall mt={{ base: 2, lg: 0 }}>My Pages</HeadingSmall>
              {/* <Spacer /> */}

              <Checkbox
                ml={{ base: 2, lg: 0 }}
                mt={{ base: 2, lg: 0 }}
                size="md"
                colorScheme="primary"
                defaultValue={null}
                // value={userData.user_id}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setUserId(isChecked ? userData.user_id : null);
                }}
              />
              <Button
                display={{ base: "inherit", lg: "none" }}
                ml={28}
                onClick={onOpen}
                variant="outline"
              >
                Filter
                <PageMobileFilter
                  isOpen={isOpen}
                  onClose={onClose}
                  subCategories={subCategories}
                  categoriesLoading={categoriesLoading}
                  parentCategories={parentCategories}
                  categories={categories}
                  setCategories={setCategories}
                  setSubCategories={setSubCategories}
                  setSportIds={setSportIds}
                  setCity={setCity}
                  setUserId={setUserId}
                  SubCategoryData={SubCategoryData}
                  sportsData={sportsData}
                />
              </Button>
            </Flex>
            <VStack display={{ base: "none", lg: "inherit" }}>
              <Flex align={"flex-start"} w="full" pt={5}>
                <HeadingSmall>FILTERS</HeadingSmall>
                <Spacer />
                <Tooltip label={"Clear Filters"}>
                  <CloseIcon
                    onClick={() => {
                      setCategories(null);
                      setSubCategories([]);
                      setSportIds([]);
                      setCity("");
                      setUserId(null);
                    }}
                    fontSize="10px"
                    style={{ cursor: "pointer", color: "#3182CE" }}
                  />
                </Tooltip>
              </Flex>
              {/* {subCategories?.map((categoryValues, index) => (
                <Tag size="lg" key={index} borderRadius="full">
                  <TagLabel>
                    {
                      SubCategoryData?.find(
                        (catCode) => catCode.category_type === categoryValues
                      )?.category_name
                    }
                  </TagLabel>
                  <TagCloseButton
                    onClick={() => {
                      let newArr = [...subCategories];
                      const index = newArr.indexOf(categoryValues);
                      if (index > -1) {
                        newArr.splice(index, 1);
                      }

                      setSubCategories(newArr);
                    }}
                  />
                </Tag>
              ))} */}
              <VStack align={"flex-start"} spacing={3}>
                <HeadingXtraSmall color="#3182CE">Sports</HeadingXtraSmall>
                <Box w={["120px", "210px"]}>
                  <MultiSelectSports
                    isMulti
                    placeholder={"Select Sports"}
                    onChange={(values, { action, option, removedValue }) => {
                      if (action === "select-option") {
                        let sportId;
                        sportId = option.sports_id;
                        let sportValues = [...sportIds, sportId];
                        setSportIds(sportValues);
                      } else if (action === "clear") setSportIds([]);
                      else if (action === "remove-value") {
                        setSportIds(
                          sportIds?.filter((id) => id !== removedValue.value)
                        );
                      }
                    }}
                    value={sportSelectValues}
                  />
                </Box>
              </VStack>
              <VStack align={"flex-start"} spacing={3}>
                <HeadingXtraSmall color="#3182CE">City</HeadingXtraSmall>
                {/* <Select
              placeholder="City"
              size="md"
              onChange={(e) => {
                setCity(e.target.value);
              }}
            >
              {allCities?.data?.map((cities, index) => (
                <option key={index} value={cities["city"]}>
                  {cities["city"]}
                </option>
              ))}
            </Select> */}
                <Input
                  type="search"
                  placeholder="City"
                  borderRadius={"5px"}
                  variant="outline"
                  _focus={{ boxShadow: "none" }}
                  bg="#f9f9f9"
                  transition="0.5s ease-out"
                  color="black"
                  onInput={(e) => handleChange(e, "city")}
                />
              </VStack>

              <VStack spacing={3} align={"flex-start"} w="full">
                <HeadingXtraSmall color="#3182CE">Categories</HeadingXtraSmall>
                {categoriesLoading && isLoading ? (
                  <Skeleton w="full">Loading..</Skeleton>
                ) : (
                  <Stack spacing={1} direction={"column"} w="full">
                    {/* <Select
                    onChange={(e) => {
                      let arr = [];
                      arr[0] = e.target.value;
                      setCategories(e.target.value ? arr : null);
                    }}
                    fontSize="sm"
                    placeholder={"Select a Category"}
                    variant={"flushed"}
                    colorScheme={"primary.600"}
                    value={categories?.length > 0 ? categories[0] : false}
                    borderColor="primary.600"
                  >
                    {parentCategories?.map(({ category_name, category_id }) => (
                      <option
                        key={category_id}
                        value={category_id.toString()}
                        name={category_name}
                      >
                        {category_name}
                      </option>
                      // <Tag></Tag>
                    ))}
                  </Select> */}
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      {parentCategories?.map(
                        ({ category_name, category_id }) => (
                          <GridItem key={category_id}>
                            <Tag
                              size="lg"
                              name={category_name}
                              value={category_id}
                              variant={
                                category_id === categories ? "solid" : null
                              }
                              onClick={() => {
                                if (categories === category_id) {
                                  setCategories(null);
                                } else {
                                  setCategories(category_id);
                                }
                              }}
                              cursor="pointer"
                            >
                              {category_name}
                            </Tag>
                          </GridItem>
                        )
                      )}
                    </Grid>
                  </Stack>
                )}
              </VStack>
            </VStack>
            {/* {categories?.length > 0 && (
              <Box>
                <HeadingXtraSmall color="#3182CE" mb={2}>
                  Sub Categories
                </HeadingXtraSmall>
                <CheckboxGroup
                  colorScheme="blue"
                  defaultValue={null}
                  onChange={(values) => {
                    setSubCategories(values.length > 0 ? values : null);
                  }}
                >
                  <Stack spacing={1} direction={"column"}>
                    {allSubCategories?.map(
                      ({ category_name, category_id, parent_category_id }) => {
                        let parentCategoryName = parentCategories?.find(
                          ({ category_id }) =>
                            category_id === (categories && +categories[0])
                        )?.category_name;

                        if (parentCategoryName?.includes(parent_category_id))
                          return (
                            <Checkbox
                              key={category_id}
                              value={category_id.toString()}
                            >
                              <TextSmall>{category_name}</TextSmall>
                            </Checkbox>
                          );
                      }
                    )}
                  </Stack>
                </CheckboxGroup>
              </Box>
            )} */}
            <Box w="full">
              <Input
                display={{ base: "inherit", lg: "none" }}
                type="search"
                placeholder="Search Pages"
                borderRadius={"5px"}
                variant="outline"
                _focus={{ boxShadow: "none" }}
                bg="#f9f9f9"
                transition="0.5s ease-out"
                color="black"
                onInput={(e) => handleChange(e, "pageName")}
                minW="2xs"
              />
            </Box>
          </VStack>
        )}
        <VStack w={"full"}>
          <Box>
            {" "}
            {isLoading ? (
              <HStack>
                <SearchBlueIcon />
                <TextSmall>Fetching..</TextSmall>
              </HStack>
            ) : (
              pagesCount > 0 &&
              (pageName ||
                categories ||
                subCategories ||
                sportIds.length > 0) && (
                <HStack>
                  <SearchBlueIcon />
                  <TextMedium>
                    <b>{fetchPagesCount}</b> results found
                  </TextMedium>
                </HStack>
              )
            )}
          </Box>
          <Flex
            align={"flex-start"}
            w="full"
            flexWrap={"wrap"}
            // px={[2, 3, 8]}
            gap={7}
          >
            {pagesData && isLoading ? (
              <Skeleton></Skeleton>
            ) : error ? (
              "An error has occurred: " + error.message
            ) : (
              <>
                <SimpleGrid columns={[1, 1, 2, 2, 3]} spacing={1}>
                  {pagesData?.pages?.map((page, index) => {
                    return page?.content?.map((pageData) => {
                      return (
                        <>
                          <PageCardView
                            key={index}
                            pageData={pageData}
                            userId={userId}
                          />
                        </>
                      );
                    });
                  })}
                  <span ref={loadMoreRef} />
                  {isFetchingNextPage && (
                    <CircularProgress
                      alignSelf="center"
                      isIndeterminate
                      size="28px"
                    />
                  )}
                </SimpleGrid>
              </>
            )}
            {pagesCount === 0 && (
              <EmptyContentDisplay displayText="No Pages to Display" />
            )}
          </Flex>
        </VStack>
      </HStack>
    </Box>
  );
}
export default AllPagesList;
