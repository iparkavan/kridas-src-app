import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Select,
  VStack,
} from "@chakra-ui/react";
import { FilterIcon } from "../../ui/icons";
import LabelText from "../../ui/text/label-text";
import {
  useCategoriesById,
  useCategoriesByType,
} from "../../../hooks/category-hooks";
import { TextXtraSmall } from "../../ui/text/text";

const ServicesFilter = (props) => {
  const {
    sportCategoryId,
    setSportCategoryId,
    productCategoryId,
    setProductCategoryId,
  } = props;

  const { data: sportsCategoryData } = useCategoriesByType("SCS");
  const { data: productsCategoryData } = useCategoriesById(sportCategoryId);

  const sportsHandler = (e) => {
    setSportCategoryId(e.target.value);
    setProductCategoryId("");
  };

  const clearFilters = (e) => {
    setSportCategoryId("");
    setProductCategoryId("");
  };

  const areFiltersApplied = sportCategoryId || productCategoryId;

  return (
    <HStack>
      <Popover>
        <PopoverTrigger>
          <Button
            leftIcon={<FilterIcon />}
            variant={areFiltersApplied ? "solid" : "outline"}
            fontWeight="normal"
            colorScheme="primary"
          >
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody mt={5}>
            <VStack alignItems="flex-start" spacing={5} w="full">
              <Box w="full">
                <LabelText>Sport</LabelText>
                <Select
                  placeholder="Select Sport"
                  value={sportCategoryId}
                  onChange={sportsHandler}
                >
                  {sportsCategoryData?.map((sport) => (
                    <option key={sport.category_id} value={sport.category_id}>
                      {sport.category_name}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box w="full">
                <LabelText>Category</LabelText>
                <Select
                  placeholder="Select Category"
                  value={productCategoryId}
                  onChange={(e) => setProductCategoryId(e.target.value)}
                >
                  {productsCategoryData?.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </Select>
                <TextXtraSmall mt={1} color="gray.700">
                  Note: Please select the sport to view all categories
                </TextXtraSmall>
              </Box>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      {areFiltersApplied && (
        <Button
          variant="outline"
          fontWeight="normal"
          colorScheme="primary"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      )}
    </HStack>
  );
};

export default ServicesFilter;
