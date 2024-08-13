import { useEffect } from "react";
import {
  VStack,
  PinInput,
  PinInputField,
  HStack,
  Button,
  FormControl,
  FormErrorMessage,
  Box,
  Divider,
} from "@chakra-ui/react";
import { Formik } from "formik";
import * as yup from "yup";

import TextBoxWithValidation from "../ui/textbox/textbox-with-validation";
import { getActivationYupSchema } from "../../helper/constants/user-contants";
import { useActivateUser } from "../../hooks/user-hooks";
import { TextMedium } from "../ui/text/text";
import { HeadingMedium } from "../ui/heading/heading";
import { MailIcon } from "../ui/icons";
import Modal from "../ui/modal";

const ActivateAccount = (props) => {
  const { isOpen, onClose, onLoginOpen, prefillMail, setPrefillMail } = props;
  const { mutate, isLoading, isSuccess, isError, error, reset } =
    useActivateUser();

  const handleLoginOpen = () => {
    reset();
    onClose();
    onLoginOpen();
  };

  const handleClose = () => {
    setPrefillMail("");
    reset();
    onClose();
  };

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(function () {
        onClose();
        onLoginOpen();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccess, onClose, onLoginOpen]);

  return (
    <Modal title="Email Verification" isOpen={isOpen} onClose={handleClose}>
      <VStack
        spacing={5}
        alignItems="center"
        bg="white"
        width="full"
        height="50%"
      >
        <TextMedium>
          A verification code has been sent to your email. Please enter your
          email and verification code.
        </TextMedium>

        <Formik
          initialValues={{ email: prefillMail || "", token: "" }}
          validationSchema={getActivationYupSchema(yup)}
          onSubmit={(values) => {
            values.email = values.email.trim();
            mutate(values);
          }}
        >
          {(formik) => (
            <Box
              as="form"
              w="full"
              onReset={formik.handleReset}
              onSubmit={formik.handleSubmit}
            >
              <VStack spacing={5}>
                <TextBoxWithValidation
                  name="email"
                  placeholder="Email"
                  type="email"
                  borderColor="inherit"
                  rightIcon={<MailIcon />}
                />

                <FormControl
                  isInvalid={formik.touched.token && formik.errors.token}
                >
                  <HStack>
                    <PinInput
                      otp
                      name="token"
                      onChange={(value) => formik.setFieldValue("token", value)}
                      value={formik.values.token}
                      isInvalid={formik.touched.token && formik.errors.token}
                    >
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                  <FormErrorMessage>{formik.errors.token}</FormErrorMessage>
                </FormControl>

                <Button
                  colorScheme="primary"
                  type="submit"
                  isLoading={isLoading}
                  w="full"
                >
                  Verify
                </Button>
              </VStack>
            </Box>
          )}
        </Formik>
        {isSuccess && (
          <TextMedium>
            Your email has been verified. You will be redirected to the login
            page in 5 seconds.
          </TextMedium>
        )}
        {isError && (
          <TextMedium color="red.500">
            {error?.code === "USR404"
              ? "Your email does not exist. Please register to create your account."
              : error?.code === "USR409"
              ? "Your email has already been activated. Please login to continue."
              : "Your email verification has failed due to entered incorrect OTP. Please enter the correct details and try again."}
          </TextMedium>
        )}
        <Divider />
        <HeadingMedium>Already Registered?</HeadingMedium>
        <Button
          variant="outline"
          colorScheme="primary"
          width="full"
          onClick={handleLoginOpen}
        >
          Login
        </Button>
      </VStack>
    </Modal>
  );
};

export default ActivateAccount;
