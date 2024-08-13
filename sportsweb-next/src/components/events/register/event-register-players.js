import { useState } from "react";
import {
  ButtonGroup,
  Checkbox,
  Divider,
  Grid,
  GridItem,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FieldArray, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import * as yup from "yup";
import secureLocalStorage from "react-secure-storage";

import Button from "../../ui/button";
import { HeadingSmall } from "../../ui/heading/heading";
import { TextMedium, TextXtraSmall } from "../../ui/text/text";
import { getEventRegisterPlayersSchema } from "../../../helper/constants/event-constants";
import {
  useRegisterTeam,
  useRegisterTeamValidation,
} from "../../../hooks/team-hooks";
import { convertToPascalCase } from "../../../helper/constants/common-constants";
import helper from "../../../helper/helper";
import EventRegisterPlayer from "./event-register-player";
import { useSearchProducts } from "../../../hooks/product-hooks";
import {
  useAddToCart,
  useDeleteUserCart,
  useUserCart,
} from "../../../hooks/cart-hooks";
import routes from "../../../helper/constants/route-constants";
import { useUser } from "../../../hooks/user-hooks";
import { deleteItemsFromCart } from "../../../helper/constants/cart-constants";

const EventRegisterPlayers = (props) => {
  const {
    eventId,
    tournamentCategoryId,
    isIndividual,
    isDoubles,
    isRegistrationFull,
    sport,
    isPaymentOnline,
  } = props;
  const router = useRouter();
  const toast = useToast();
  const [terms, setTerms] = useState(false);
  const { mutate: registerMutate, isLoading: isRegisterLoading } =
    useRegisterTeam();
  const {
    mutate: registerValidationMutate,
    isLoading: isRegisterValidationLoading,
  } = useRegisterTeamValidation();
  const { data: userData } = useUser();
  const { refetch: refetchCart } = useUserCart(userData?.user_id);
  const { mutate: cartMutate, isLoading: isCartLoading } = useAddToCart();
  const { mutateAsync: deleteMutateAsync, isLoading: isDeleteLoading } =
    useDeleteUserCart();
  const {
    data: productsData,
    isSuccess: isProductSuccess,
    isLoading: isProductLoading,
  } = useSearchProducts({
    productType: "EPRD",
    tournamentCategoryId,
    limit: 1,
  });
  const isProductPresent =
    isPaymentOnline && isProductSuccess && productsData.pages[0] !== "";
  const isLoading =
    isRegisterLoading ||
    isCartLoading ||
    isDeleteLoading ||
    isProductLoading ||
    isRegisterValidationLoading;

  const minDob = new Date(sport.tournamentConfig.age_criteria.age_from);
  const maxDob = new Date(sport.tournamentConfig.age_criteria.age_to);

  const preferencesOffered = sport.preferencesOffered;
  const isApparelPresent = Boolean(
    preferencesOffered?.apparel_preference.length > 0
  );
  const isFoodPresent = Boolean(preferencesOffered?.food_preference.length > 0);
  const arePreferencesPresent = isApparelPresent || isFoodPresent;

  const player = {
    player_id: "",
    first_name: "",
    last_name: "",
    email_id: "",
    contact_number: "",
    gender: "",
    dob: "",
    ...(arePreferencesPresent && { preferences_opted: null }),
  };

  let initialValues;
  if (isIndividual) {
    initialValues = { players: [player] };
  } else if (isDoubles) {
    // Added spread coz all field weren't touched on submit
    initialValues = { players: [{ ...player }, { ...player }] };
  }

  let averageAge;
  if (sport.tournamentConfig.age_criteria.criteria_by === "Average") {
    averageAge = sport.tournamentConfig.age_criteria.age_value;
  }

  const secureEventKey = "KRIDAS_EVENT";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getEventRegisterPlayersSchema(
        yup,
        minDob,
        maxDob,
        averageAge,
        arePreferencesPresent
      )}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize={true}
      onSubmit={async (values, { setSubmitting }) => {
        const updatedValues = {
          ...values,
          tournament_category_id: tournamentCategoryId,
        };
        updatedValues.players.forEach((player) => {
          player.player_id = player.player_id.trim();
          player.first_name = convertToPascalCase(player.first_name);
          player.last_name = convertToPascalCase(player.last_name);
          player.email_id = player.email_id.trim();
          player.contact_number = formatPhoneNumberIntl(player.contact_number);
          player.dob = helper.getJSDateObject(player.dob);
        });
        if (isDoubles) {
          updatedValues.player_type = "Doubles";
        }
        updatedValues.eventId = eventId;

        if (isProductPresent) {
          registerValidationMutate(updatedValues, {
            onSuccess: async () => {
              const { data: cartData, isSuccess: isCartSuccess } =
                await refetchCart();
              let updatedCart = cartData;
              if (isCartSuccess && cartData === "") {
                updatedCart = [];
              }
              await deleteItemsFromCart(
                updatedCart,
                deleteMutateAsync,
                userData.user_id,
                "EPRD"
              );

              const product = productsData.pages[0][0];
              cartMutate(
                {
                  productId: product.productId,
                  qty: 1,
                  userId: userData.user_id,
                  serviceId: null,
                  shoppingCartAttrList: null,
                  shoppingCartId: null,
                  weeklyScheduleDetailId: null,
                },
                {
                  onSuccess: () => {
                    secureLocalStorage.setItem(secureEventKey, updatedValues);
                    router.push(routes.checkoutEvent);
                  },
                }
              );
            },
            onError: (error) => {
              toast({
                title: error?.message || "System error. Please try again",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            },
            onSettled: () => {
              setSubmitting(false);
            },
          });
        } else {
          registerMutate(updatedValues, {
            onSettled: (_, error) => {
              setSubmitting(false);
              let toastTitle;
              if (error) {
                toastTitle = error?.message || "System error. Please try again";
              } else {
                toastTitle = "Registration successful";
              }
              toast({
                title: toastTitle,
                status: error ? "error" : "success",
                duration: 5000,
                isClosable: true,
              });
              if (!error) {
                router.push(`/events/${eventId}`);
              }
            },
          });
        }
      }}
    >
      {({ values, errors }) => (
        <Form>
          <VStack alignItems="flex-start" w="full" spacing={5}>
            <HeadingSmall my={1}>Player(s) Details </HeadingSmall>
            <FieldArray
              name="players"
              render={(playerHelpers) => (
                <Grid
                  w="full"
                  templateColumns={
                    arePreferencesPresent
                      ? "25px 1fr 1fr 1fr 1fr 1fr 1fr 1fr auto"
                      : "25px 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                  }
                  gap={4}
                  justifyItems="center"
                  // alignItems="center"
                  overflowX="auto"
                >
                  <GridItem>
                    <TextXtraSmall color="gray.600" fontWeight="bold">
                      NO
                    </TextXtraSmall>
                  </GridItem>
                  <GridItem>
                    <TextXtraSmall color="gray.600" fontWeight="bold">
                      PLAYER ID
                    </TextXtraSmall>
                  </GridItem>
                  <GridItem>
                    <TextXtraSmall color="gray.600" fontWeight="bold">
                      FIRST NAME
                    </TextXtraSmall>
                  </GridItem>
                  <GridItem>
                    <TextXtraSmall color="gray.600" fontWeight="bold">
                      LAST NAME
                    </TextXtraSmall>
                  </GridItem>
                  <GridItem>
                    <TextXtraSmall color="gray.600" fontWeight="bold">
                      EMAIL
                    </TextXtraSmall>
                  </GridItem>
                  <GridItem>
                    <TextXtraSmall color="gray.600" fontWeight="bold">
                      CONTACT NUMBER
                    </TextXtraSmall>
                  </GridItem>
                  <GridItem>
                    <TextXtraSmall color="gray.600" fontWeight="bold">
                      GENDER
                    </TextXtraSmall>
                  </GridItem>
                  <GridItem>
                    <TextXtraSmall color="gray.600" fontWeight="bold">
                      DOB
                    </TextXtraSmall>
                  </GridItem>
                  {arePreferencesPresent && (
                    <GridItem>
                      <TextXtraSmall color="gray.600" fontWeight="bold">
                        PREFERENCES
                      </TextXtraSmall>
                    </GridItem>
                  )}
                  <GridItem gridColumn="1/-1" justifySelf="stretch">
                    <Divider borderColor="gray.400" />
                  </GridItem>
                  {values.players.map((player, index) => (
                    <EventRegisterPlayer
                      key={index}
                      player={player}
                      index={index}
                      preferencesOffered={preferencesOffered}
                      arePreferencesPresent={arePreferencesPresent}
                      isApparelPresent={isApparelPresent}
                      isFoodPresent={isFoodPresent}
                    />
                  ))}
                  <GridItem gridColumn="1/-1" justifySelf="stretch">
                    <Divider borderColor="gray.400" />
                  </GridItem>
                </Grid>
              )}
            />
            {errors?.players && typeof errors.players === "string" && (
              <TextMedium color="red.500">{errors.players}</TextMedium>
            )}
            <Checkbox
              borderColor="primary.500"
              isChecked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            >
              I agree to all terms & conditions, event rules and indemnity
              clause set out by the event organiser and Kridas - The Sports
              Platform.
            </Checkbox>
            <ButtonGroup spacing={4}>
              <Button
                colorScheme="primary"
                type="submit"
                isLoading={isLoading}
                disabled={!terms || isRegistrationFull}
              >
                {isProductPresent ? "Pay & Register" : "Register"}
              </Button>
              <Button
                colorScheme="primary"
                variant="outline"
                onClick={() => router.push(`/events/${eventId}`)}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </VStack>
        </Form>
      )}
    </Formik>
  );
};

export default EventRegisterPlayers;
