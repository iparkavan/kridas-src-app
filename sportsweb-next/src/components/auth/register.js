import { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/router";
import {
  Button,
  VStack,
  Divider,
  Input,
  FormControl,
  FormErrorMessage,
  useDisclosure,
  Link,
  InputGroup,
  InputRightElement,
  Box,
} from "@chakra-ui/react";
import * as yup from "yup";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getRegisterYupSchema } from "../../helper/constants/user-contants";
import UserService from "../../services/user-service";
import {
  CalendarIcon,
  MailIcon,
  PasswordIcon,
  PersonIcon,
  ReferenceIcon,
} from "../ui/icons";
import TextBoxWithIcon from "../ui/textbox/textbox-with-icon";
import routes from "../../helper/constants/route-constants";
import ErrorMessage from "../ui/error-message";
import RegisterTerms from "./register-terms";
import RegisterPrivacyPolicy from "./register-privacy-policy";
import { TextSmall } from "../ui/text/text";
import helper from "../../helper/helper";
import Modal from "../ui/modal";
import { convertToPascalCase } from "../../helper/constants/common-constants";

const DatePickerInput = forwardRef((props, ref) => {
  return (
    <InputGroup>
      <Input {...props} ref={ref} />
      <InputRightElement color="gray.400">
        <CalendarIcon />
      </InputRightElement>
    </InputGroup>
  );
});
DatePickerInput.displayName = "DatePickerInput";

const Register = (props) => {
  const { isOpen, onClose, handleOpenVerify, setPrefillMail } = props;
  const router = useRouter();
  const { rc } = router.query;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userDob, setUserDob] = useState(null);
  const [registeredReferralCode, setRegisteredReferralCode] = useState(
    rc || ""
  );
  // const [userPhone, setUserPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [isRegisterDone, setIsRegisterDone] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    isOpen: isTermsOpen,
    onOpen: onTermsOpen,
    onClose: onTermsClose,
  } = useDisclosure();
  const {
    isOpen: isPrivacyOpen,
    onOpen: onPrivacyOpen,
    onClose: onPrivacyClose,
  } = useDisclosure();

  const schema = getRegisterYupSchema(yup);

  useEffect(() => {
    if (isRegisterDone) {
      setPrefillMail(userEmail);
      handleOpenVerify();
      setIsRegisterDone(false);
      // router.push(`${routes.activate}?email=${userEmail}`);
    }
  }, [handleOpenVerify, isRegisterDone, setPrefillMail, userEmail]);

  const signInHandler = () => {
    router.push(routes.login);
  };

  const onChangeHandler = (event) => {
    switch (event.target.name) {
      case "firstName":
        setFirstName(event.target.value);
        break;
      case "lastName":
        setLastName(event.target.value);
        break;
      case "userEmail":
        setUserEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      case "registeredReferralCode":
        setRegisteredReferralCode(event.target.value);
        break;
      // case "userPhone":
      //   setUserPhone(event.target.value);
      //   break;
      default:
        break;
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setErrors({});

    const registerValues = {
      userEmail,
      password,
      firstName,
      lastName,
      // userPhone,
      userDob,
      registeredReferralCode,
    };

    schema
      .validate(registerValues, { abortEarly: false })
      .then(async () => {
        try {
          setIsLoading(true);
          registerValues["firstName"] = convertToPascalCase(
            registerValues["firstName"]
          );
          registerValues["lastName"] = convertToPascalCase(
            registerValues["lastName"]
          );
          registerValues["userEmail"] = registerValues["userEmail"].trim();
          registerValues["userDob"] = helper.getJSDateObject(
            registerValues["userDob"]
          );
          registerValues["registeredReferralCode"] =
            registerValues["registeredReferralCode"]?.trim();

          const response = await UserService.registerUser(registerValues);

          if (response.status !== 201) {
            throw new Error("Something went wrong");
          }
          setIsRegisterDone(true);
        } catch (err) {
          let errorMessage = "Something went wrong";
          if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          }
          setError(errorMessage);
        } finally {
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
    setFirstName("");
    setLastName("");
    setUserEmail("");
    setPassword("");
    setUserDob(null);
    setRegisteredReferralCode("");
    setError("");
    setErrors({});
    onClose();
  };

  return (
    <Box>
      <Modal title="Register" isOpen={isOpen} onClose={handleClose}>
        <form onSubmit={submitHandler} noValidate>
          <VStack spacing={5} width="full">
            {error && <ErrorMessage message={error} />}
            <TextBoxWithIcon
              isRequired
              isInvalid={Boolean(errors.firstName)}
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={onChangeHandler}
              id="firstName"
              name="firstName"
              formErrorMessage={errors.firstName}
              rightIcon={<PersonIcon />}
            />

            <TextBoxWithIcon
              isRequired
              isInvalid={Boolean(errors.lastName)}
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={onChangeHandler}
              id="lastName"
              name="lastName"
              formErrorMessage={errors.lastName}
              rightIcon={<PersonIcon />}
            />

            <TextBoxWithIcon
              isRequired
              isInvalid={Boolean(errors.userEmail)}
              placeholder="Email"
              type="email"
              value={userEmail}
              onChange={onChangeHandler}
              id="userEmail"
              name="userEmail"
              formErrorMessage={errors.userEmail}
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

            <FormControl isInvalid={Boolean(errors.userDob)} zIndex={2}>
              <ReactDatePicker
                dateFormat="dd/MM/yyyy"
                customInput={<DatePickerInput />}
                placeholderText="Date of Birth (dd/mm/yyyy)"
                name="userDob"
                selected={userDob}
                onChange={(val) => setUserDob(val)}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />

              <FormErrorMessage>{errors.userDob}</FormErrorMessage>
            </FormControl>

            <TextBoxWithIcon
              isRequired={false}
              isInvalid={Boolean(errors.registeredReferralCode)}
              placeholder="Referral Code (if any)"
              type="text"
              value={registeredReferralCode}
              onChange={onChangeHandler}
              id="registeredReferralCode"
              name="registeredReferralCode"
              formErrorMessage={errors.registeredReferralCode}
              rightIcon={<ReferenceIcon />}
            />

            {/* <TextBoxWithIcon
            isRequired
            isInvalid={Boolean(errors.userPhone)}
            placeholder="Phone"
            type="userPhone"
            value={userPhone}
            onChange={onChangeHandler}
            id="userPhone"
            name="userPhone"
            formErrorMessage={errors.userPhone}
            rightIcon={<PhoneIcon />}
          /> */}

            <Button
              width="full"
              colorScheme="primary"
              type="submit"
              isLoading={isLoading}
            >
              Register Now
            </Button>
          </VStack>
          <VStack mt={2} spacing={3} width="full">
            <TextSmall>
              By clicking &ldquo;Register Now&ldquo;, you agree to the{" "}
              <Link color="primary.500" onClick={onTermsOpen}>
                Terms
              </Link>{" "}
              and{" "}
              <Link color="primary.500" onClick={onPrivacyOpen}>
                Privacy Policy
              </Link>
              .
            </TextSmall>
            {/* <Divider />
              <HeadingMedium>Already Registered?</HeadingMedium>
              <Button
                width="full"
                colorScheme="primary"
                variant="outline"
                onClick={signInHandler}
              >
                Login
              </Button> */}
          </VStack>
        </form>
      </Modal>
      <RegisterTerms
        isOpen={isTermsOpen}
        onClose={onTermsClose}
      ></RegisterTerms>
      <RegisterPrivacyPolicy
        isOpen={isPrivacyOpen}
        onClose={onPrivacyClose}
      ></RegisterPrivacyPolicy>
    </Box>
  );
};

export default Register;
