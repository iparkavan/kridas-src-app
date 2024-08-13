import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Input,
  Spacer,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ReactSelect from "react-select";
import Button from "../../ui/button";
import { HeadingSmall, HeadingXtraSmall } from "../../ui/heading/heading";
import Skeleton from "../../ui/skeleton";

const PageMobileFilter = (props) => {
  const {
    isOpen,
    onClose,
    subCategories,
    setSubCategories,
    categoriesLoading,
    parentCategories,
    categories,
    setCategories,
    setSportIds,
    setCity,
    setUserId,
    SubCategoryData,
    sportsData,
  } = props;

  const [sportIdsFilter, setSportIdsFilter] = useState([]);
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [subCategoriesFilter, setSubCategoriesFilter] = useState([]);

  const applyFilter = () => {
    setSubCategories(subCategoriesFilter);
    setSportIds(sportIdsFilter);
    setCity(cityFilter);
    setCategories(categoryFilter);
    onClose();
  };

  const MultiSelectSports = (props) => {
    return <ReactSelect {...props} options={sportsData} />;
  };

  const sportSelectValues = sportIdsFilter
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
    <>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filter</DrawerHeader>

          <DrawerBody>
            <Flex align={"flex-start"} w="full" pt={5}>
              <HeadingSmall>FILTERS</HeadingSmall>
              <Spacer />
              <Tooltip label={"Clear Filters"}>
                <CloseIcon
                  onClick={() => {
                    setCategoryFilter(null);
                    setSubCategoriesFilter([]);
                    setSportIdsFilter([]);
                    setCityFilter("");
                    setUserId(null);
                  }}
                  fontSize="10px"
                  style={{ cursor: "pointer", color: "#3182CE" }}
                />
              </Tooltip>
            </Flex>
            {/* {subCategoriesFilter?.map((categoryValues, index) => (
              <Tag mt={3} size="lg" key={index} borderRadius="full">
                <TagLabel>
                  {
                    SubCategoryData?.find(
                      (catCode) => catCode.category_type === categoryValues
                    )?.category_name
                  }
                </TagLabel>
                <TagCloseButton
                  onClick={() => {
                    let newArr = [...subCategoriesFilter];
                    const index = newArr.indexOf(categoryValues);
                    if (index > -1) {
                      newArr.splice(index, 1);
                    }

                    setSubCategoriesFilter(newArr);
                  }}
                />
              </Tag>
            ))} */}
            <VStack align={"flex-start"} spacing={3} mt={5}>
              <HeadingXtraSmall color="#3182CE">Sports</HeadingXtraSmall>
              <Box w="full">
                <MultiSelectSports
                  isMulti
                  placeholder={"Select Sports"}
                  onChange={(values, { action, option, removedValue }) => {
                    if (action === "select-option") {
                      let sportId;
                      sportId = option.sports_id;
                      let sportValues = [...sportIdsFilter, sportId];
                      setSportIdsFilter(sportValues);
                    } else if (action === "clear") setSportIdsFilter([]);
                    else if (action === "remove-value") {
                      setSportIdsFilter(
                        sportIdsFilter?.filter(
                          (id) => id !== removedValue.value
                        )
                      );
                    }
                  }}
                  value={sportSelectValues}
                />
              </Box>
            </VStack>
            <VStack align={"flex-start"} spacing={3} mt={5}>
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
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </VStack>

            <VStack spacing={3} align={"flex-start"} w="full" mt={5}>
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
                    {parentCategories?.map(({ category_name, category_id }) => (
                      <GridItem key={category_id}>
                        <Tag
                          size="lg"
                          name={category_name}
                          value={category_id}
                          variant={
                            category_id === categoryFilter ? "solid" : null
                          }
                          onClick={() => {
                            if (categories === category_id) {
                              setCategoryFilter(null);
                            } else {
                              setCategoryFilter(category_id);
                            }
                          }}
                          cursor="pointer"
                        >
                          {category_name}
                        </Tag>
                      </GridItem>
                    ))}
                  </Grid>
                </Stack>
              )}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>

            <Button mr={3} onClick={applyFilter}>
              Apply Filter
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PageMobileFilter;
