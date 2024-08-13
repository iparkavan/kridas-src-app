import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Icon,
} from "@chakra-ui/react";
import {
  DollarIcon,
  HandCoinIcon,
  MilestoneIcon,
  Transaction,
  TransactionIcon,
} from "../../ui/icons";
import { TextCustom, TextMedium, TextSmall } from "../../ui/text/text";
import Skeleton from "../../ui/skeleton";

const PointsCard = ({
  type,
  transactionValues,
  milestoneValue,
  pointsEarned,
  pointsRedeemed,
}) => {
  // const { type } = props;

  // console.log(rewardData, "rewardData");

  let labelText, icon, value;

  switch (type) {
    case "noOfTransaction":
      labelText = "No.of Transaction";
      icon = <Icon as={TransactionIcon} fontSize="28px" color="primary.500" />;
      value = transactionValues || 0;
      break;

    case "milestone":
      labelText = "Milestone Acheived";
      icon = <Icon as={MilestoneIcon} fontSize="28px" color="primary.500" />;
      value = milestoneValue || 0;
      break;

    case "kridasPointsEarned":
      labelText = "Kridas Points Earned";
      icon = <Icon as={HandCoinIcon} fontSize="28px" color="primary.500" />;
      value = pointsEarned || 0;
      break;

    case "kridasPointsUsed":
      labelText = "Kridas Points Used";
      icon = <Icon as={DollarIcon} fontSize="28px" color="primary.500" />;
      value = pointsRedeemed || 0;
      break;
  }
  // if (isLoading) return <Skeleton>Loading..</Skeleton>;
  // else
  return (
    <Flex
      p={2}
      bg="white"
      direction="column"
      minW="200px"
      minH="150px"
      borderRadius="2xl"
      gap={2}
    >
      <Menu>
        <MenuButton
          variant="ghost"
          alignSelf="flex-end"
          fontSize="sm"
          color="gray.500"
        >
          Last Week <ChevronDownIcon />
        </MenuButton>
        <MenuList>
          <MenuItem>Last Month</MenuItem>
          <MenuItem>Last Year</MenuItem>
        </MenuList>
      </Menu>
      <Flex px={7} py={1} justifyContent="center" direction="column">
        <HStack>
          {icon}
          <TextMedium color="primary.500">{labelText}</TextMedium>
        </HStack>
        <TextCustom fontSize="5xl" fontWeight="bold">
          {value}
        </TextCustom>
      </Flex>
    </Flex>
  );
};

export default PointsCard;
