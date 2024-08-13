import { Box, HStack, Icon, SimpleGrid } from "@chakra-ui/react";
import { format } from "date-fns";
import { CalendarIcon, DollarIcon, HandCoinIcon } from "../../ui/icons";
import { TextMedium, TextSmall } from "../../ui/text/text";

const TransactionHistory = ({ transaction }) => {
  const formatDate = (date) => format(new Date(date), "dd-MM-yyyy  h:mm aa");

  let pointsEarned, pointsUsed;
  if (transaction.transactionType === "CRED") {
    pointsEarned = transaction.rewardPoints;
    pointsUsed = 0;
  } else {
    pointsUsed = transaction.rewardPoints;
    pointsEarned = 0;
  }

  return (
    <SimpleGrid
      columns={4}
      spacing={10}
      p={5}
      borderRadius="2xl"
      mt={3}
      bg="white"
    >
      <Box>
        <TextSmall color="primary.500">Transaction Details</TextSmall>
        <TextMedium fontWeight="bold">{transaction.transactionName}</TextMedium>
      </Box>

      <HStack spacing={6}>
        <Icon as={CalendarIcon} fontSize="2xl" color="primary.500" />
        <Box>
          <TextSmall color="primary.500">Date & Time</TextSmall>
          <TextMedium fontWeight="bold">
            {formatDate(transaction.transactionDate)}
          </TextMedium>
        </Box>
      </HStack>

      <HStack spacing={6}>
        <Icon as={HandCoinIcon} fontSize="2xl" color="primary.500" />
        <Box>
          <TextSmall color="primary.500">Kridas Points Earned</TextSmall>
          <TextMedium fontWeight="bold" color="green.500">
            {pointsEarned}
          </TextMedium>
        </Box>
      </HStack>

      <HStack spacing={6}>
        <Icon as={DollarIcon} fontSize="2xl" color="primary.500" />
        <Box>
          <TextSmall color="primary.500">Kridas Points Used</TextSmall>
          <TextMedium fontWeight="bold" color="red.500">
            {pointsUsed}
          </TextMedium>
        </Box>
      </HStack>
    </SimpleGrid>
  );
};

export default TransactionHistory;
