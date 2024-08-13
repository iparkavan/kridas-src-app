import { Text, VStack, Heading } from "@chakra-ui/layout";
import AuthLayout from "./auth-layout";

const RegisterSuccess = (props) => {
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
        <Heading size="md">Email Verification</Heading>
        <Text>A verification email has been sent to</Text>
        <Heading size="md" color="teal">
          {email}
        </Heading>
        <Text>
          Follow the instructions in the email to confirm your registration.
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default RegisterSuccess;
