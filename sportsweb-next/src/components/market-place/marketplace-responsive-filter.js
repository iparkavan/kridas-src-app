import {
  Box,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCategoriesById } from "../../hooks/category-hooks";
import Button from "../ui/button";
import LabelText from "../ui/text/label-text";
import { TextXtraSmall } from "../ui/text/text";

const MarketplaceResponsiveFilter = (props) => {
  const {
    isOpen,
    onClose,
    sportsCategoryData,
    setProductCategoryId,
    isTypeVouchers,
    areFiltersApplied,
    clearFilters,
    setSportCategoryId,
    sportCategoryId,
    productCategoryId,
  } = props;

  const [sportsfilter, setSportsFilter] = useState("");
  const [productfilter, setProductFilter] = useState("");

  const { data: productsCategoryData } = useCategoriesById(sportsfilter);

  const applyFilter = () => {
    setSportCategoryId(sportsfilter);
    setProductCategoryId(productfilter);
    onClose();
  };

  useEffect(() => {
    setSportsFilter(sportCategoryId);
    setProductFilter(productCategoryId);
  }, [sportCategoryId, productCategoryId]);

  const handleClearFilters = () => {
    clearFilters();
    onClose();
  };

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
            <VStack spacing={5} alignItems="flex-start">
              <Box w="full">
                <LabelText mb={1}>Sport</LabelText>
                <Select
                  placeholder="Select Sport"
                  value={sportsfilter}
                  onChange={(e) => setSportsFilter(e.target.value)}
                >
                  {sportsCategoryData?.map((sport) => (
                    <option key={sport.category_id} value={sport.category_id}>
                      {sport.category_name}
                    </option>
                  ))}
                </Select>
              </Box>
              {!isTypeVouchers && (
                <Box w="full">
                  <LabelText mb={1}>Category</LabelText>
                  <Select
                    placeholder="Select Category"
                    value={productfilter}
                    onChange={(e) => setProductFilter(e.target.value)}
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
              )}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <ButtonGroup w="full" justifyContent="flex-end">
              {areFiltersApplied && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filter
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={applyFilter}>Apply Filter</Button>
            </ButtonGroup>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MarketplaceResponsiveFilter;
