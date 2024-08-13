import { useState, useRef } from "react";
import {
  Box,
  CircularProgress,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Button from "../../ui/button";
import { SearchIcon } from "../../ui/icons";
import ProductServiceModal from "../marketplace/product-service-modal";
import ServicesFilter from "./services-filter";
import { useSearchProducts } from "../../../hooks/product-hooks";
import MarketplaceCard from "../../market-place/marketplace-card";
import { TextMedium } from "../../ui/text/text";
import routes from "../../../helper/constants/route-constants";
import ServiceMarketplaceModal from "../../market-place/service/service-marketplace-modal";
import { useIntersectionObserver } from "../../../hooks/common-hooks";

const ServicesTab = (props) => {
  const { currentPage, pageId, isPageVerified } = props;
  const [serviceName, setServiceName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [sportCategoryId, setSportCategoryId] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");

  const category = productCategoryId || sportCategoryId || null;

  const {
    data: servicesData,
    isSuccess,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearchProducts({
    productType: "SER",
    vendor: pageId,
    limit: 8,
    ...(serviceName && { productName: serviceName }),
    ...(category && { category }),
  });

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const handleSearchName = (e) => {
    setServiceName(e.target.value);
  };

  const areServicesPresent = isSuccess && servicesData.pages[0] !== "";

  return (
    <Box w="full" bg="white" p={5} borderRadius="md">
      <HStack justifyContent="space-between">
        {currentPage && (
          <>
            <Button onClick={onOpen} leftIcon={<AddIcon />}>
              Add Service
            </Button>
            {isPageVerified ? (
              <ServiceMarketplaceModal
                isOpen={isOpen}
                onClose={onClose}
                type="add"
                pageId={pageId}
              />
            ) : (
              <ProductServiceModal
                isOpen={isOpen}
                onClose={onClose}
                pageId={pageId}
                mode="add"
                type="service"
              />
            )}
          </>
        )}
        <HStack ml="auto">
          <InputGroup maxW="250px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon />
            </InputLeftElement>
            <Input
              type="search"
              placeholder="Search Services"
              value={serviceName}
              onChange={handleSearchName}
            />
          </InputGroup>
          <ServicesFilter
            sportCategoryId={sportCategoryId}
            setSportCategoryId={setSportCategoryId}
            productCategoryId={productCategoryId}
            setProductCategoryId={setProductCategoryId}
          />
        </HStack>
      </HStack>

      <Skeleton isLoaded={!isLoading}>
        {areServicesPresent ? (
          <SimpleGrid columns={{ lg: 2, xl: 3, "2xl": 4 }} mt={10} rowGap={10}>
            {servicesData.pages.map((page) => {
              if (page) {
                return page.map((service) => {
                  const isServiceInMarketplace =
                    service.availabilityStatus === "AVL";
                  return (
                    <MarketplaceCard
                      key={service.productId}
                      href={routes.service(service.productId)}
                      image={service.productMediaUrl}
                      title={service.productName}
                      description={service.productDesc}
                      categoryName={service.categoryName[1]}
                      sportName={service.categoryName[0]}
                      basePrice={
                        isServiceInMarketplace && service.productBasePrice
                      }
                      splPrice={
                        isServiceInMarketplace && service.productSplPrice
                      }
                      priceCurrency={
                        isServiceInMarketplace && service.productPriceCurrency
                      }
                    />
                  );
                });
              }
            })}
          </SimpleGrid>
        ) : (
          <TextMedium mt={5}>No services are present</TextMedium>
        )}
        <span ref={loadMoreRef} />
        {isFetchingNextPage && (
          <Box textAlign="center" mt={5}>
            <CircularProgress isIndeterminate size="28px" />
          </Box>
        )}
      </Skeleton>
    </Box>
  );
};

export default ServicesTab;
