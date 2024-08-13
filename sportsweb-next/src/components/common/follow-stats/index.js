import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";

const FollowStats = ({ number, label, ...props }) => {
  return (
    <Stat flex="revert" textAlign="center" {...props}>
      <StatNumber color="primary.500" fontSize="3xl">
        {number}
      </StatNumber>
      <StatLabel mt={1} color="gray.600" textTransform="uppercase">
        {label}
      </StatLabel>
    </Stat>
  );
};

export default FollowStats;
