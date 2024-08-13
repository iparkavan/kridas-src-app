import { useEffect, useState } from "react";
import {
  Box,
  ButtonGroup,
  FormControl,
  HStack,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { stateToHTML } from "draft-js-export-html";
import { convertFromRaw } from "draft-js";
import {
  useAddToCart,
  useUpdateCart,
  useUserCart,
} from "../../../hooks/cart-hooks";
import { useCategoryById } from "../../../hooks/category-hooks";
import {
  useProductById,
  useProductCount,
  useUpdateProduct,
} from "../../../hooks/product-hooks";
import { useUser } from "../../../hooks/user-hooks";
import Button from "../../ui/button";
import {
  HeadingLarge,
  HeadingMedium,
  HeadingSmall,
} from "../../ui/heading/heading";
import { Share } from "../../ui/icons";
import Skeleton from "../../ui/skeleton";
import LabelText from "../../ui/text/label-text";
import { TextMedium, TextXtraSmall } from "../../ui/text/text";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import ProductMarketplaceModal from "./product-marketplace-modal";
import ProductServiceModal from "../../pages/marketplace/product-service-modal";
import SocialMediaShareButtons from "../../common/social-media-share-buttons";
import { usePage } from "../../../hooks/page-hooks";
import routes from "../../../helper/constants/route-constants";
import { useLocation } from "../../../hooks/location-hooks";
import {
  useCountryByCode,
  useCountryByISOCode,
} from "../../../hooks/country-hooks";
import DeleteModal from "../../ui/modal/delete-modal";
import { feedOptions } from "../../../helper/constants/feed-constants";
import { useCartContext } from "../../../context/cart-context";

function ProductIndex({ productId }) {
  const router = useRouter();
  const {
    isOpen: isProductOpen,
    onOpen: onProductOpen,
    onClose: onProductClose,
  } = useDisclosure();
  const {
    isOpen: isMarketOpen,
    onOpen: onMarketOpen,
    onClose: onMarketClose,
  } = useDisclosure();
  const {
    isOpen: isRemoveOpen,
    onOpen: onRemoveOpen,
    onClose: onRemoveClose,
  } = useDisclosure();

  const { data: userData } = useUser();
  const [marketType, setMarketType] = useState();
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const { refetch: refetchCartData, isRefetching: isCartRefetching } =
    useUserCart(userData?.user_id);
  const { mutate: cartMutate, isLoading: isCartLoading } = useAddToCart();
  const { mutate: updateCartMutate, isLoading: isUpdateCartLoading } =
    useUpdateCart();
  const {
    data: productData,
    isLoading: isProductLoading,
    isSuccess: isProductSuccess,
  } = useProductById(productId);
  const { data: pageData } = usePage(productData?.companyId);
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdateProduct();
  const { mutate: countMutate, isLoading: isCountLoading } = useProductCount();
  const isLoading =
    isCartLoading || isCountLoading || isCartRefetching || isUpdateCartLoading;

  const { setCartItems } = useCartContext();

  const { data: locationData, isLoading: isLocationLoading } = useLocation();
  const { data: countryData, isLoading: isCountryLoading } =
    useCountryByISOCode(locationData?.countryCode);

  const { data: productCountry, isLoading: isProductCountryLoading } =
    useCountryByCode(productData?.productLocation);

  const productCategoryId = productData?.productCategories[0].categoryId;
  const { data: productCategory, isLoading: isCategoryLoading } =
    useCategoryById(productCategoryId);

  const sportCategoryId = productData?.productCategories[1].categoryId;
  const { data: sportCategory, isLoading: isSportLoading } =
    useCategoryById(sportCategoryId);

  useEffect(() => {
    if (isProductSuccess) {
      const isQuantityLess =
        productData.quantity > 0 && productData.quantity <= 5;
      const isProductCreator = productData.createdBy === userData.user_id;
      const isQuantityValid = quantity <= productData.quantity;
      const isSoldOut = productData.quantity <= 0;
      if (
        (isQuantityLess && !isProductCreator) ||
        (!isSoldOut && !isQuantityValid)
      ) {
        setErrorMessage(
          `Only ${productData.quantity} vouchers available to purchase`
        );
      } else if (!isSoldOut && isQuantityValid) {
        setErrorMessage("");
      }
    }
  }, [isProductSuccess, productData, userData, quantity]);

  if (
    isProductLoading ||
    isSportLoading ||
    isCategoryLoading ||
    isLocationLoading ||
    isCountryLoading ||
    isProductCountryLoading
  ) {
    return <Skeleton />;
  }

  const isPageVerified = Boolean(pageData?.company_profile_verified);
  const isProductCreator = productData.createdBy === userData.user_id;
  const isProductInMarketPlace = productData.availabilityStatus === "AVL";
  const isSplPriceDifferent =
    isProductInMarketPlace &&
    productData.productPricing.productSplPrice !==
      productData.productPricing.productBasePrice;
  const isQuantityValid = quantity <= productData.quantity;
  const isProductInCountry =
    countryData?.country_code === productData.productLocation;
  const wasProductInMarketplace =
    productData.availabilityStatus === "NAV" &&
    Boolean(productData.voucher) &&
    Boolean(productData.productPricing);
  // const isQuantityLess = productData.quantity > 0 && productData.quantity <= 5;
  const isSoldOut = productData.quantity <= 0;

  let productTermsHtml;
  let isTermsHtml = true;
  if (isProductInMarketPlace) {
    try {
      const contentState = convertFromRaw(
        JSON.parse(productData.voucher.voucherTerms)
      );
      productTermsHtml = stateToHTML(contentState, feedOptions);
    } catch (e) {
      isTermsHtml = false;
    }
  }

  const removeFromMarketplace = () => {
    const product = {
      ...productData,
      availabilityStatus: "NAV",
      // To prevent purchasing products already in cart
      quantity: 0,
    };
    updateMutate(product, {
      onSuccess: onRemoveClose,
    });
  };

  const getProductInCart = async (productId) => {
    const { data: cartData, isSuccess: isCartSuccess } =
      await refetchCartData();
    let updatedCartData = cartData;
    if (isCartSuccess && cartData === "") {
      updatedCartData = [];
    }
    return updatedCartData.find((item) => item.productId === productId);
  };

  const updateCartContext = async (productId) => {
    const productInCart = await getProductInCart(productId);
    if (productInCart) {
      setCartItems([productInCart]);
    }
  };

  const addToCart = (type) => {
    setErrorMessage("");
    countMutate(productId, {
      onSuccess: async (productQuantity) => {
        const productInCart = await getProductInCart(productId);
        if (productInCart) {
          const updatedQuantity = quantity + productInCart.quantity;
          if (updatedQuantity <= productQuantity) {
            updateCartMutate(
              {
                productId: productId,
                qty: updatedQuantity,
                shoppingCartId: productInCart.shoppingCartId,
                userId: userData.user_id,
                serviceId: null,
                shoppingCartAttrList: null,
                weeklyScheduleDetailId: null,
              },
              {
                onSuccess: async () => {
                  if (type === "buy") {
                    await updateCartContext(productId);
                    router.push(routes.checkoutProducts);
                  }
                },
              }
            );
          } else {
            setErrorMessage(
              "The product which is available in the cart has been reached its maximum quantity limit"
            );
          }
        } else {
          if (quantity <= productQuantity) {
            cartMutate(
              {
                productId: productId,
                qty: quantity,
                userId: userData.user_id,
                serviceId: null,
                shoppingCartAttrList: null,
                shoppingCartId: null,
                weeklyScheduleDetailId: null,
              },
              {
                onSuccess: async () => {
                  if (type === "buy") {
                    await updateCartContext(productId);
                    router.push(routes.checkoutProducts);
                  }
                },
              }
            );
          } else {
            const errorMessage =
              productQuantity <= 0
                ? "The product is sold out"
                : `Only ${productQuantity} vouchers available to purchase`;
            setErrorMessage(errorMessage);
          }
        }
      },
    });
  };

  const formatDate = (date) => format(new Date(date), "dd-MMM-yyyy");

  return (
    <SimpleGrid
      p={7}
      bg="white"
      columns={{ base: 1, lg: 2 }}
      columnGap={16}
      rowGap={6}
      boxShadow="2xl"
      borderRadius="lg"
    >
      <VStack alignItems="flex-start" spacing={5}>
        <Image
          w="full"
          maxH="500px"
          // maxW="600px"
          src={productData.productMediaList[0].productMediaUrl}
          alt={productData.productName}
          objectFit="contain"
        />
        {/* Price for desktop */}
        {isProductInMarketPlace && (
          <Box display={{ base: "none", lg: "initial" }}>
            <HStack alignItems="baseline" spacing={3}>
              <HeadingLarge>
                {productData.productPricing.productSplPrice}{" "}
                {productData.productPricing.productPriceCurrency}
              </HeadingLarge>
              {isSplPriceDifferent && (
                <HeadingMedium
                  fontWeight="medium"
                  color="gray.500"
                  textDecoration="line-through"
                >
                  {productData.productPricing.productBasePrice}{" "}
                  {productData.productPricing.productPriceCurrency}
                </HeadingMedium>
              )}
            </HStack>
            <TextXtraSmall mt={1} color="gray.500">
              * Inclusive of Tax
            </TextXtraSmall>
          </Box>
        )}
      </VStack>
      <VStack
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={{ base: 10, lg: 20, xl: 40 }}
      >
        <Box w="full">
          <VStack alignItems="flex-start" spacing={3}>
            <HStack justify="space-between" w="full">
              <LabelText fontSize="2xl">{productData.productName}</LabelText>
              <SocialMediaShareButtons
                twitterHashtags={["kridas", "products", "social_media"]}
                fbHashtag={"#kridas"}
                twitterMention="kridas_sports"
              />
            </HStack>

            {/* Price for mobile */}
            {isProductInMarketPlace && (
              <Box display={{ lg: "none" }}>
                <HStack alignItems="baseline">
                  <HeadingLarge>
                    {productData.productPricing.productSplPrice}{" "}
                    {productData.productPricing.productPriceCurrency}
                  </HeadingLarge>
                  {isSplPriceDifferent && (
                    <HeadingMedium
                      fontWeight="medium"
                      color="gray.500"
                      textDecoration="line-through"
                    >
                      {productData.productPricing.productBasePrice}{" "}
                      {productData.productPricing.productPriceCurrency}
                    </HeadingMedium>
                  )}
                </HStack>
                <TextXtraSmall mt={1} color="gray.500">
                  * Inclusive of Tax
                </TextXtraSmall>
              </Box>
            )}

            <TextMedium>{productCountry?.country_name}</TextMedium>
            <TextMedium>{productData.productDesc}</TextMedium>
            <TextMedium fontWeight="medium">
              {productCategory?.category_name}
            </TextMedium>
            <TextMedium fontWeight="medium">
              {sportCategory?.category_name}
            </TextMedium>

            {isProductInMarketPlace && (
              <>
                <HeadingSmall color="primary.500">Voucher Details</HeadingSmall>
                <FieldLayout label="Valid Till:">
                  <TextMedium>
                    {formatDate(productData.voucher.redemptionTillDate)}
                  </TextMedium>
                </FieldLayout>
                <FieldLayout label="Terms and Conditions:">
                  {isTermsHtml ? (
                    <Box
                      dangerouslySetInnerHTML={{ __html: productTermsHtml }}
                    />
                  ) : (
                    productData.voucher.voucherTerms
                  )}
                </FieldLayout>

                {isProductCreator ? (
                  <FieldLayout label="Quantity:">
                    <TextMedium>{productData.quantity}</TextMedium>
                  </FieldLayout>
                ) : isSoldOut ? (
                  <Box>
                    <HeadingMedium mt={5}>Sold Out</HeadingMedium>
                  </Box>
                ) : (
                  <FieldLayout label="Quantity:">
                    <FormControl isInvalid={!isQuantityValid}>
                      <NumberInput
                        size="sm"
                        maxW="100px"
                        min={1}
                        // max={productData.quantity}
                        value={quantity}
                        onChange={(value) => setQuantity(+value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </FieldLayout>
                )}

                {errorMessage && (
                  <TextMedium color="red.500">{errorMessage}</TextMedium>
                )}

                {/* Handled this in useEffect errorMessage */}
                {/* {isQuantityLess && !isProductCreator && (
                  <TextMedium color="red.500">
                    Only {productData.quantity} vouchers available to purchase
                  </TextMedium>
                )} */}
              </>
            )}
          </VStack>
        </Box>

        <ButtonGroup
          w="full"
          spacing={0}
          gap={3}
          flexDirection={["column", null, "row", "column", "row"]}
          justifyContent="flex-end"
        >
          {isProductCreator ? (
            <>
              {isProductInMarketPlace ? (
                <>
                  <Button colorScheme="red" onClick={onRemoveOpen}>
                    Remove from Market Place
                  </Button>
                  <DeleteModal
                    isOpen={isRemoveOpen}
                    onClose={onRemoveClose}
                    title="Remove Product"
                    content="Are you sure you want to remove this product from marketplace?"
                    buttonText="Remove"
                    isLoading={isUpdateLoading}
                    handleDelete={removeFromMarketplace}
                  />
                </>
              ) : (
                <Button
                  onClick={() => {
                    setMarketType(wasProductInMarketplace ? "edit" : "add");
                    onMarketOpen();
                  }}
                  disabled={!isPageVerified}
                >
                  Add to Market Place
                </Button>
              )}
            </>
          ) : (
            isProductInMarketPlace && (
              <>
                {/* <Button variant="outline" disabled={!isProductInCountry}>
                  Pick up from Store
                </Button> */}
                <Button
                  onClick={() => addToCart("buy")}
                  isLoading={isLoading}
                  disabled={
                    isLoading || !isQuantityValid || !isProductInCountry
                  }
                >
                  Buy Voucher
                </Button>
                <Button
                  bg="black"
                  _hover={{
                    bg:
                      !(isLoading || !isQuantityValid || !isProductInCountry) &&
                      "blackAlpha.700",
                  }}
                  onClick={() => addToCart("cart")}
                  isLoading={isLoading}
                  disabled={
                    isLoading || !isQuantityValid || !isProductInCountry
                  }
                >
                  Add to Cart
                </Button>
              </>
            )
          )}

          <ProductMarketplaceModal
            productData={productData}
            isOpen={isMarketOpen}
            onClose={onMarketClose}
            type={marketType}
            wasProductInMarketplace={wasProductInMarketplace}
          />

          {isProductCreator && (
            <Button
              variant="outline"
              onClick={() => {
                if (isProductInMarketPlace) {
                  setMarketType("edit");
                  onMarketOpen();
                } else {
                  onProductOpen();
                }
              }}
            >
              Edit
            </Button>
          )}

          <ProductServiceModal
            isOpen={isProductOpen}
            onClose={onProductClose}
            mode="edit"
            productData={productData}
            type="product"
          />

          <Button variant="outline" onClick={() => router.back()}>
            Close
          </Button>
        </ButtonGroup>
      </VStack>
    </SimpleGrid>
  );
}

export default ProductIndex;
