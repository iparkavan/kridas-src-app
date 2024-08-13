import { useState, useRef } from "react";
import {
  Box,
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
import LabelText from "../../ui/text/label-text";
import { useSearchProducts } from "../../../hooks/product-hooks";
import ServicesList from "./services-list";
import {
  useCategoriesById,
  useCategoriesByType,
} from "../../../hooks/category-hooks";
import { useLocation } from "../../../hooks/location-hooks";
import { useCountryByISOCode } from "../../../hooks/country-hooks";
import Button from "../../ui/button";
import { TextXtraSmall } from "../../ui/text/text";
import MarketplaceResponsiveFilter from "../marketplace-responsive-filter";
import { useIntersectionObserver } from "../../../hooks/common-hooks";

function ServicesListing() {
  const { data: userData } = useUser();
  const [serviceName, setServiceName] = useState("");
  const [sportCategoryId, setSportCategoryId] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");

  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);

  const { data: sportsCategoryData } = useCategoriesByType("SCS");
  const { data: productsCategoryData } = useCategoriesById(sportCategoryId);
  const { onOpen, isOpen, onClose } = useDisclosure();

  const sportsHandler = (e) => {
    setSportCategoryId(e.target.value);
    setProductCategoryId("");
  };

  const category = productCategoryId || sportCategoryId || null;
  const areFiltersApplied = sportCategoryId || productCategoryId;

  const {
    data: servicesData,
    isSuccess,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearchProducts({
    productType: "SER",
    availability: "AVL",
    location: countryData?.country_code,
    limit: 9,
    ...(serviceName && { productName: serviceName }),
    ...(category && { category }),
  });

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const clearFilters = () => {
    setSportCategoryId("");
    setProductCategoryId("");
  };

  return (
    <Box>
      <BreadcrumbList
        rootRoute={routes.profile(userData["user_name"])}
        rootPageName={userData["full_name"]}
        currentPageName="Services"
      />

      <Box mt={5} bg="white" borderRadius="md" p={4}>
        <HStack justifyContent="space-between">
          {/* <HStack>
            <Tag colorScheme="primary" p={2} variant="outline">
              Coaching
            </Tag>
            <Tag colorScheme="primary" p={2} variant="outline">
              Physiotheraphy
            </Tag>
            <Tag colorScheme="primary" p={2} variant="outline">
              Membership/Subscription
            </Tag>
          </HStack> */}

          <Input
            type="search"
            ml="auto"
            placeholder="Search Services"
            maxW={{ sm: "xs" }}
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
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
            w={{ base: "full", md: "20%" }}
            spacing={7}
          >
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
              setProductCategoryId={setProductCategoryId}
              setSportCategoryId={setSportCategoryId}
              sportsHandler={sportsHandler}
              sportsCategoryData={sportsCategoryData}
              productsCategoryData={productsCategoryData}
              // isTypeVouchers={isTypeVouchers}
              areFiltersApplied={areFiltersApplied}
              clearFilters={clearFilters}
            />
            {/* <VStack alignItems="flex-start" spacing={3}>
              <HeadingMedium>Filter</HeadingMedium>
              <Tag size="lg" borderRadius="xl">
                Coaching
                <TagCloseButton />
              </Tag>

              <Tag size="lg" borderRadius="xl">
                Physiotheraphy
                <TagCloseButton />
              </Tag>

              <Tag size="lg" borderRadius="xl">
                Membership/Subscription
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
              {areFiltersApplied && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </VStack>
          </VStack>
          <Divider orientation="vertical" h="auto" />

          <Skeleton w="full" isLoaded={!isLoading}>
            {isSuccess && <ServicesList servicesData={servicesData} />}
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

export default ServicesListing;
