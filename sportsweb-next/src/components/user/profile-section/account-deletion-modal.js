import { Grid, Skeleton, Stack, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";

import Modal from "../../ui/modal";
import { getAccountDeletionYupSchema } from "../../../helper/constants/user-contants";
import LabelText from "../../ui/text/label-text";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import TextAreaWithValidation from "../../ui/textbox/textarea-with-validation";
import Button from "../../ui/button";
import {
  useGetAccountDeletionByUserId,
  usePostAccountDeletion,
} from "../../../hooks/account-deletion-hooks";
import { useUser } from "../../../hooks/user-hooks";
import { TextMedium } from "../../ui/text/text";

const AccountDeletionModal = (props) => {
  const { isOpen, onClose } = props;

  const toast = useToast();
  const { data: userData } = useUser();

  const { mutate, isLoading: isPostDeleteLoading } = usePostAccountDeletion();
  const { data: userAccountDeletion, isLoading: isUserAccountDeletionLoading } =
    useGetAccountDeletionByUserId(userData.user_id);

  const isAccountDeletionRequestSent =
    userAccountDeletion?.user_id === userData.user_id;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account">
      {isUserAccountDeletionLoading ? (
        <Skeleton h={5} />
      ) : isAccountDeletionRequestSent ? (
        <TextMedium>
          Your account deletion request has been initiated. Your account will be
          permanently deleted in 30 days. If you login back to your account
          within 30 days, your account deletion request will be cancelled, and
          your account will remain active.
        </TextMedium>
      ) : (
        <Formik
          initialValues={{
            password: "",
            deletion_reason: "",
          }}
          validationSchema={getAccountDeletionYupSchema(yup)}
          onSubmit={(values, { setSubmitting }) => {
            mutate(
              {
                email: userData.user_email,
                password: values.password,
                user_id: userData.user_id,
                request_date: new Date(),
                deletion_reason: values.deletion_reason.trim() || null,
                is_deleted: false,
                deletion_date: null,
              },
              {
                onError: (error) => {
                  const errorMessage =
                    error.response?.status === 401
                      ? error.response.data
                      : "Unable to delete your account. Please try again";
                  toast({
                    title: errorMessage,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                },
              }
            );
            setSubmitting(false);
          }}
        >
          <Form>
            <Grid
              templateColumns="auto 1fr"
              maxW="lg"
              gap={5}
              alignItems="center"
            >
              <LabelText>Password</LabelText>
              <TextBoxWithValidation name="password" type="password" />
              <LabelText>Reason</LabelText>
              <TextAreaWithValidation name="deletion_reason" />
            </Grid>

            <Stack>
              <Button
                colorScheme="red"
                mt={5}
                ml="auto"
                type="submit"
                isLoading={isPostDeleteLoading}
              >
                Confirm Account Deletion
              </Button>
            </Stack>
          </Form>
        </Formik>
      )}
    </Modal>
  );
};

export default AccountDeletionModal;
