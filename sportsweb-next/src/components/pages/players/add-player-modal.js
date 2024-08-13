import { useState } from "react";
import {
  Box,
  ButtonGroup,
  Divider,
  HStack,
  Input,
  SimpleGrid,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import * as yup from "yup";

import { getAddPlayerYupSchema } from "../../../helper/constants/player-constants";
import { useAddPlayer } from "../../../hooks/player-hooks";
import { useUserByPlayerId } from "../../../hooks/user-hooks";
import Button from "../../ui/button";
import { AttachmentIcon, CloseIcon } from "../../ui/icons";
import Modal from "../../ui/modal";
import PhoneNumberInput from "../../ui/phone-input/phone-number-input";
import DatePicker from "../../ui/pickers/date-picker";
import { TextMedium, TextSmall, TextXtraSmall } from "../../ui/text/text";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import IconButton from "../../ui/icon-button";
import { referralToPlayerId } from "../../../helper/constants/user-contants";

const AddPlayerModal = (props) => {
  const { isOpen, onClose, pageData } = props;
  const { mutate, isLoading, isError, error, reset } = useAddPlayer();
  const toast = useToast();
  const [prefillPlayerId, setPrefillPlayerId] = useState("");
  const { data: userData } = useUserByPlayerId(prefillPlayerId);

  const handleClose = () => {
    setPrefillPlayerId("");
    reset();
    onClose();
  };

  const handlePrefillPlayerId = (playerId) => {
    setPrefillPlayerId(playerId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Player Details"
      size="3xl"
    >
      <Formik
        initialValues={{
          player: {
            player_id:
              (userData?.referral_code &&
                referralToPlayerId(userData.referral_code)) ||
              "",
            first_name: userData?.first_name || "",
            last_name: userData?.last_name || "",
            email_id: userData?.user_email || "",
            contact_number: userData?.user_phone || "",
            player_dob:
              (userData?.user_dob && new Date(userData.user_dob)) || "",
          },
          document: null,
        }}
        enableReinitialize={true}
        validationSchema={getAddPlayerYupSchema(yup)}
        onSubmit={(values) => {
          values.player.first_name = values.player.first_name.trim();
          values.player.last_name = values.player.last_name.trim();
          values.player.email_id = values.player.email_id.trim();
          if (values.player.contact_number) {
            values.player.contact_number = formatPhoneNumberIntl(
              values.player.contact_number
            );
          }

          mutate(
            {
              ...values,
              company_id: pageData?.company_id,
            },
            {
              onSuccess: () => {
                toast({
                  title: "Player has been added to your team",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                handleClose();
              },
            }
          );
        }}
      >
        {(formik) => (
          <Form>
            <Divider borderColor="gray.400" />
            <SimpleGrid mt={7} columns={3} spacingX={5} spacingY={7}>
              <VStack>
                <TextXtraSmall color="gray.600" fontWeight="medium">
                  PLAYER ID
                </TextXtraSmall>
                <TextBoxWithValidation
                  name="player.player_id"
                  placeholder="Player ID"
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    handlePrefillPlayerId(formik.values.player.player_id);
                  }}
                />
              </VStack>
              <VStack>
                <TextXtraSmall color="gray.600" fontWeight="medium">
                  EMAIL
                </TextXtraSmall>
                <TextBoxWithValidation
                  name="player.email_id"
                  type="email"
                  placeholder="Email"
                />
              </VStack>
              <VStack>
                <TextXtraSmall color="gray.600" fontWeight="medium">
                  FIRST NAME
                </TextXtraSmall>
                <TextBoxWithValidation
                  name="player.first_name"
                  placeholder="First Name"
                />
              </VStack>
              <VStack>
                <TextXtraSmall color="gray.600" fontWeight="medium">
                  LAST NAME
                </TextXtraSmall>
                <TextBoxWithValidation
                  name="player.last_name"
                  placeholder="Last Name"
                />
              </VStack>

              <VStack>
                <TextXtraSmall color="gray.600" fontWeight="medium">
                  CONTACT NUMBER
                </TextXtraSmall>
                <PhoneNumberInput
                  name="player.contact_number"
                  placeholder="Contact Number"
                />
              </VStack>
              <VStack>
                <TextXtraSmall color="gray.600" fontWeight="medium">
                  DATE OF BIRTH
                </TextXtraSmall>
                <DatePicker
                  name="player.player_dob"
                  placeholderText="Date of Birth"
                />
              </VStack>
            </SimpleGrid>
            <Divider borderColor="gray.400" my={7} />
            {isError && (
              <TextMedium color="red.500" mb={3}>
                {error?.message || "Unable to add player"}
              </TextMedium>
            )}
            <HStack justifyContent="space-between">
              <Box>
                <HStack spacing={3}>
                  <Button
                    as="label"
                    id="upload-file"
                    variant="outline"
                    leftIcon={<AttachmentIcon />}
                    size="sm"
                    cursor="pointer"
                  >
                    Attach Identification Proof
                    <Input
                      type="file"
                      id="upload-file"
                      display="none"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          formik.setFieldValue("document", e.target.files[0]);
                        }
                      }}
                    />
                  </Button>

                  {formik.values.document?.name && (
                    <TextSmall>{formik.values.document.name}</TextSmall>
                  )}
                  {formik.values.document && (
                    <IconButton
                      aria-label="Delete document"
                      variant="solid"
                      size="xs"
                      icon={<CloseIcon />}
                      onClick={() => {
                        formik.setFieldValue("document", null);
                      }}
                    />
                  )}
                </HStack>
                {formik.errors.document && formik.touched.document && (
                  <TextSmall mt={2} color="red.500">
                    {formik.errors.document}
                  </TextSmall>
                )}
              </Box>
              <ButtonGroup spacing={3}>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  Save
                </Button>
              </ButtonGroup>
            </HStack>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddPlayerModal;
