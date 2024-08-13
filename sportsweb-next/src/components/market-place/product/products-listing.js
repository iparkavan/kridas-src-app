import { useEffect, useState, useRef } from "react";
import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  Flex,
  HStack,
  Input,
  Select,
  Skeleton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useUser } from "../../../hooks/user-hooks";
import BreadcrumbList from "../../ui/breadcrumb/breadcrumb-list";
import routes from "../../../helper/constants/route-constants";
import { TextCustom, TextXtraSmall } from "../../ui/text/text";
import LabelText from "../../ui/text/label-text";
import { useSearchProducts } from "../../../hooks/product-hooks";
import ProductsList from "./products-list";
import {
  useCategoriesById,
  useCategoriesByType,
} from "../../../hooks/category-hooks";
import { useLocation } from "../../../hooks/location-hooks";
import { useCountryByISOCode } from "../../../hooks/country-hooks";
import Button from "../../ui/button";
import MarketplaceResponsiveFilter from "../marketplace-responsive-filter";
import { useIntersectionObserver } from "../../../hooks/common-hooks";

function ProductsListing() {
  const { data: userData } = useUser();
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("VCH");
  const [sportCategoryId, setSportCategoryId] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const { onOpen, isOpen, onClose } = useDisclosure();

  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);

  // Sports Input Field
  const { data: sportsCategoryData } = useCategoriesByType("PCS");

  const sportsHandler = (e) => {
    setSportCategoryId(e.target.value);
    setProductCategoryId("");
  };

  // Sports Input Category Field
  const { data: productsCategoryData } = useCategoriesById(sportCategoryId);

  const isTypeVouchers = productType === "CVCH";
  const category = productCategoryId || sportCategoryId || null;
  const areFiltersApplied = sportCategoryId || productCategoryId;

  // Product Data
  const {
    data: productsData,
    isSuccess,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearchProducts({
    productType: productType,
    availability: "AVL",
    location: countryData?.country_code,
    limit: 9,
    ...(productName && { productName }),
    ...(category && { category }),
  });

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  useEffect(() => {
    setProductCategoryId("");
  }, [productType]);

  const clearFilters = () => {
    setSportCategoryId("");
    setProductCategoryId("");
  };

  return (
    <Box>
      <BreadcrumbList
        rootRoute={routes.profile(userData["user_name"])}
        rootPageName={userData["full_name"]}
        currentPageName="Products"
      />

      <Box mt={5} bg="white" borderRadius="md" p={4}>
        <HStack justifyContent="space-between">
          {/* <HStack>
            <Tag colorScheme="primary" p={2} variant="outline">
              Accessories
            </Tag>
            <Tag colorScheme="primary" p={2} variant="outline">
              Clothing
            </Tag>
            <Tag colorScheme="primary" p={2} variant="outline">
              Equipment
            </Tag>
          </HStack> */}

          <Input
            type="search"
            ml="auto"
            placeholder="Search Products"
            maxW={{ sm: "xs" }}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </HStack>
      </Box>

      <Box mt={5} bg="white" borderRadius="md">
        <Flex
          p={5}
          gap={{ base: 0, md: 10 }}
          direction={{ base: "column", md: "row" }}
        >
          <VStack
            alignItems="flex-start"
            mt={{ md: 5 }}
            w={{ base: "full", md: "20%" }}
            spacing={7}
          >
            <Flex
              gap={4}
              alignItems="center"
              justifyContent={{ md: "space-between" }}
              w="full"
            >
              <TextCustom fontSize="xl">Vouchers</TextCustom>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    setProductType("CVCH");
                  } else {
                    setProductType("VCH");
                  }
                }}
              />
              <Button
                display={{ md: "none" }}
                ml="auto"
                variant={areFiltersApplied ? "solid" : "outline"}
                onClick={onOpen}
              >
                Filter
              </Button>
              <MarketplaceResponsiveFilter
                isOpen={isOpen}
                onClose={onClose}
                sportCategoryId={sportCategoryId}
                productCategoryId={productCategoryId}
                setSportCategoryId={setSportCategoryId}
                setProductCategoryId={setProductCategoryId}
                sportsCategoryData={sportsCategoryData}
                isTypeVouchers={isTypeVouchers}
                areFiltersApplied={areFiltersApplied}
                clearFilters={clearFilters}
              />
            </Flex>
            {/* <VStack alignItems="flex-start" spacing={3}>
              <HeadingMedium>Filter</HeadingMedium>
              <Tag size="lg" borderRadius="xl">
                Clothing
                <TagCloseButton />
              </Tag>

              <Tag size="lg" borderRadius="xl">
                Equipment
                <TagCloseButton />
              </Tag>

              <Tag size="lg" borderRadius="xl">
                Accessories
                <TagCloseButton />
              </Tag>
              <Button>Clear Filter</Button>
            </VStack> */}
            <VStack
              borderColor="gray.400"
              spacing={5}
              alignItems="flex-start"
              w="full"
              display={{ base: "none", md: "inherit" }}
            >
              <Box w="full">
                <LabelText mb={1}>Sport</LabelText>
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
              {/* <Box w="full">
                <LabelText mb={1}>City</LabelText>
                <Select placeholder="Select City"></Select>
              </Box> */}
              {!isTypeVouchers && (
                <Box w="full">
                  <LabelText mb={1}>Category</LabelText>
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
              )}

              {areFiltersApplied && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </VStack>
          </VStack>
          <Divider orientation="vertical" h="auto" />

          <Skeleton w="full" isLoaded={!isLoading}>
            {isSuccess && (
              <ProductsList
                productsData={productsData}
                isTypeVouchers={isTypeVouchers}
              />
            )}
            <span ref={loadMoreRef} />
            {isFetchingNextPage && (
              <Box textAlign="center" mt={5}>
                <CircularProgress isIndeterminate size="28px" />
              </Box>
            )}
          </Skeleton>
        </Flex>
      </Box>
    </Box>
  );
}

export default ProductsListing;
