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
import { format } from "date-fns";
import { useRouter } from "next/router";
import Error from "next/error";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

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
import SocialMediaShareButtons from "../../common/social-media-share-buttons";
import Button from "../../ui/button";
import { HeadingLarge, HeadingMedium } from "../../ui/heading/heading";
import Skeleton from "../../ui/skeleton";
import LabelText from "../../ui/text/label-text";
import { TextMedium, TextXtraSmall } from "../../ui/text/text";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import VoucherModal from "./voucher-modal";
import routes from "../../../helper/constants/route-constants";
import { useLocation } from "../../../hooks/location-hooks";
import { useCountryByISOCode } from "../../../hooks/country-hooks";
import DeleteModal from "../../ui/modal/delete-modal";
import { feedOptions } from "../../../helper/constants/feed-constants";
import { useCartContext } from "../../../context/cart-context";
import { usePage } from "../../../hooks/page-hooks";

function VoucherIndex({ voucherId }) {
  const router = useRouter();
  const {
    isOpen: isVoucherOpen,
    onOpen: onVoucherOpen,
    onClose: onVoucherClose,
  } = useDisclosure();
  const {
    isOpen: isRemoveOpen,
    onOpen: onRemoveOpen,
    onClose: onRemoveClose,
  } = useDisclosure();

  const { data: userData } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const { refetch: refetchCartData, isRefetching: isCartRefetching } =
    useUserCart(userData?.user_id);
  const { mutate: cartMutate, isLoading: isCartLoading } = useAddToCart();
  const { mutate: updateCartMutate, isLoading: isUpdateCartLoading } =
    useUpdateCart();
  const {
    data: voucherData,
    isLoading: isVoucherLoading,
    isSuccess: isVoucherSuccess,
  } = useProductById(voucherId);
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdateProduct();
  const { mutate: countMutate, isLoading: isCountLoading } = useProductCount();
  const isLoading =
    isCartLoading || isCountLoading || isCartRefetching || isUpdateCartLoading;

  const { setCartItems } = useCartContext();

  const { data: locationData, isLoading: isLocationLoading } = useLocation();
  const { data: countryData, isLoading: isCountryLoading } =
    useCountryByISOCode(locationData?.countryCode);

  const sportCategoryId = voucherData?.productCategories[0].categoryId;
  const { data: sportCategory, isLoading: isSportLoading } =
    useCategoryById(sportCategoryId);

  const { data: pageData, isLoading: isPageLoading } = usePage(
    voucherData?.companyId
  );
  const isCreatedByNonSportingPage = pageData?.category_id === 1;

  useEffect(() => {
    if (isVoucherSuccess) {
      const isQuantityLess =
        voucherData.quantity > 0 && voucherData.quantity <= 5;
      const isVoucherCreator = voucherData.createdBy === userData.user_id;
      const isQuantityValid = quantity <= voucherData.quantity;
      const isSoldOut = voucherData.quantity <= 0;
      if (
        (isQuantityLess && !isVoucherCreator) ||
        (!isSoldOut && !isQuantityValid)
      ) {
        setErrorMessage(
          `Only ${voucherData.quantity} vouchers available to purchase`
        );
      } else if (!isSoldOut && isQuantityValid) {
        setErrorMessage("");
      }
    }
  }, [isVoucherSuccess, voucherData, userData, quantity]);

  if (
    isVoucherLoading ||
    isSportLoading ||
    isLocationLoading ||
    isCountryLoading ||
    isPageLoading
  ) {
    return <Skeleton />;
  }

  const isVoucherCreator = voucherData.createdBy === userData.user_id;
  const isVoucherInMarketPlace = voucherData.availabilityStatus === "AVL";
  const isSplPriceDifferent =
    isVoucherInMarketPlace &&
    voucherData.productPricing.productSplPrice !==
      voucherData.productPricing.productBasePrice;
  const isVoucherInCountry =
    countryData?.country_code === voucherData.productLocation;

  let voucherTermsHtml;
  let isTermsHtml = true;
  if (isVoucherInMarketPlace) {
    try {
      const contentState = convertFromRaw(
        JSON.parse(voucherData.voucher.voucherTerms)
      );
      voucherTermsHtml = stateToHTML(contentState, feedOptions);
    } catch (e) {
      console.log(e);
      isTermsHtml = false;
    }
  }

  const removeFromMarketplace = () => {
    const voucher = {
      ...voucherData,
      availabilityStatus: "NAV",
      // To prevent purchasing vouchers already in cart
      quantity: 0,
    };
    updateMutate(voucher, {
      onSuccess: () => {
        router.back();
        // onRemoveClose();
      },
    });
  };

  const getVoucherInCart = async (voucherId) => {
    const { data: cartData, isSuccess: isCartSuccess } =
      await refetchCartData();
    let updatedCartData = cartData;
    if (isCartSuccess && cartData === "") {
      updatedCartData = [];
    }
    return updatedCartData.find((item) => item.productId === voucherId);
  };

  const updateCartContext = async (voucherId) => {
    const voucherInCart = await getVoucherInCart(voucherId);
    if (voucherInCart) {
      setCartItems([voucherInCart]);
    }
  };

  const addToCart = (type) => {
    setErrorMessage("");
    countMutate(voucherId, {
      onSuccess: async (voucherQuantity) => {
        const voucherInCart = await getVoucherInCart(voucherId);
        if (voucherInCart) {
          const updatedQuantity = quantity + voucherInCart.quantity;
          if (updatedQuantity <= voucherQuantity) {
            updateCartMutate(
              {
                productId: voucherId,
                qty: updatedQuantity,
                shoppingCartId: voucherInCart.shoppingCartId,
                userId: userData.user_id,
                serviceId: null,
                shoppingCartAttrList: null,
                weeklyScheduleDetailId: null,
              },
              {
                onSuccess: async () => {
                  if (type === "buy") {
                    await updateCartContext(voucherId);
                    router.push(routes.checkoutProducts);
                  }
                },
              }
            );
          } else {
            setErrorMessage(
              "The voucher which is available in the cart has been reached its maximum quantity limit"
            );
          }
        } else {
          if (quantity <= voucherQuantity) {
            cartMutate(
              {
                productId: voucherId,
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
                    await updateCartContext(voucherId);
                    router.push(routes.checkoutProducts);
                  }
                },
              }
            );
          } else {
            const errorMessage =
              voucherQuantity <= 0
                ? "The voucher is sold out"
                : `Only ${voucherQuantity} vouchers available to purchase`;
            setErrorMessage(errorMessage);
          }
        }
      },
    });
  };

  const isQuantityValid = quantity <= voucherData.quantity;
  const isQuantityLess = voucherData.quantity > 0 && voucherData.quantity <= 5;
  const isSoldOut = voucherData.quantity <= 0;

  const formatDate = (date) => format(new Date(date), "dd-MMM-yyyy");

  if (!isVoucherInMarketPlace) {
    return <Error statusCode={404} />;
  }

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
      <Image
        w="full"
        maxH="500px"
        // maxW="600px"
        src={voucherData.productMediaList[0]?.productMediaUrl}
        alt={voucherData.productName}
        objectFit="contain"
      />
      <VStack
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={{ base: 10, lg: 20, xl: 40 }}
      >
        <Box w="full">
          <VStack alignItems="flex-start" spacing={3}>
            <HStack justify="space-between" w="full">
              <LabelText fontSize="2xl">{voucherData.productName}</LabelText>
              <SocialMediaShareButtons
                twitterHashtags={["kridas", "vouchers", "social_media"]}
                fbHashtag={"#kridas"}
                twitterMention="kridas_sports"
              />
            </HStack>

            <Box>
              <HStack alignItems="baseline" spacing={3}>
                <HeadingLarge>
                  {voucherData.productPricing.productSplPrice}{" "}
                  {voucherData.productPricing.productPriceCurrency}
                </HeadingLarge>
                {isSplPriceDifferent && (
                  <HeadingMedium
                    fontWeight="medium"
                    color="gray.500"
                    textDecoration="line-through"
                  >
                    {voucherData.productPricing.productBasePrice}{" "}
                    {voucherData.productPricing.productPriceCurrency}
                  </HeadingMedium>
                )}
              </HStack>
              <TextXtraSmall mt={1} color="gray.500">
                * Inclusive of Tax
              </TextXtraSmall>
            </Box>
            <TextMedium>{voucherData.productDesc}</TextMedium>
            <FieldLayout label="Valid Till:">
              <TextMedium>
                {formatDate(voucherData.voucher.redemptionTillDate)}
              </TextMedium>
            </FieldLayout>
            <FieldLayout
              label={isCreatedByNonSportingPage ? "Category" : "Sport"}
            >
              <TextMedium>{sportCategory.category_name}</TextMedium>
            </FieldLayout>
            <FieldLayout label="Terms and Conditions:">
              {isTermsHtml ? (
                <Box dangerouslySetInnerHTML={{ __html: voucherTermsHtml }} />
              ) : (
                voucherData.voucher.voucherTerms
              )}
            </FieldLayout>

            {isVoucherCreator ? (
              <FieldLayout label="Quantity:">
                <TextMedium>{voucherData.quantity}</TextMedium>
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
                    // max={voucherData.quantity}
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
            {/* {isQuantityLess && !isVoucherCreator && (
              <TextMedium color="red.500">
                Only {voucherData.quantity} vouchers available to purchase
              </TextMedium>
            )} */}
          </VStack>
        </Box>

        <ButtonGroup
          w="full"
          spacing={0}
          gap={3}
          flexDirection={["column", null, "row", "column", "row"]}
          justifyContent="flex-end"
        >
          {isVoucherCreator ? (
            <>
              <Button colorScheme="red" onClick={onRemoveOpen}>
                Remove from Market Place
              </Button>
              <DeleteModal
                isOpen={isRemoveOpen}
                onClose={onRemoveClose}
                title="Remove Voucher"
                content="Are you sure you want to remove this voucher from marketplace?"
                buttonText="Remove"
                isLoading={isUpdateLoading}
                handleDelete={removeFromMarketplace}
              />
              <Button onClick={onVoucherOpen}>Edit</Button>
              <VoucherModal
                isOpen={isVoucherOpen}
                onClose={onVoucherClose}
                type="edit"
                voucherData={voucherData}
                isNonSportingPage={isCreatedByNonSportingPage}
              />
            </>
          ) : (
            <>
              {/* <Button variant="outline" disabled={!isVoucherInCountry}>
                Purchase Gift Voucher
              </Button> */}
              <Button
                onClick={() => addToCart("buy")}
                isLoading={isLoading}
                disabled={isLoading || !isQuantityValid || !isVoucherInCountry}
              >
                Buy Now
              </Button>
              <Button
                bg="black"
                _hover={{
                  bg:
                    !(isLoading || !isQuantityValid || !isVoucherInCountry) &&
                    "blackAlpha.700",
                }}
                onClick={() => addToCart("cart")}
                isLoading={isLoading}
                disabled={isLoading || !isQuantityValid || !isVoucherInCountry}
              >
                Add to Cart
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            Close
          </Button>
        </ButtonGroup>
      </VStack>
    </SimpleGrid>
  );
}
export default VoucherIndex;
