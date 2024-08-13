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
import ProductsFilter from "./products-filter";
import { useSearchProducts } from "../../../hooks/product-hooks";
import MarketplaceCard from "../../market-place/marketplace-card";
import { TextMedium } from "../../ui/text/text";
import routes from "../../../helper/constants/route-constants";
import ProductMarketplaceModal from "../../market-place/product/product-marketplace-modal";
import { useIntersectionObserver } from "../../../hooks/common-hooks";

const ProductsTab = (props) => {
  const { currentPage, pageId, isPageVerified } = props;
  const [productName, setProductName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [sportCategoryId, setSportCategoryId] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");

  const category = productCategoryId || sportCategoryId || null;

  const {
    data: productsData,
    isSuccess,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearchProducts({
    productType: "VCH",
    vendor: pageId,
    limit: 8,
    ...(productName && { productName }),
    ...(category && { category }),
  });

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const handleSearchName = (e) => {
    setProductName(e.target.value);
  };

  const areProductsPresent = isSuccess && productsData.pages[0] !== "";

  return (
    <Box w="full" bg="white" p={5} borderRadius="md">
      <HStack justifyContent="space-between">
        {currentPage && (
          <>
            <Button onClick={onOpen} leftIcon={<AddIcon />}>
              Add Product
            </Button>
            {isPageVerified ? (
              <ProductMarketplaceModal
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
                type="product"
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
              placeholder="Search Products"
              value={productName}
              onChange={handleSearchName}
            />
          </InputGroup>
          <ProductsFilter
            sportCategoryId={sportCategoryId}
            setSportCategoryId={setSportCategoryId}
            productCategoryId={productCategoryId}
            setProductCategoryId={setProductCategoryId}
          />
        </HStack>
      </HStack>

      <Skeleton isLoaded={!isLoading}>
        {areProductsPresent ? (
          <SimpleGrid columns={{ lg: 2, xl: 3, "2xl": 4 }} mt={10} rowGap={10}>
            {productsData.pages.map((page) => {
              if (page) {
                return page.map((product) => {
                  const isProductInMarketplace =
                    product.availabilityStatus === "AVL";
                  return (
                    <MarketplaceCard
                      key={product.productId}
                      href={routes.product(product.productId)}
                      image={product.productMediaUrl}
                      title={product.productName}
                      description={product.productDesc}
                      categoryName={product.categoryName[1]}
                      sportName={product.categoryName[0]}
                      basePrice={
                        isProductInMarketplace && product.productBasePrice
                      }
                      splPrice={
                        isProductInMarketplace && product.productSplPrice
                      }
                      priceCurrency={
                        isProductInMarketplace && product.productPriceCurrency
                      }
                    />
                  );
                });
              }
            })}
          </SimpleGrid>
        ) : (
          <TextMedium mt={5}>No products are present</TextMedium>
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

export default ProductsTab;
