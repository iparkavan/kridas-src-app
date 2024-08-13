import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Skeleton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import routes from "../../../helper/constants/route-constants";
import { useUserRewards } from "../../../hooks/activity-hook";
import { useUser } from "../../../hooks/user-hooks";
import { HeadingLarge, HeadingMedium } from "../../ui/heading/heading";
import { Activity, CoinIcon } from "../../ui/icons";
import { TextMedium } from "../../ui/text/text";
import PointsCard from "./reward-points-card";
import ProfileDashboard from "./rewards-profile-dashboard";
import TransactionHistory from "./rewards-transaction-history";

const RewardsIndex = () => {
  const { data: userData = {} } = useUser();
  const { data: rewardData, isLoading } = useUserRewards({
    userId: userData.user_id,
  });
  const router = useRouter();

  return (
    <Box w="full">
      <HStack justify="space-between">
        <HStack spacing={6} w="full">
          <HeadingLarge>Kridas Points</HeadingLarge>
          <Icon
            as={CoinIcon}
            fontSize="24px"
            color="var(--chakra-colors-yellow-500)"
          />
        </HStack>
        <HStack>
          <Button
            rightIcon={<Activity />}
            onClick={() => router.push(routes.userActivity)}
          >
            Activity log
          </Button>
          <Button variant="link" textDecoration="underline">
            FAQ
          </Button>
        </HStack>
      </HStack>

      <HeadingMedium mt={10} mb={3}>
        Rewards
      </HeadingMedium>
      <Grid
        templateRows="repeat(2, 2fr)"
        templateColumns="repeat(3, 1fr)"
        gap={6}
      >
        <GridItem rowSpan={2}>
          <ProfileDashboard userData={userData} />
        </GridItem>
        <GridItem colSpan={1}>
          <PointsCard
            type="noOfTransaction"
            transactionValues={rewardData && rewardData?.transactions}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <PointsCard
            type="milestone"
            milestoneValue={rewardData && rewardData?.mileStones}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <PointsCard
            type="kridasPointsEarned"
            pointsEarned={rewardData && rewardData?.pointsEarned}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <PointsCard
            type="kridasPointsUsed"
            pointsRedeemed={rewardData && rewardData?.pointsRedeemed}
          />
        </GridItem>
      </Grid>
      {/* ========================================================= */}
      {/* <HStack mt={6} spacing="80px"></HStack> */}

      <HeadingMedium mt={10}>Transaction History</HeadingMedium>
      <Skeleton isLoaded={!isLoading}>
        {rewardData?.rewardsTransactionDetails?.length > 0 ? (
          rewardData.rewardsTransactionDetails.map((transaction, index) => (
            <TransactionHistory transaction={transaction} key={index} />
          ))
        ) : (
          <TextMedium mt={2}>No transactions are present</TextMedium>
        )}
      </Skeleton>
    </Box>
  );
};

export default RewardsIndex;
