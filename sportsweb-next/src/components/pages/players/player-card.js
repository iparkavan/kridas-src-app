import {
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { TriangleDownIcon } from "@chakra-ui/icons";
import { TextMedium, TextSmall } from "../../ui/text/text";
import { useUpdatePlayerStatus } from "../../../hooks/player-hooks";
import { useSports } from "../../../hooks/sports-hooks";

const PlayerCard = ({ player, isCurrentAndChildPage }) => {
  const { data: sportsData = [] } = useSports();
  const { mutate, isLoading } = useUpdatePlayerStatus();

  const playerName = `${player.user_details.first_name} ${player.user_details.last_name}`;
  const isPlayerActive = player.user_status === "AC";
  const sportName = sportsData?.find(
    (sport) => sport.sports_id == player?.sports_id
  )?.sports_name;

  const handleStatus = (status) => {
    mutate({
      company_team_players_id: player.company_team_players_id,
      user_status: status,
    });
  };

  return (
    <LinkBox
      border="1px solid"
      borderColor="gray.400"
      px={3}
      py={5}
      borderRadius="lg"
      maxW="350px"
    >
      <Flex alignItems="center">
        <HStack spacing={4}>
          <Avatar
            size="lg"
            src={player.user_details.user_profile_img}
            name={playerName}
          />
          <Box>
            <LinkOverlay href={`/${player.user_details.user_name}`}>
              <TextMedium noOfLines={1}>{playerName}</TextMedium>
            </LinkOverlay>
            <TextSmall color="gray.500">{sportName}</TextSmall>
            <Badge colorScheme={isPlayerActive ? "green" : "red"}>
              {isPlayerActive ? "Active" : "Inactive"}
            </Badge>
          </Box>
        </HStack>
        {isCurrentAndChildPage && (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Player options"
              icon={<TriangleDownIcon />}
              variant="ghost"
              ml="auto"
              isLoading={isLoading}
            />
            <MenuList zIndex={2}>
              <MenuItem onClick={() => handleStatus("AC")}>Active</MenuItem>
              <MenuItem onClick={() => handleStatus("IN")}>Inactive</MenuItem>
              {/* <MenuItem>Delete</MenuItem> */}
            </MenuList>
          </Menu>
        )}
      </Flex>
    </LinkBox>
  );
};

export default PlayerCard;
