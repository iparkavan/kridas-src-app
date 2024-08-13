import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Text, VStack, Heading } from "@chakra-ui/layout";
import AuthLayout from "./auth-layout";
import routes from "../../helper/constants/route-constants";
import userService from "../../services/user-service";

const ActivateAccount = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const activateUser = async () => {
      try {
        setIsLoading(true);
        const { token } = router.query;
        const userEmail = await userService.processActivation(token);
        if (userEmail !== "") {
          await userService.activateUser(userEmail, token);
          setIsActivated(true);
        }
      } catch (e) {
        console.log(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!router.isReady) return;

    if (!isActivated) {
      activateUser();
    }
  }, [router.isReady, isActivated, router.query]);

  useEffect(() => {
    const timeout = setTimeout(function () {
      router.push(routes.login);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [router]);

  return isLoading ? (
    <DisplayContent>Verification in progress...</DisplayContent>
  ) : (
    <DisplayContent>
      {isActivated
        ? "Account has been verified successfully."
        : "The link is no longer valid."}
    </DisplayContent>
  );
};

const DisplayContent = (props) => {
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
        <Heading size="md">Account Verification</Heading>
        <Text>{props.children}</Text>

        <Text>You will be redirected to login page in 10 seconds...</Text>
      </VStack>
    </AuthLayout>
  );
};

export default ActivateAccount;
