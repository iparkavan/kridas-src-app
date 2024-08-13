import { useEffect, useState } from "react";
import { Box, Button, useClipboard } from "@chakra-ui/react";

import { HeadingSmall } from "../ui/heading/heading";
import { TextMedium, TextSmall } from "../ui/text/text";
import { useUser } from "../../hooks/user-hooks";

const UserReferralCode = () => {
  const { data: userData = {} } = useUser();
  const [referralLink, setReferralLink] = useState("");
  const { hasCopied, onCopy } = useClipboard(referralLink);

  useEffect(() => {
    setReferralLink(
      `${window.location.origin}/register?rc=${userData["referral_code"]}`
    );
  }, [userData]);

  return (
    <Box bg="white" w="full" p={4} align="flex-start" borderRadius={10}>
      <HeadingSmall>Refer your friends</HeadingSmall>
      <TextMedium my={2}>
        Invite your friends with your referral code and gain more benefits.
      </TextMedium>
      <TextMedium fontWeight="bold">
        Referral Code - {userData["referral_code"]}
      </TextMedium>
      <TextMedium my={1} fontWeight="bold">
        Referral Link
      </TextMedium>
      <TextSmall mb={1} wordBreak="break-all">
        {referralLink}
      </TextSmall>
      <Button
        onClick={onCopy}
        colorScheme="primary"
        variant="outline"
        size="sm"
        position="relative"
        left="50%"
        transform="translate(-50%)"
      >
        {hasCopied ? "Copied" : "Copy"}
      </Button>
    </Box>
  );
};

export default UserReferralCode;
