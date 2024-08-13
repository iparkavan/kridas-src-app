import {
  Box,
  Divider,
  HStack,
  Icon,
  List,
  ListItem,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { PersonRemoveIcon } from "../../ui/icons";
import { HeadingMedium } from "../../ui/heading/heading";
import Button from "../../ui/button";
import AccountDeletionModal from "./account-deletion-modal";

const AccountDeletion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Stack spacing={4}>
      <HStack spacing={4} alignItems="flex-start">
        <Icon as={PersonRemoveIcon} w="6" h="6" />
        <Box>
          <HeadingMedium>Account Deletion</HeadingMedium>
        </Box>
      </HStack>
      <Divider borderColor="gray.300" />
      <Box>
        <List spacing={2}>
          <ListItem>
            Before we proceed, we want to ensure that you are aware of what
            account deletion entails:
          </ListItem>
          <ListItem>
            <Box as="span" fontWeight="bold">
              Permanent Removal:{" "}
            </Box>
            Your account and all associated data will be permanently deleted
            after 30 days upon confirmation and cannot be recovered.
          </ListItem>
          <ListItem>
            <Box as="span" fontWeight="bold">
              Service Access:{" "}
            </Box>
            You will lose access to all [Service/Company Name] services and
            features associated with your account after the completion of the
            deletion process.
          </ListItem>
          <ListItem>
            <Box as="span" fontWeight="bold">
              Data Retention:{" "}
            </Box>
            Some of your data may be retained as required by law or for
            legitimate business purposes, as outlined in our Privacy Policy.
          </ListItem>
          <ListItem>
            <Box as="span" fontWeight="bold">
              Time Frame for Deletion:{" "}
            </Box>
            Your account will be permanently deleted in 30 days after your
            confirmation. If you login back to your account within 30 days, your
            account deletion request will be canceled, and your account will
            remain active.
          </ListItem>
          <ListItem>
            For any questions or concerns, or if you need additional time to
            decide, feel free to contact our support team.
          </ListItem>
          <ListItem>
            To confirm your account deletion, please click the link below:
          </ListItem>
        </List>
      </Box>

      <Button
        leftIcon={<DeleteIcon />}
        colorScheme="red"
        mt={5}
        borderRadius="full"
        alignSelf="flex-start"
        onClick={onOpen}
      >
        Delete your Account
      </Button>

      <AccountDeletionModal isOpen={isOpen} onClose={onClose} />
    </Stack>
  );
};

export default AccountDeletion;
