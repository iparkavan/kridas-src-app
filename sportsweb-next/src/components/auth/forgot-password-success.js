import { Text, VStack, Heading } from "@chakra-ui/layout";
import AuthLayout from "./auth-layout";

const ForgotPasswordSuccess = (props) => {
  const { email } = props;
  return (
    <AuthLayout>
      <VStack
        spacing={8}
        alignItems="center"
        bg="white"
        width="full"
        height="50%"
        p={6}
      >
        <Heading size="md">Reset Password</Heading>
        <Text>An email to reset your password has been sent to</Text>
        <Heading size="md" color="teal">
          {email}
        </Heading>
        <Text>
          Follow the instructions in the email to reset your password.
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default ForgotPasswordSuccess;
