import { useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  ButtonGroup,
  HStack,
  Image,
  SimpleGrid,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useCategoryById } from "../../../hooks/category-hooks";
import { useProductById, useUpdateProduct } from "../../../hooks/product-hooks";
import { useUser } from "../../../hooks/user-hooks";
import Button from "../../ui/button";
import { HeadingLarge, HeadingMedium } from "../../ui/heading/heading";
// import { Share } from "../../ui/icons";
import Skeleton from "../../ui/skeleton";
import LabelText from "../../ui/text/label-text";
import { TextMedium, TextXtraSmall } from "../../ui/text/text";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import ServiceMarketplaceModal from "./service-marketplace-modal";
import ProductServiceModal from "../../pages/marketplace/product-service-modal";
import ServiceDetails from "./service-details";
import SocialMediaShareButtons from "../../common/social-media-share-buttons";
import { usePage } from "../../../hooks/page-hooks";
import { useLocation } from "../../../hooks/location-hooks";
import {
  useCountryByCode,
  useCountryByISOCode,
} from "../../../hooks/country-hooks";
import DeleteModal from "../../ui/modal/delete-modal";
import { days } from "../../../helper/constants/product-constants";
import { feedOptions } from "../../../helper/constants/feed-constants";
import { covertTimeToUTCDate } from "../../../helper/constants/common-constants";

function ServiceIndex({ serviceId }) {
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
  const { data: productData, isLoading: isProductLoading } =
    useProductById(serviceId);
  const { data: pageData } = usePage(productData?.companyId);
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdateProduct();

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
  const isProductCreator = productData.createdBy === userData?.user_id;
  const isProductInMarketPlace = productData.availabilityStatus === "AVL";
  const isSplPriceDifferent =
    isProductInMarketPlace &&
    productData.productPricing.productSplPrice !==
      productData.productPricing.productBasePrice;
  const isProductInCountry =
    countryData?.country_code === productData.productLocation;
  const wasProductInMarketplace =
    productData.availabilityStatus === "NAV" &&
    Boolean(productData.services) &&
    Boolean(productData.productPricing);
  const isServiceCalendarType =
    isProductInMarketPlace &&
    productData.services.serviceWeeklySchedules.length > 0 &&
    productData.services.serviceWeeklySchedules.some(
      (sws) => sws.weeklyScheduleDetails.length > 0
    );

  let inclusionsHtml;
  let isInclusionsHtml = true;
  if (isProductInMarketPlace) {
    try {
      const contentState = convertFromRaw(
        JSON.parse(productData.services.inclusions)
      );
      inclusionsHtml = stateToHTML(contentState, feedOptions);
    } catch (e) {
      isInclusionsHtml = false;
    }
  }

  let serviceTermsHtml;
  let isTermsHtml = true;
  if (isProductInMarketPlace) {
    try {
      const contentState = convertFromRaw(
        JSON.parse(productData.services.serviceTerms)
      );
      serviceTermsHtml = stateToHTML(contentState, feedOptions);
    } catch (e) {
      isTermsHtml = false;
    }
  }

  const removeFromMarketplace = () => {
    const services = {
      ...productData.services,
      serviceWeeklySchedules: productData.services.serviceWeeklySchedules.map(
        (sws) => ({
          ...sws,
          weeklyScheduleDetails: sws.weeklyScheduleDetails.map((wsd) => ({
            ...wsd,
            recordStatus: "UPDATE",
          })),
        })
      ),
    };
    const product = {
      ...productData,
      availabilityStatus: "NAV",
      services,
    };
    updateMutate(product, {
      onSuccess: onRemoveClose,
    });
  };

  return (
    <SimpleGrid
      p={7}
      bg="white"
      columns={{ base: 1, lg: 2 }}
      rowGap={8}
      columnGap={16}
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
        {isProductInMarketPlace &&
          (isProductCreator ? (
            <Box>
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
          ) : (
            <VStack alignItems="flex-start" w="full" spacing={2}>
              <HStack justify="space-between" w="full">
                <LabelText fontSize="2xl">{productData.productName}</LabelText>
                <SocialMediaShareButtons
                  twitterHashtags={["kridas", "services", "social_media"]}
                  fbHashtag={"#kridas"}
                  twitterMention="kridas_sports"
                />
              </HStack>
              <TextMedium>{productCountry?.country_name}</TextMedium>
              <TextMedium>{productData.productDesc}</TextMedium>
              <TextMedium fontWeight="medium">
                {productCategory?.category_name}
              </TextMedium>
              <TextMedium fontWeight="medium">
                {sportCategory?.category_name}
              </TextMedium>
              <FieldLayout label="Inclusions:">
                {isInclusionsHtml ? (
                  <Box dangerouslySetInnerHTML={{ __html: inclusionsHtml }} />
                ) : (
                  productData.services.inclusions
                )}
              </FieldLayout>
              <FieldLayout label="Terms and Conditions:">
                {isTermsHtml ? (
                  <Box dangerouslySetInnerHTML={{ __html: serviceTermsHtml }} />
                ) : (
                  productData.services.serviceTerms
                )}
              </FieldLayout>
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
              <TextXtraSmall color="gray.500">* Inclusive of Tax</TextXtraSmall>
            </VStack>
          ))}
      </VStack>

      <VStack
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={{ base: 10, lg: 20, xl: 40 }}
      >
        {/* <Box w="full"> */}
        {isProductInMarketPlace && !isProductCreator ? (
          <ServiceDetails
            productData={productData}
            isProductInCountry={isProductInCountry}
            isServiceCalendarType={isServiceCalendarType}
          />
        ) : (
          <Box w="full">
            <HStack justify="space-between">
              <LabelText fontSize="2xl">{productData.productName}</LabelText>
              <SocialMediaShareButtons
                twitterHashtags={["kridas", "services", "social_media"]}
                fbHashtag={"#kridas"}
                twitterMention="kridas_sports"
              />
            </HStack>
            <VStack alignItems="justify" spacing={3}>
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
                  {/* <FieldLayout label=" Slot Duration:">
                    <TextMedium>1 hour</TextMedium>
                  </FieldLayout>
                  <FieldLayout label=" Available Days:">
                    <TextMedium>Mon, Fri</TextMedium>
                  </FieldLayout>
                  <FieldLayout label=" Available Slots:">
                    <TextMedium>3</TextMedium>
                  </FieldLayout> */}
                  {isServiceCalendarType && (
                    <FieldLayout label="Available Days & Slots:">
                      <Accordion allowMultiple w="full">
                        {productData.services.serviceWeeklySchedules.map(
                          (weeklySchedule) => {
                            const isweeklyScheduleDetailsPresent =
                              weeklySchedule.weeklyScheduleDetails.length > 0;
                            if (!isweeklyScheduleDetailsPresent) return;
                            const day = days[weeklySchedule.weekDay];
                            return (
                              <AccordionItem
                                key={weeklySchedule.serviceWeeklyScheduleId}
                                border="1px solid var(--chakra-colors-gray-300)"
                              >
                                <AccordionButton borderBottom="1px solid var(--chakra-colors-gray-300)">
                                  <Box flex="1" textAlign="left">
                                    {day}
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel py={2}>
                                  {weeklySchedule.weeklyScheduleDetails.map(
                                    (scheduleDetails) => {
                                      const startDate = covertTimeToUTCDate(
                                        scheduleDetails.startTime
                                      );
                                      const endDate = covertTimeToUTCDate(
                                        scheduleDetails.endTime
                                      );
                                      const startTime = format(
                                        startDate,
                                        "hh:mm aa"
                                      );
                                      const endTime = format(
                                        endDate,
                                        "hh:mm aa"
                                      );
                                      return (
                                        <TextMedium
                                          key={
                                            scheduleDetails.weeklyScheduleDetailId
                                          }
                                        >
                                          {startTime} - {endTime}
                                        </TextMedium>
                                      );
                                    }
                                  )}
                                </AccordionPanel>
                              </AccordionItem>
                            );
                          }
                        )}
                      </Accordion>
                    </FieldLayout>
                  )}
                  {/* {!isServiceCalendarType && (
                    <FieldLayout label="No of users can avail the service:">
                      <TextMedium>{productData.quantity}</TextMedium>
                    </FieldLayout>
                  )} */}
                  <FieldLayout label="Inclusions:">
                    {isInclusionsHtml ? (
                      <Box
                        dangerouslySetInnerHTML={{ __html: inclusionsHtml }}
                      />
                    ) : (
                      productData.services.inclusions
                    )}
                  </FieldLayout>
                  <FieldLayout label="Terms and Conditions:">
                    {isTermsHtml ? (
                      <Box
                        dangerouslySetInnerHTML={{ __html: serviceTermsHtml }}
                      />
                    ) : (
                      productData.services.serviceTerms
                    )}
                  </FieldLayout>
                </>
              )}
            </VStack>
          </Box>
        )}
        {/* </Box> */}

        {!(isProductInMarketPlace && !isProductCreator) && (
          <ButtonGroup
            w="full"
            flexDirection={["column", null, "row", "column", "row"]}
            spacing={0}
            gap={3}
            justifyContent="flex-end"
          >
            {isProductCreator && (
              <>
                {isProductInMarketPlace ? (
                  <>
                    <Button colorScheme="red" onClick={onRemoveOpen}>
                      Remove from Market Place
                    </Button>
                    <DeleteModal
                      isOpen={isRemoveOpen}
                      onClose={onRemoveClose}
                      title="Remove Service"
                      content="Are you sure you want to remove this service from marketplace?"
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
            )}

            <ServiceMarketplaceModal
              isOpen={isMarketOpen}
              onClose={onMarketClose}
              serviceData={productData}
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
                // Disabled initially for calendar type services
                // disabled={isServiceCalendarType}
              >
                Edit
              </Button>
            )}

            <ProductServiceModal
              isOpen={isProductOpen}
              onClose={onProductClose}
              mode="edit"
              productData={productData}
              type="service"
            />

            <Button variant="outline" onClick={() => router.back()}>
              Close
            </Button>
          </ButtonGroup>
        )}
      </VStack>
    </SimpleGrid>
  );
}
export default ServiceIndex;
