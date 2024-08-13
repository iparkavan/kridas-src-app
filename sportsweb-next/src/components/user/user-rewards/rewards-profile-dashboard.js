import {
  Avatar,
  Box,
  Circle,
  Flex,
  HStack,
  Progress,
  Stack,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { TextCustom, TextMedium, TextSmall } from "../../ui/text/text";

const ProfileDashboard = ({ userData }) => {
  return (
    <Box bg="white" borderRadius="2xl" p={5} h="full">
      {/* <TextSmall px={4} py={1} textAlign="right">
        level{" "}
        <Box as="span" fontWeight="900">
          : Alfa
        </Box>
      </TextSmall> */}

      <Flex justify="center">
        <Circle
          bg="linear-gradient(318.65deg, rgba(10, 102, 194, 0.81) 15.16%, rgba(10, 102, 194, 0) 84.18%);"
          p={3}
        >
          <Circle p={3} bg="white">
            <Avatar
              src={userData?.user_profile_img}
              name={userData.full_name}
              size="2xl"
            />
          </Circle>
        </Circle>
      </Flex>

      <VStack w="full" px={10} mt={6} spacing={6}>
        <Flex justify="center" w="full">
          <Box textAlign="center">
            <TextMedium color="primary.500">Current Points</TextMedium>
            <TextCustom fontSize="5xl" fontWeight="bold" justify="center">
              {userData?.reward_point || 0}
            </TextCustom>
          </Box>
          {/* <Box>
            <TextSmall>Cash Value</TextSmall>
            <TextCustom fontSize="2xl" fontWeight="900">
              2,266 INR
            </TextCustom>
          </Box> */}
        </Flex>

        {/* <Progress
          alignSelf="flex-start"
          w="full"
          position="relative"
          borderRadius="2xl"
          colorScheme="primary"
          height="35px"
          value={32}
        >
          <TextMedium
            color="white"
            fontWeight="500"
            top="50%"
            right="calc(68% + 15px)"
            transform="translateY(-50%)"
            position="absolute"
          ></TextMedium>
        </Progress>

        <Flex justify="space-between" w="full">
          <TextSmall>Next Level</TextSmall>
          <TextSmall>
            <Box as="span" fontWeight="900">
              11,330{" "}
            </Box>
            / 23,990
          </TextSmall>
        </Flex> */}
      </VStack>
    </Box>
  );
};

export default ProfileDashboard;
