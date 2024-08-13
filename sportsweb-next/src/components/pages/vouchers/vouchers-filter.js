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
import { useCategoriesByType } from "../../../hooks/category-hooks";
import { FilterIcon } from "../../ui/icons";
import LabelText from "../../ui/text/label-text";

const VouchersFilter = (props) => {
  const { sportCategoryId, setSportCategoryId } = props;
  const { data: sportsCategoryData } = useCategoriesByType("PCS");

  const sportsHandler = (e) => {
    setSportCategoryId(e.target.value);
  };

  const clearFilters = () => {
    setSportCategoryId("");
  };

  const areFiltersApplied = Boolean(sportCategoryId);

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
          <PopoverBody my={5}>
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
                <LabelText>Voucher</LabelText>
                <Select
                  placeholder="Select Voucher Type"
                  // value={sportCategoryId}
                  // onChange={sportsHandler}
                >
                  <option value="Cash Voucher">Cash Voucher</option>
                  <option value="Brand Voucher">Brand Voucher</option>
                </Select>
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

export default VouchersFilter;
