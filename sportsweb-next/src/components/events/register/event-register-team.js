import { useState, useMemo } from "react";
import {
  ButtonGroup,
  Checkbox,
  Divider,
  Grid,
  GridItem,
  HStack,
  Stack,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import * as yup from "yup";
import secureLocalStorage from "react-secure-storage";

import { useChildPages, useParentTeamPages } from "../../../hooks/page-hooks";
import { useInfiniteSearchPlayers } from "../../../hooks/player-hooks";
import { useUser } from "../../../hooks/user-hooks";
import Button from "../../ui/button";
import { HeadingSmall } from "../../ui/heading/heading";
import SelectWithValidation from "../../ui/select/select-with-validation";
import { TextMedium, TextXtraSmall } from "../../ui/text/text";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import EventRegisterTeamPlayers from "./event-register-team-players";
import { getEventRegisterTeamSchema } from "../../../helper/constants/event-constants";
import {
  useRegisterTeam,
  useRegisterTeamValidation,
} from "../../../hooks/team-hooks";
import {
  useCategoriesByType,
  useCategoryById,
} from "../../../hooks/category-hooks";
import { convertToPascalCase } from "../../../helper/constants/common-constants";
import helper from "../../../helper/helper";
import EventRegisterTeamPlayer from "./event-register-team-player";
import { useSearchProducts } from "../../../hooks/product-hooks";
import {
  useAddToCart,
  useDeleteUserCart,
  useUserCart,
} from "../../../hooks/cart-hooks";
import routes from "../../../helper/constants/route-constants";
import { deleteItemsFromCart } from "../../../helper/constants/cart-constants";

const EventRegisterTeam = (props) => {
  const {
    eventId,
    sport,
    tournamentCategoryId,
    isRegistrationFull,
    isPaymentOnline,
  } = props;
  const { data: userData } = useUser();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [terms, setTerms] = useState(false);

  const { mutate: registerMutate, isLoading: isRegisterLoading } =
    useRegisterTeam();
  const {
    mutate: registerValidationMutate,
    isLoading: isRegisterValidationLoading,
  } = useRegisterTeamValidation();
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

  const preferencesOffered = sport.preferencesOffered;
  const isApparelPresent = Boolean(
    preferencesOffered?.apparel_preference.length > 0
  );
  const isFoodPresent = Boolean(preferencesOffered?.food_preference.length > 0);
  const arePreferencesPresent = isApparelPresent || isFoodPresent;

  const player = useMemo(
    () => ({
      player_id: "",
      first_name: "",
      last_name: "",
      email_id: "",
      contact_number: "",
      gender: "",
      dob: "",
      ...(arePreferencesPresent && { preferences_opted: null }),
    }),
    [arePreferencesPresent]
  );

  const AddPlayerFromTeam = ({ helpers }) => {
    const formik = useFormikContext();
    const selectedPageId = formik.values.selected_team_id;
    const { data: playersData } = useInfiniteSearchPlayers(selectedPageId, {
      child_company_id: selectedPageId,
      size: 100,
    });

    const arePlayersPresent = Boolean(playersData?.pages[0].totalCount);

    return (
      <>
        <Button
          onClick={onOpen}
          disabled={!selectedPageId || !arePlayersPresent}
        >
          + Add Player From Team
        </Button>
        <EventRegisterTeamPlayers
          isOpen={isOpen}
          onClose={onClose}
          players={playersData?.pages[0].content}
          helpers={helpers}
          sport={sport}
          formik={formik}
          arePreferencesPresent={arePreferencesPresent}
        />
      </>
    );
  };

  const ChildTeamPages = () => {
    const { data: categoryData, isSuccess: isCategorySuccess } =
      useCategoryById(sport.participantCategory);
    const isEnabled = Boolean(userData?.user_id) && isCategorySuccess;
    const { data: childPages } = useChildPages(
      {
        user_id: userData?.user_id,
        sports_id: sport.sports_id,
        ...(categoryData?.category_type !== "OPN" && {
          category_type_id: categoryData?.category_id,
        }),
      },
      isEnabled
    );
    const { handleChange, setFieldValue } = useFormikContext();

    return (
      <SelectWithValidation
        name="selected_team_id"
        placeholder="Select Team"
        w={["full", "sm"]}
        onChange={(e) => {
          handleChange(e);
          setFieldValue("parent_company_id", "");
          setFieldValue("new_team_name", "");
          setFieldValue("page_category", "");
        }}
      >
        <option value="NEWTEAM">Create New Team</option>
        <option value="EXISTINGTEAM">Create New Team from Existing Page</option>
        {childPages?.map((page) => (
          <option key={page.company_id} value={page.company_id}>
            {page.company_name}
          </option>
        ))}
      </SelectWithValidation>
    );
  };

  const ParticipantCategory = () => {
    const { data: categories = [] } = useCategoriesByType("CAT");
    const { data: categoryData } = useCategoryById(sport.participantCategory);
    const filteredCategories = categories?.filter(
      (category) => category.category_type !== "CMN"
    );

    if (!categoryData) return null;
    if (categoryData.category_type !== "OPN") return null;

    return (
      <SelectWithValidation
        name="page_category"
        placeholder="Select Page Category"
        w={["full", "sm"]}
        validate={(value) => {
          if (!value) {
            return "Please select the page category";
          }
        }}
      >
        {filteredCategories?.map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.category_name}
          </option>
        ))}
      </SelectWithValidation>
    );
  };

  const ParentPages = () => {
    const { data: categoryData, isSuccess: isCategorySuccess } =
      useCategoryById(sport.participantCategory);
    const { data: parentTeamPages } = useParentTeamPages(
      {
        user_id: userData?.user_id,
        ...(categoryData?.category_type !== "OPN" && {
          category_type_id: categoryData?.category_id,
        }),
      },
      {
        enabled: isCategorySuccess,
      }
    );

    return (
      <SelectWithValidation
        name="parent_company_id"
        placeholder="Select Page"
        w={["full", "sm"]}
      >
        {parentTeamPages?.map((page) => (
          <option key={page.company_id} value={page.company_id}>
            {page.company_name}
          </option>
        ))}
      </SelectWithValidation>
    );
  };

  const minPlayers = Number(
    sport.tournamentConfig.team_criteria.min_players_per_team
  );
  const maxPlayers = Number(
    sport.tournamentConfig.team_criteria.max_players_per_team
  );
  const minDob = new Date(sport.tournamentConfig.age_criteria.age_from);
  const maxDob = new Date(sport.tournamentConfig.age_criteria.age_to);
  const minMale = sport.tournamentConfig.team_criteria.min_male_players;
  const maxMale = sport.tournamentConfig.team_criteria.max_male_players;
  const minFemale = sport.tournamentConfig.team_criteria.min_female_players;
  const maxFemale = sport.tournamentConfig.team_criteria.max_female_players;
  const initialTeamMembers = useMemo(
    () => new Array(minPlayers).fill().map((_, i) => ({ ...player, key: i })),
    [minPlayers, player]
  );

  let averageAge;
  if (sport.tournamentConfig.age_criteria.criteria_by === "Average") {
    averageAge = sport.tournamentConfig.age_criteria.age_value;
  }

  const secureEventKey = "KRIDAS_EVENT";

  return (
    <Formik
      initialValues={{
        selected_team_id: "",
        parent_company_id: "",
        new_team_name: "",
        team_name: "",
        page_category: "",
        team_members: initialTeamMembers,
        selectedPlayers: [],
      }}
      enableReinitialize={true}
      validationSchema={getEventRegisterTeamSchema(
        yup,
        minPlayers,
        maxPlayers,
        minDob,
        maxDob,
        averageAge,
        minMale,
        maxMale,
        minFemale,
        maxFemale,
        arePreferencesPresent
      )}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, { setSubmitting }) => {
        const {
          selected_team_id,
          parent_company_id,
          selectedPlayers,
          new_team_name,
          page_category,
          ...updatedValues
        } = values;
        if (values.selected_team_id === "NEWTEAM") {
          updatedValues.new_team_name = new_team_name;
          updatedValues.page_category = page_category;
        } else if (values.selected_team_id === "EXISTINGTEAM") {
          updatedValues.parent_company_id = parent_company_id;
          updatedValues.new_team_name = new_team_name;
        } else {
          updatedValues.selected_team_id = selected_team_id;
        }
        updatedValues.team_members.forEach((member) => {
          member.player_id = member.player_id.trim();
          member.first_name = convertToPascalCase(member.first_name);
          member.last_name = convertToPascalCase(member.last_name);
          member.email_id = member.email_id.trim();
          member.contact_number = formatPhoneNumberIntl(member.contact_number);
          member.dob = helper.getJSDateObject(member.dob);
        });
        updatedValues.tournament_category_id = tournamentCategoryId;
        updatedValues.user_id = userData.user_id;
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
          registerMutate(
            { ...updatedValues },
            {
              onSettled: (_, error) => {
                setSubmitting(false);
                let toastTitle;
                if (error) {
                  toastTitle =
                    error?.message || "System error. Please try again";
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
            }
          );
        }
      }}
    >
      {({ values, errors }) => (
        <Form>
          <VStack alignItems="flex-start" w="full" spacing={4}>
            <Stack
              direction={["column", "row"]}
              spacing={[4, 10]}
              alignItems="flex-start"
              w={["full", "auto"]}
            >
              <ChildTeamPages />
              {/* <SelectWithValidation
                name="selected_team_id"
                placeholder="Select Team"
                w={["full", "sm"]}
              >
                <option value="NEWTEAM">Create New Team</option>
                <option value="EXISTINGTEAM">
                  Create New Team from Existing Page
                </option>
                {childPages?.map((page) => (
                  <option key={page.company_id} value={page.company_id}>
                    {page.company_name}
                  </option>
                ))}
              </SelectWithValidation> */}
              {values.selected_team_id === "NEWTEAM" && (
                <TextBoxWithValidation
                  name="new_team_name"
                  placeholder="Team Name"
                  w={["full", "sm"]}
                />
              )}
              {values.selected_team_id === "EXISTINGTEAM" && <ParentPages />}
            </Stack>
            <Stack
              direction={["column", "row"]}
              spacing={[4, 10]}
              alignItems="flex-start"
              w={["full", "auto"]}
            >
              <TextBoxWithValidation
                name="team_name"
                placeholder="Event Team Name"
                w={["full", "sm"]}
              />
              {values.selected_team_id === "NEWTEAM" && <ParticipantCategory />}
              {values.selected_team_id === "EXISTINGTEAM" && (
                <TextBoxWithValidation
                  name="new_team_name"
                  placeholder="Team Name"
                  w={["full", "sm"]}
                />
              )}
            </Stack>
            <FieldArray
              name="team_members"
              render={(teamHelpers) => (
                <>
                  <Stack
                    direction={["column", "row"]}
                    spacing={[5, 7]}
                    mb={4}
                    alignItems={["baseline", "center"]}
                  >
                    <HeadingSmall>Player(s) Details </HeadingSmall>
                    <HeadingSmall display={{ base: "none", sm: "inherit" }}>
                      |
                    </HeadingSmall>
                    <AddPlayerFromTeam helpers={teamHelpers} />
                    <Button
                      variant="link"
                      // Using the last elements key + 1 as next key
                      onClick={() =>
                        teamHelpers.push({
                          ...player,
                          key:
                            values.team_members[values.team_members.length - 1]
                              .key + 1,
                        })
                      }
                      disabled={values.team_members.length >= maxPlayers}
                    >
                      + Add New Player
                    </Button>
                  </Stack>
                  <HStack spacing={5}>
                    <TextMedium>Minimum Players - {minPlayers}</TextMedium>
                    <TextMedium>Maximum Players - {maxPlayers}</TextMedium>
                  </HStack>
                  <Grid
                    w="full"
                    templateColumns={
                      arePreferencesPresent
                        ? "25px 1fr 1fr 1fr 1fr 1fr 1fr 1fr auto 60px"
                        : "25px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 60px"
                    }
                    gap={4}
                    justifyItems="center"
                    overflowX="auto"
                    // alignItems="center"
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
                    <GridItem>
                      <TextXtraSmall color="gray.600" fontWeight="bold">
                        REMOVE
                      </TextXtraSmall>
                    </GridItem>
                    <GridItem gridColumn="1/-1" justifySelf="stretch">
                      <Divider borderColor="gray.400" />
                    </GridItem>
                    {values.team_members.map((teamMember, index) => (
                      <EventRegisterTeamPlayer
                        key={teamMember.key}
                        index={index}
                        teamMember={teamMember}
                        minPlayers={minPlayers}
                        teamHelpers={teamHelpers}
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
                </>
              )}
            />
            {errors?.team_members &&
              typeof errors.team_members === "string" && (
                <TextMedium color="red.500">{errors.team_members}</TextMedium>
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
          </VStack>
          <ButtonGroup mt={5} spacing={4}>
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
        </Form>
      )}
    </Formik>
  );
};

export default EventRegisterTeam;
