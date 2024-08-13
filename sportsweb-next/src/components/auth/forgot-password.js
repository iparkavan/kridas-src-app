import { useState } from "react";
import * as yup from "yup";
import { Button, VStack, Divider, Box } from "@chakra-ui/react";

import ErrorMessage from "../ui/error-message";
import {
  userErrorMessages,
  getForgotPasswordYupSchema,
} from "../../helper/constants/user-contants";
import { MailIcon } from "../ui/icons";
import TextBoxWithIcon from "../ui/textbox/textbox-with-icon";
import { useResetUserPassword } from "../../hooks/user-hooks";
import { HeadingMedium } from "../ui/heading/heading";
import { TextMedium } from "../ui/text/text";
import Modal from "../ui/modal";

const ForgotPassword = (props) => {
  const { isOpen, onClose, onLoginOpen } = props;
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const { mutate, isLoading, isSuccess, reset } = useResetUserPassword();

  const schema = getForgotPasswordYupSchema(yup);

  const onChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setErrors({});
    reset();
    onClose();
  };

  const handleLoginOpen = () => {
    handleClose();
    onLoginOpen();
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setErrors({});

    schema
      .validate({ email }, { abortEarly: false })
      .then(() => {
        mutate(
          { email: email.trim() },
          {
            onSuccess: () => {
              setTimeout(() => handleLoginOpen(), 5000);
            },
            onError: (error) => {
              const errorMessage =
                (error?.response?.data
                  ? userErrorMessages[error.response.data]
                  : userErrorMessages.RESET_FAILED) ||
                userErrorMessages.RESET_FAILED;
              setError(errorMessage);
            },
          }
        );
      })
      .catch((e) => {
        const errorObj = {};
        e.inner.map((error) => {
          errorObj[error.path] = error.message;
        });
        setErrors(errorObj);
      });
  };

  return (
    <Modal title="Forgot Password" isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={submitHandler} noValidate>
        <VStack spacing={5} width="full">
          {error && <ErrorMessage message={error} />}

          <TextBoxWithIcon
            isRequired
            isInvalid={Boolean(errors.email)}
            placeholder="Email"
            type="email"
            value={email}
            onChange={onChangeHandler}
            id="email"
            name="email"
            formErrorMessage={errors.email}
            rightIcon={<MailIcon />}
          />
          <Button
            width="full"
            colorScheme="primary"
            type="submit"
            isLoading={isLoading}
          >
            Reset
          </Button>
          {isSuccess && (
            <>
              <Divider></Divider>
              <TextMedium>
                An email to reset your password has been sent to{" "}
                <Box as="span" fontWeight="bold">
                  {email}
                </Box>
                {". "}
                You will be redirected to the login page in 5 seconds.
              </TextMedium>
            </>
          )}
          <Divider />
          <HeadingMedium>Already Registered?</HeadingMedium>
          <Button
            width="full"
            colorScheme="primary"
            variant="outline"
            onClick={handleLoginOpen}
          >
            Login
          </Button>
        </VStack>
      </form>
    </Modal>
  );
};

export default ForgotPassword;
