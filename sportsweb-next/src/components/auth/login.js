import { useState } from "react";
import { useRouter } from "next/router";
import * as yup from "yup";

import { getSession, signIn } from "next-auth/react";
import ErrorMessage from "../ui/error-message";

import { Button, VStack, Box, Divider, useDisclosure } from "@chakra-ui/react";

import {
  userErrorMessages,
  getLoginYupSchema,
} from "../../helper/constants/user-contants";

import { MailIcon, PasswordIcon } from "../ui/icons";
import TextBoxWithIcon from "../ui/textbox/textbox-with-icon";
import routes from "../../helper/constants/route-constants";
import { HeadingMedium } from "../ui/heading/heading";
import Modal from "../ui/modal";
import ForgotPassword from "./forgot-password";

const Login = (props) => {
  const { isOpen, onOpen, onClose, onVerifyCodeOpen, onRegisterOpen } = props;
  const {
    isOpen: isForgotPasswordOpen,
    onOpen: onForgotPasswordOpen,
    onClose: onForgotPasswordClose,
  } = useDisclosure();

  const router = useRouter();
  const { redir } = router.query;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const schema = getLoginYupSchema(yup);

  const registerHandler = () => {
    router.push(routes.register);
  };

  const onChangeHandler = (event) => {
    switch (event.target.name) {
      case "email":
        setEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setErrors({});

    const loginValues = { email: email.trim(), password };

    schema
      .validate(loginValues, { abortEarly: false })
      .then(async () => {
        try {
          setIsLoading(true);
          const result = await signIn("credentials", {
            redirect: false,
            ...loginValues,
          });
          setIsLoading(false);
          if (result.error === null) {
            // Redirect to home or welcome page
            const { user } = await getSession();
            if (redir) {
              const route = user?.isNewUser
                ? `${routes.welcome}?redir=${redir}`
                : redir;
              router.push(route);
            } else {
              const route = user?.isNewUser ? routes.welcome : routes.home;
              router.push(route);
            }
          } else {
            setError(userErrorMessages.INVALID_LOGIN);
          }
        } catch (e) {
          setError(userErrorMessages.INVALID_LOGIN);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        const errorObj = {};
        e.inner.map((error) => {
          errorObj[error.path] = error.message;
        });
        setErrors(errorObj);
      });
  };

  const handleClose = () => {
    setErrors({});
    setEmail("");
    setPassword("");
    setError("");
    onClose();
  };

  const handleForgotPassword = () => {
    handleClose();
    onForgotPasswordOpen();
  };

  const handleVerifyCode = () => {
    handleClose();
    onVerifyCodeOpen();
  };

  const handleRegister = () => {
    handleClose();
    onRegisterOpen();
  };

  return (
    <Box>
      <Modal title="Login" isOpen={isOpen} onClose={handleClose}>
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

            <TextBoxWithIcon
              isRequired
              isInvalid={Boolean(errors.password)}
              placeholder="Password"
              type="password"
              value={password}
              onChange={onChangeHandler}
              id="password"
              name="password"
              formErrorMessage={errors.password}
              rightIcon={<PasswordIcon />}
            />

            <Button
              alignSelf="flex-end"
              variant="link"
              colorScheme="primary"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </Button>

            <Button
              alignSelf="flex-end"
              variant="link"
              colorScheme="primary"
              onClick={handleVerifyCode}
            >
              Have verification code?
            </Button>

            <Button
              width="full"
              colorScheme="primary"
              type="submit"
              isLoading={isLoading}
            >
              Login
            </Button>
            <Divider />
            <HeadingMedium>New to Kridas?</HeadingMedium>
            <Button
              width="full"
              colorScheme="primary"
              variant="outline"
              onClick={handleRegister}
            >
              Register Now
            </Button>
          </VStack>
        </form>
      </Modal>
      <ForgotPassword
        isOpen={isForgotPasswordOpen}
        onClose={onForgotPasswordClose}
        onLoginOpen={onOpen}
      />
    </Box>
  );
};

export default Login;
